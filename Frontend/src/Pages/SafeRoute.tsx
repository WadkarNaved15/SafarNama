import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleMap, Polyline, Marker, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Environment variables in React Web (Vite uses import.meta.env, Create React App uses process.env)
const BACKEND_URI = import.meta.env.VITE_BACKEND_URL;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// --- TYPES ---
interface Coordinate {
  lat: number;
  lng: number;
}

interface RouteData {
  summary: string;
  risk_level: 'Safe' | 'Moderate' | 'High';
  safety_score: number;
  duration: { text: string };
  distance: { text: string };
  polyline: string;
  coordinates: Coordinate[];
}

// ==================================================
// 1. HELPER: DECODE POLYLINE (Adapted for web {lat, lng})
// ==================================================
const decodePolyline = (encoded: string): Coordinate[] => {
  if (!encoded) return [];
  const poly: Coordinate[] = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;
  while (index < len) {
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

// ==================================================
// 2. MAIN COMPONENT
// ==================================================
const SafeRouteScreen: React.FC = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const navigate = useNavigate();

  // Load Google Maps Script
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // --- STATE ---
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [addressLoading, setAddressLoading] = useState<boolean>(false);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);

  const defaultCenter = { lat: 19.0760, lng: 72.8777 }; // Mumbai

  // --- MAP INIT ---
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // --- REUSABLE FUNCTION: REVERSE GEOCODE ---
  const fillAddressFromCoordinates = async (lat: number, lng: number) => {
    if (!isLoaded) return;
    
    try {
      // 1. Zoom Map to location
      if (mapRef.current) {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(15);
      }

      // 2. Convert to Address Name using Web Geocoder
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
      
      if (response.results[0]) {
        setOrigin(response.results[0].formatted_address);
      } else {
        setOrigin(`${lat}, ${lng}`);
      }
    } catch (error) {
      console.warn("Geocoding Error:", error);
      setOrigin(`${lat}, ${lng}`);
    } finally {
      setAddressLoading(false);
    }
  };

  // --- FETCH DIRECT LOCATION VIA BROWSER API ---
  const fetchCurrentLocation = () => {
    setAddressLoading(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setAddressLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fillAddressFromCoordinates(latitude, longitude);
      },
      (error) => {
        console.warn("Geolocation Error:", error.message);
        alert("Could not fetch location. Please check your browser permissions.");
        setAddressLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // --- EFFECT: ON LOAD (Automatic) ---
  useEffect(() => {
    if (isLoaded) {
      fetchCurrentLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // --- BUTTON HANDLER: MANUAL CLICK ---
  const handleGetCurrentLocation = () => {
    fetchCurrentLocation();
  };

  // --- API CALL: FETCH ROUTES ---
  const fetchSafeRoutes = async () => {
    if (!origin || !destination) {
      alert("Please enter both Start and Destination.");
      return;
    }
    setLoading(true);
    setRoutes([]); 

    try {
      const API_URL = `${BACKEND_URI}/api/v1/safe-route/`; 
      const response = await axios.post(API_URL, { origin, destination });

      if (response.data.success && response.data.routes.length > 0) {
        const fetchedRoutes: RouteData[] = response.data.routes.map((route: any) => ({
            ...route,
            coordinates: decodePolyline(route.polyline) 
        }));
        
        setRoutes(fetchedRoutes);
        setSelectedRouteIndex(0);

        // Fit map to bounds of the first route
        if (fetchedRoutes[0].coordinates.length > 0 && mapRef.current) {
            const bounds = new window.google.maps.LatLngBounds();
            fetchedRoutes[0].coordinates.forEach(coord => bounds.extend(coord));
            mapRef.current.fitBounds(bounds);
        }
      } else {
        alert("Could not find any routes.");
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const selectNextRoute = () => {
    if (routes.length === 0) return;
    const nextIndex = (selectedRouteIndex + 1) % routes.length;
    setSelectedRouteIndex(nextIndex);
    const nextRoute = routes[nextIndex];
    
    if (mapRef.current && nextRoute) {
        const bounds = new window.google.maps.LatLngBounds();
        nextRoute.coordinates.forEach(coord => bounds.extend(coord));
        mapRef.current.fitBounds(bounds);
    }
  };

  const startNavigation = () => {
    const currentRoute = routes[selectedRouteIndex];
    if (!currentRoute) return;
    const coords = currentRoute.coordinates;
    const dest = coords[coords.length - 1];
    const mid = coords[Math.floor(coords.length / 2)];

    // Standard Google Maps Web URL
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${dest.lat},${dest.lng}&waypoints=${mid.lat},${mid.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const selectedRoute = routes[selectedRouteIndex];

  if (!isLoaded) return <div style={styles.loadingScreen}>Loading Map...</div>;

  return (
    <div style={styles.container}>
      
      {/* MAP */}
      <div style={styles.mapContainer}>
        <GoogleMap
          mapContainerStyle={styles.map}
          center={defaultCenter}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{ disableDefaultUI: true, zoomControl: true }}
        >
          {routes.map((route, index) => {
            const isSelected = index === selectedRouteIndex;
            let strokeColor = '#D1D5DB'; 
            if (isSelected) strokeColor = route.risk_level === 'Safe' ? '#10B981' : '#EF4444';
            
            return (
              <Polyline
                key={index}
                path={route.coordinates}
                options={{
                    strokeColor,
                    strokeWeight: isSelected ? 6 : 4,
                    zIndex: isSelected ? 10 : 1,
                    clickable: true,
                }}
                onClick={() => setSelectedRouteIndex(index)} 
              />
            );
          })}

          {selectedRoute && (
              <>
                  <Marker 
                    position={selectedRoute.coordinates[0]} 
                    title="Start"
                    icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: "#10B981",
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: "#ffffff",
                    }}
                  />
                  <Marker 
                    position={selectedRoute.coordinates[selectedRoute.coordinates.length - 1]} 
                    title="Destination" 
                  />
              </>
          )}
        </GoogleMap>
      </div>

      {/* SEARCH CARD - Overlaid on Top */}
      <div style={styles.searchCardWrapper}>
        <div style={styles.searchCard}>
            <div style={styles.headerRow}>
                <button onClick={() => navigate(-1)} style={styles.backButton}>
                <span style={styles.backArrow}>←</span>
                </button>
                <span style={styles.headerTitle}>HerShield Safe Route</span>
                <div style={{width: 40}} />
            </div>
            
            <div style={styles.inputGroup}>
                <div style={styles.timelineVisual}>
                    <div style={{...styles.dot, backgroundColor: '#10B981'}} />
                    <div style={styles.dashedLine} />
                    <div style={{...styles.dot, backgroundColor: '#EF4444'}} />
                </div>

                <div style={styles.inputsColumn}>
                    {/* GPS ROW */}
                    <div style={styles.inputWithIconRow}>
                        <input 
                            style={{...styles.input, flex: 1}} 
                            placeholder="Current Location" 
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                        />
                        <button 
                            style={styles.gpsButton} 
                            onClick={handleGetCurrentLocation} 
                            disabled={addressLoading}
                        >
                            {addressLoading ? '⏳' : '📍'}
                        </button>
                    </div>

                    <div style={styles.divider} />
                    
                    <input 
                        style={styles.input} 
                        placeholder="Destination" 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                </div>
            </div>

            <button style={styles.goButton} onClick={fetchSafeRoutes} disabled={loading}>
                {loading ? 'Loading...' : 'Find Safe Routes'}
            </button>
        </div>
      </div>

      {/* BOTTOM INFO CARD */}
      {selectedRoute && (
        <div style={styles.bottomCard}>
          <div style={styles.routeHeader}>
            <div>
              <div style={styles.routeLabel}>ROUTE {selectedRouteIndex + 1} OF {routes.length}</div>
              <div style={styles.routeSummary} title={selectedRoute.summary}>
                {selectedRoute.summary}
              </div>
            </div>
            <div style={{...styles.safetyBadge, backgroundColor: selectedRoute.risk_level === 'Safe' ? '#ECFDF5' : '#FEF2F2' }}>
                <span style={{...styles.safetyText, color: selectedRoute.risk_level === 'Safe' ? '#059669' : '#DC2626' }}>
                    {selectedRoute.safety_score}% Safe
                </span>
            </div>
          </div>

          <div style={styles.statsRow}>
            <div style={styles.statItem}>
                <div style={styles.statLabel}>TIME</div>
                <div style={styles.statValue}>{selectedRoute.duration.text}</div>
            </div>
            <div style={{...styles.statItem, ...styles.statBorder}}>
                <div style={styles.statLabel}>DISTANCE</div>
                <div style={styles.statValue}>{selectedRoute.distance.text}</div>
            </div>
            <div style={styles.statItem}>
                <div style={styles.statLabel}>RISK</div>
                <div style={{...styles.statValue, color: selectedRoute.risk_level === 'Safe' ? '#059669' : '#D97706' }}>
                    {selectedRoute.risk_level}
                </div>
            </div>
          </div>

          <div style={styles.actionButtonsRow}>
            {routes.length > 1 && (
                <button style={styles.altRouteButton} onClick={selectNextRoute}>
                    Alternative
                </button>
            )}
            <button 
                style={{
                    ...styles.startNavButton, 
                    ...(routes.length > 1 ? { flex: 1.5, marginLeft: '10px' } : { width: '100%' })
                }}
                onClick={startNavigation}
            >
                Start Navigation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================================================
// STYLES (Converted to Web CSS-in-JS)
// ==================================================
const styles: { [key: string]: React.CSSProperties } = {
  container: { position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#fff', fontFamily: 'system-ui, sans-serif' },
  loadingScreen: { width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  mapContainer: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 },
  map: { width: '100%', height: '100%' },
  
  searchCardWrapper: { position: 'absolute', top: '20px', width: '100%', display: 'flex', justifyContent: 'center', zIndex: 10, pointerEvents: 'none' },
  searchCard: { width: '90%', maxWidth: '400px', backgroundColor: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', pointerEvents: 'auto' },
  headerRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' },
  backButton: { background: 'none', border: 'none', cursor: 'pointer', width: '40px', height: '40px', display: 'flex', alignItems: 'center', padding: 0 },
  backArrow: { fontSize: '24px', fontWeight: '300', color: '#111827' },
  headerTitle: { fontSize: '16px', fontWeight: '700', color: '#374151', letterSpacing: '0.5px' },
  inputGroup: { display: 'flex', marginBottom: '16px' },
  timelineVisual: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '12px', paddingTop: '14px' },
  dot: { width: '10px', height: '10px', borderRadius: '50%' },
  dashedLine: { width: '2px', flex: 1, backgroundImage: 'linear-gradient(#E5E7EB 50%, transparent 50%)', backgroundSize: '2px 8px', margin: '6px 0' },
  inputsColumn: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px solid #F3F4F6', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  inputWithIconRow: { display: 'flex', alignItems: 'center', paddingRight: '10px' },
  gpsButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '10px' },
  input: { height: '48px', padding: '0 16px', fontSize: '15px', color: '#111827', backgroundColor: '#F9FAFB', border: 'none', outline: 'none', width: '100%', boxSizing: 'border-box' },
  divider: { height: '1px', backgroundColor: '#E5E7EB', margin: '0 16px' },
  goButton: { width: '100%', backgroundColor: '#111827', color: 'white', border: 'none', borderRadius: '14px', height: '52px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', boxShadow: '0 4px 8px rgba(17,24,39,0.2)' },
  
  bottomCard: { position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '400px', backgroundColor: 'white', borderRadius: '24px', padding: '20px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', zIndex: 10 },
  routeHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  routeLabel: { fontSize: '11px', fontWeight: '700', color: '#9CA3AF', marginBottom: '4px', letterSpacing: '0.5px' },
  routeSummary: { fontSize: '18px', fontWeight: '800', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' },
  safetyBadge: { padding: '6px 12px', borderRadius: '8px' },
  safetyText: { fontWeight: '700', fontSize: '14px' },
  statsRow: { display: 'flex', backgroundColor: '#F9FAFB', borderRadius: '16px', padding: '16px', marginBottom: '20px' },
  statItem: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statBorder: { borderLeft: '1px solid #E5E7EB', borderRight: '1px solid #E5E7EB' },
  statLabel: { fontSize: '11px', fontWeight: '600', color: '#9CA3AF', marginBottom: '4px' },
  statValue: { fontSize: '15px', fontWeight: '700', color: '#111827' },
  actionButtonsRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  altRouteButton: { flex: 1, backgroundColor: '#F3F4F6', border: 'none', borderRadius: '14px', height: '50px', cursor: 'pointer', color: '#374151', fontSize: '13px', fontWeight: '700' },
  startNavButton: { backgroundColor: '#10B981', border: 'none', borderRadius: '14px', height: '50px', cursor: 'pointer', color: 'white', fontSize: '15px', fontWeight: '700', boxShadow: '0 4px 8px rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};

export default SafeRouteScreen;