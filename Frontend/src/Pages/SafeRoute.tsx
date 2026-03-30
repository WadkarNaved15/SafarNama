import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleMap, Polyline, Marker, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SAFEROUTE_API_URL = import.meta.env.VITE_SAFEROUTE_API_URL || 'https://hershield.nexie.in';
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

interface Coordinate { lat: number; lng: number; }
interface RouteData {
  summary: string;
  risk_level: 'Safe' | 'Moderate' | 'High';
  safety_score: number;
  duration: { text: string };
  distance: { text: string };
  polyline: string;
  coordinates: Coordinate[];
}

// ─── Decode polyline ──────────────────────────────────────────────────────────
const decodePolyline = (encoded: string): Coordinate[] => {
  if (!encoded) return [];
  const poly: Coordinate[] = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    shift = 0; result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    poly.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return poly;
};

// ─── Risk config ──────────────────────────────────────────────────────────────
const riskConfig = {
  Safe:     { color: '#10b981', glow: 'rgba(16,185,129,0.35)', bg: 'rgba(16,185,129,0.12)', label: 'Safe',     dot: '#10b981' },
  Moderate: { color: '#f59e0b', glow: 'rgba(245,158,11,0.35)',  bg: 'rgba(245,158,11,0.12)',  label: 'Moderate', dot: '#f59e0b' },
  High:     { color: '#ef4444', glow: 'rgba(239,68,68,0.35)',   bg: 'rgba(239,68,68,0.12)',   label: 'High Risk', dot: '#ef4444' },
};

// ─── SVG icons ────────────────────────────────────────────────────────────────
const IC = {
  back: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>,
  pin:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-6-8-13a8 8 0 1 1 16 0c0 7-8 13-8 13zm0-10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>,
  nav:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>,
  swap: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>,
  clock:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  road: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3l2 18M19 3l-2 18M5 9h14M5 15h14"/></svg>,
  shield:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
};

// ─── Map style (dark, muted) ──────────────────────────────────────────────────
const darkMapStyle = [
  { elementType: 'geometry',        stylers: [{ color: '#1a1f2e' }] },
  { elementType: 'labels.text.fill',stylers: [{ color: '#6b7a99' }] },
  { elementType: 'labels.text.stroke',stylers:[{ color: '#1a1f2e' }] },
  { featureType: 'road',             elementType: 'geometry',     stylers: [{ color: '#2a3147' }] },
  { featureType: 'road.highway',     elementType: 'geometry',     stylers: [{ color: '#344060' }] },
  { featureType: 'road',             elementType: 'labels.text.fill', stylers: [{ color: '#8899bb' }] },
  { featureType: 'water',            elementType: 'geometry',     stylers: [{ color: '#0e1422' }] },
  { featureType: 'poi',              elementType: 'geometry',     stylers: [{ color: '#1e2535' }] },
  { featureType: 'poi.park',         elementType: 'geometry',     stylers: [{ color: '#192430' }] },
  { featureType: 'transit',          elementType: 'geometry',     stylers: [{ color: '#1e2535' }] },
  { featureType: 'administrative',   elementType: 'geometry.stroke', stylers: [{ color: '#2a3147' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#8899cc' }] },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
const SafeRouteScreen: React.FC = () => {
  const mapRef    = useRef<google.maps.Map | null>(null);
  const navigate  = useNavigate();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const [origin, setOrigin]                   = useState('');
  const [destination, setDestination]         = useState('');
  const [routes, setRoutes]                   = useState<RouteData[]>([]);
  const [loading, setLoading]                 = useState(false);
  const [addressLoading, setAddressLoading]   = useState(false);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [cardVisible, setCardVisible]         = useState(false);

  const defaultCenter = { lat: 19.076, lng: 72.8777 };

  const onLoad    = useCallback((map: google.maps.Map) => { mapRef.current = map; }, []);
  const onUnmount = useCallback(() => { mapRef.current = null; }, []);

  const fillAddressFromCoordinates = async (lat: number, lng: number) => {
    if (!isLoaded) return;
    try {
      mapRef.current?.panTo({ lat, lng });
      mapRef.current?.setZoom(14);
      const geocoder = new window.google.maps.Geocoder();
      const res = await geocoder.geocode({ location: { lat, lng } });
      setOrigin(res.results[0]?.formatted_address ?? `${lat}, ${lng}`);
    } catch { setOrigin(`${lat}, ${lng}`); }
    finally  { setAddressLoading(false); }
  };

  const fetchCurrentLocation = () => {
    setAddressLoading(true);
    if (!navigator.geolocation) { setAddressLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      p  => fillAddressFromCoordinates(p.coords.latitude, p.coords.longitude),
      () => setAddressLoading(false),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => { if (isLoaded) fetchCurrentLocation(); }, [isLoaded]);

  const focusOnRoute = (coords: Coordinate[]) => {
    if (!coords.length || !mapRef.current) return;
    const bounds = new window.google.maps.LatLngBounds();
    coords.forEach(c => bounds.extend(c));
    mapRef.current.fitBounds(bounds, { top: 300, bottom: 280, left: 60, right: 60 });
  };

  const fetchSafeRoutes = async () => {
    if (!origin || !destination) return;
    setLoading(true);
    setRoutes([]);
    setCardVisible(false);
    try {
      const res = await axios.post(`${SAFEROUTE_API_URL}/safeRoute`, { origin, destination });
      if (res.data.success && res.data.routes.length > 0) {
        const fetched: RouteData[] = res.data.routes.map((r: any) => ({
          ...r, coordinates: decodePolyline(r.polyline),
        }));
        setRoutes(fetched);
        setSelectedRouteIndex(0);
        focusOnRoute(fetched[0].coordinates);
        setTimeout(() => setCardVisible(true), 100);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const selectNextRoute = () => {
    if (!routes.length) return;
    const next = (selectedRouteIndex + 1) % routes.length;
    setSelectedRouteIndex(next);
    focusOnRoute(routes[next].coordinates);
  };

  const startNavigation = () => {
    const r = routes[selectedRouteIndex];
    if (!r) return;
    const dest = r.coordinates[r.coordinates.length - 1];
    const mid  = r.coordinates[Math.floor(r.coordinates.length / 2)];
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${dest.lat},${dest.lng}&waypoints=${mid.lat},${mid.lng}&travelmode=driving`, '_blank');
  };

  const selected = routes[selectedRouteIndex];
  const risk     = selected ? riskConfig[selected.risk_level] : null;

  if (!isLoaded) return (
    <div style={{ width:'100vw', height:'100vh', background:'#0f1523', display:'flex', alignItems:'center', justifyContent:'center', color:'#6b7a99', fontFamily:'system-ui', fontSize:14, letterSpacing:2 }}>
      LOADING MAP…
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .sr-root { font-family: 'DM Sans', sans-serif; position: relative; width: 100vw; height: 100dvh; overflow: hidden; background: #0f1523; }

        /* ── Search card ─────────────────────────────────────────────── */
        .sr-search {
          position: absolute; top: 20px; left: 50%; transform: translateX(-50%);
          width: min(92vw, 420px); z-index: 20; pointer-events: auto;
          background: rgba(15,21,35,0.82);
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 18px 20px 20px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
          animation: srSlideDown 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .sr-toprow {
          display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
        }
        .sr-back {
          width: 36px; height: 36px; border-radius: 12px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          color: #c8d0e0; cursor: pointer; transition: all 0.15s; flex-shrink: 0;
        }
        .sr-back:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .sr-title {
          font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
          color: #e8edf8; letter-spacing: 0.3px; flex: 1;
        }
        .sr-badge {
          display: flex; align-items: center; gap: 5px;
          background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.25);
          border-radius: 20px; padding: 4px 10px;
          font-size: 11px; font-weight: 600; color: #10b981; letter-spacing: 0.5px;
        }
        .sr-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: #10b981; animation: srPulse 2s infinite; }

        /* ── Input group ─────────────────────────────────────────────── */
        .sr-inputs {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; overflow: hidden; margin-bottom: 14px;
        }
        .sr-input-row { display: flex; align-items: center; }
        .sr-input-icon { padding: 0 12px; color: rgba(255,255,255,0.2); flex-shrink: 0; }
        .sr-input {
          flex: 1; height: 50px; background: transparent; border: none; outline: none;
          font-size: 14px; color: #e0e8f8; font-family: 'DM Sans', sans-serif;
          padding: 0 8px 0 0;
        }
        .sr-input::placeholder { color: rgba(200,210,230,0.35); }
        .sr-input-sep { height: 1px; margin: 0 12px; background: rgba(255,255,255,0.06); }
        .sr-gps {
          width: 36px; height: 36px; margin-right: 8px; border-radius: 10px;
          background: rgba(14,165,233,0.12); border: 1px solid rgba(14,165,233,0.25);
          display: flex; align-items: center; justify-content: center;
          color: #38bdf8; cursor: pointer; font-size: 15px; transition: all 0.15s; flex-shrink: 0;
        }
        .sr-gps:hover { background: rgba(14,165,233,0.2); }
        .sr-gps:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Go button ───────────────────────────────────────────────── */
        .sr-go {
          width: 100%; height: 50px; border: none; border-radius: 14px; cursor: pointer;
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
          letter-spacing: 0.5px;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: white;
          box-shadow: 0 4px 20px rgba(2,132,199,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
          transition: all 0.18s;
          position: relative; overflow: hidden;
        }
        .sr-go:hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(2,132,199,0.5), inset 0 1px 0 rgba(255,255,255,0.15); }
        .sr-go:active { transform: translateY(0); }
        .sr-go:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .sr-go-shimmer {
          position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          animation: srShimmer 2s infinite;
        }

        /* ── Bottom card ─────────────────────────────────────────────── */
        .sr-bottom {
          position: absolute; bottom: 0; left: 0; right: 0; z-index: 20;
          padding: 0 0 env(safe-area-inset-bottom, 16px);
          display: flex; justify-content: center;
        }
        .sr-bottom-inner {
          width: min(92vw, 420px);
          background: rgba(15,21,35,0.88);
          backdrop-filter: blur(24px) saturate(1.4);
          -webkit-backdrop-filter: blur(24px) saturate(1.4);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px 28px 20px 20px;
          padding: 20px;
          box-shadow: 0 -8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
          animation: srSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
          margin-bottom: 16px;
        }

        /* ── Route header ────────────────────────────────────────────── */
        .sr-route-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
        .sr-route-count { font-size: 10px; font-weight: 700; color: rgba(200,210,230,0.4); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; }
        .sr-route-name {
          font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 800;
          color: #e8edf8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;
        }
        .sr-risk-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 20px; border: 1px solid;
          font-size: 12px; font-weight: 700; letter-spacing: 0.3px; flex-shrink: 0;
        }
        .sr-risk-dot { width: 6px; height: 6px; border-radius: 50%; }

        /* ── Score bar ───────────────────────────────────────────────── */
        .sr-score-wrap { margin-bottom: 16px; }
        .sr-score-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .sr-score-label { font-size: 11px; font-weight: 600; color: rgba(200,210,230,0.4); letter-spacing: 0.8px; text-transform: uppercase; }
        .sr-score-pct { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800; }
        .sr-score-track { height: 6px; background: rgba(255,255,255,0.07); border-radius: 99px; overflow: hidden; }
        .sr-score-fill { height: 100%; border-radius: 99px; transition: width 0.6s cubic-bezier(0.4,0,0.2,1); }

        /* ── Stats row ───────────────────────────────────────────────── */
        .sr-stats {
          display: grid; grid-template-columns: 1fr 1px 1fr 1px 1fr;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 14px 8px; margin-bottom: 16px;
          align-items: center;
        }
        .sr-stat { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .sr-stat-icon-row { display: flex; align-items: center; gap: 5px; color: rgba(200,210,230,0.35); margin-bottom: 1px; }
        .sr-stat-label { font-size: 10px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; color: rgba(200,210,230,0.35); }
        .sr-stat-value { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #dce6f8; }
        .sr-stat-sep { width: 1px; height: 32px; background: rgba(255,255,255,0.07); }

        /* ── Action buttons ──────────────────────────────────────────── */
        .sr-actions { display: flex; gap: 10px; }
        .sr-alt-btn {
          flex: 1; height: 48px; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05); border-radius: 14px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: #a0aec8;
          transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .sr-alt-btn:hover { background: rgba(255,255,255,0.09); color: #dce6f8; border-color: rgba(255,255,255,0.18); }
        .sr-nav-btn {
          flex: 2; height: 48px; border: none; border-radius: 14px; cursor: pointer;
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
          color: white; letter-spacing: 0.3px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.18s; position: relative; overflow: hidden;
        }
        .sr-nav-btn:hover { transform: translateY(-1px); }
        .sr-nav-btn:active { transform: translateY(0); }

        /* ── Polyline pulse animation (via className on SVG paths isn't possible,
              but we animate the bottom card glow) ─────────────────────────── */

        /* ── Animations ──────────────────────────────────────────────── */
        @keyframes srSlideDown { from { opacity:0; transform: translateX(-50%) translateY(-16px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
        @keyframes srSlideUp   { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        @keyframes srPulse     { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes srShimmer   { 0%{left:-100%} 60%,100%{left:140%} }
        @keyframes srFadeIn    { from{opacity:0} to{opacity:1} }

        @media (max-width: 480px) {
          .sr-search { top: 12px; padding: 14px 16px 16px; }
          .sr-bottom-inner { padding: 16px; }
          .sr-route-name { font-size: 15px; }
        }
      `}</style>

      <div className="sr-root">
        {/* ── Map ───────────────────────────────────────────────────── */}
        <GoogleMap
          mapContainerStyle={{ width:'100%', height:'100%', position:'absolute', top:0, left:0 }}
          center={defaultCenter}
          zoom={13}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{ disableDefaultUI:true, zoomControl:false, styles: darkMapStyle }}
        >
          {routes.map((route, i) => {
            const isSel = i === selectedRouteIndex;
            const rc    = riskConfig[route.risk_level];
            return (
              <Polyline key={i} path={route.coordinates}
                options={{
                  strokeColor:   isSel ? rc.color : 'rgba(180,190,210,0.25)',
                  strokeWeight:  isSel ? 7 : 4,
                  strokeOpacity: isSel ? 1 : 0.6,
                  zIndex:        isSel ? 10 : 1,
                  clickable:     true,
                }}
                onClick={() => { setSelectedRouteIndex(i); focusOnRoute(route.coordinates); }}
              />
            );
          })}

          {selected && (
            <>
              <Marker position={selected.coordinates[0]} title="Start"
                icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 9, fillColor: risk!.color, fillOpacity: 1, strokeWeight: 3, strokeColor: '#0f1523' }}
              />
              <Marker position={selected.coordinates[selected.coordinates.length - 1]} title="Destination"
                icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 9, fillColor: '#e11d48', fillOpacity: 1, strokeWeight: 3, strokeColor: '#0f1523' }}
              />
            </>
          )}
        </GoogleMap>

        {/* ── Search card ───────────────────────────────────────────── */}
        <div className="sr-search">
          <div className="sr-toprow">
            <button className="sr-back" onClick={() => navigate(-1)}>{IC.back}</button>
            <span className="sr-title">Safe Route</span>
            <div className="sr-badge">
              <div className="sr-badge-dot" />
              LIVE
            </div>
          </div>

          <div className="sr-inputs">
            {/* Origin row */}
            <div className="sr-input-row">
              <div className="sr-input-icon">
                <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#10b981"/></svg>
              </div>
              <input
                className="sr-input"
                placeholder="Your current location"
                value={origin}
                onChange={e => setOrigin(e.target.value)}
              />
              <button className="sr-gps" onClick={fetchCurrentLocation} disabled={addressLoading} title="Use my location">
                {addressLoading ? '⏳' : IC.pin}
              </button>
            </div>

            <div className="sr-input-sep" />

            {/* Destination row */}
            <div className="sr-input-row">
              <div className="sr-input-icon">
                <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#e11d48"/></svg>
              </div>
              <input
                className="sr-input"
                placeholder="Where do you want to go?"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchSafeRoutes()}
              />
            </div>
          </div>

          <button className="sr-go" onClick={fetchSafeRoutes} disabled={loading || !origin || !destination}>
            <div className="sr-go-shimmer" />
            {loading ? 'Calculating safe routes…' : 'Find Safe Routes'}
          </button>
        </div>

        {/* ── Bottom info card ──────────────────────────────────────── */}
        {selected && cardVisible && risk && (
          <div className="sr-bottom">
            <div className="sr-bottom-inner">

              {/* Route header */}
              <div className="sr-route-top">
                <div>
                  <div className="sr-route-count">Route {selectedRouteIndex + 1} of {routes.length}</div>
                  <div className="sr-route-name" title={selected.summary}>{selected.summary}</div>
                </div>
                <div className="sr-risk-pill" style={{ background: risk.bg, borderColor: risk.color + '55', color: risk.color }}>
                  <div className="sr-risk-dot" style={{ background: risk.color }} />
                  {risk.label}
                </div>
              </div>

              {/* Safety score bar */}
              <div className="sr-score-wrap">
                <div className="sr-score-row">
                  <div className="sr-score-label">Safety Score</div>
                  <div className="sr-score-pct" style={{ color: risk.color }}>{selected.safety_score}%</div>
                </div>
                <div className="sr-score-track">
                  <div
                    className="sr-score-fill"
                    style={{ width: `${selected.safety_score}%`, background: `linear-gradient(90deg, ${risk.color}99, ${risk.color})` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="sr-stats">
                <div className="sr-stat">
                  <div className="sr-stat-icon-row">{IC.clock}<span className="sr-stat-label">Time</span></div>
                  <div className="sr-stat-value">{selected.duration.text}</div>
                </div>
                <div className="sr-stat-sep" />
                <div className="sr-stat">
                  <div className="sr-stat-icon-row">{IC.road}<span className="sr-stat-label">Distance</span></div>
                  <div className="sr-stat-value">{selected.distance.text}</div>
                </div>
                <div className="sr-stat-sep" />
                <div className="sr-stat">
                  <div className="sr-stat-icon-row">{IC.shield}<span className="sr-stat-label">Risk</span></div>
                  <div className="sr-stat-value" style={{ color: risk.color }}>{selected.risk_level}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="sr-actions">
                {routes.length > 1 && (
                  <button className="sr-alt-btn" onClick={selectNextRoute}>
                    {IC.swap} Alt Route
                  </button>
                )}
                <button
                  className="sr-nav-btn"
                  style={{ background: `linear-gradient(135deg, ${risk.color}dd, ${risk.color})`, boxShadow: `0 4px 20px ${risk.glow}` }}
                  onClick={startNavigation}
                >
                  {IC.nav} Start Navigation
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SafeRouteScreen;