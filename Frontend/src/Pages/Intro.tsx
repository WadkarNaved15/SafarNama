import React, { useState, useEffect } from "react";
import { Globe, Mic, Shield, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Intro() {
  const [showTitle, setShowTitle] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Animation ends after 4s → Show title
    const animationTimer = setTimeout(() => {
      setShowAnimation(false);
      setShowTitle(true);
    }, 4000);

    // Features appear after 5s
    const featuresTimer = setTimeout(() => {
      setShowFeatures(true);
    }, 5000);

 
    const navigateTimer = setTimeout(() => {
      navigate("/home");
    }, 7500);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(featuresTimer);
      clearTimeout(navigateTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-sky-900 to-blue-900">
      {/* Gradient Overlay */}
       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-0"></div>

      {/* SVG Flight Path, Dots, and Plane */}
      {showAnimation && (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1400 900"
          className="absolute inset-0 pointer-events-none z-0"
        >
          <defs>
            <linearGradient
              id="trailGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
              <stop offset="30%" stopColor="rgba(125, 211, 252, 0.3)" /> {/* sky-300 */}
              <stop offset="70%" stopColor="rgba(56, 189, 248, 0.8)" /> {/* cyan-400 */}
              <stop offset="100%" stopColor="rgba(34, 211, 238, 1)" /> 
            </linearGradient>
          </defs>

          {/* Path */}
          <path
            id="flightPath"
            d="M -400 300 Q 0 200 400 300 Q 800 400 1100 300 Q 1400 200 1800 300"
            fill="none"
            stroke="none"
          />

          {/* Trail Dots */}
          {[...Array(12)].map((_, i) => (
            <circle key={i} r="2" fill="url(#trailGradient)">
              <animateMotion
                dur="4s"
                repeatCount="indefinite"
                begin={`${i * 0.15}s`}
                rotate="auto"
              >
                <mpath href="#flightPath" />
              </animateMotion>
            </circle>
          ))}

          {/* Plane */}
          <image
            href="/plane.svg"
            width="240"
            height="240"
            transform="translate(-120, -120)"
          >
            <animateMotion dur="4s" repeatCount="indefinite" rotate="auto">
              <mpath href="#flightPath" />
            </animateMotion>
          </image>
        </svg>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div
          className={`text-center mb-8 transition-all duration-1000 ease-out ${
            showTitle
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-75 translate-y-8"
          }`}
        >
          <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-serif italic font-bold text-cyan-400 mb-6 drop-shadow-[0_0_25px_rgba(34,211,238,0.6)] tracking-wide">
            SafarNama
          </h1>
          <p className="text-2xl sm:text-3xl text-blue-300 font-light tracking-wide drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]">
            Your Journey, Our Passion
          </p>
        </div>

        {/* Feature Tags */}
        <div
          className={`transition-all duration-1000 ease-out delay-1000 ${
            showFeatures ? "opacity-80 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-wrap justify-center gap-4 max-w-2xl">
            <div className="flex items-center gap-2 bg-cyan-500/10 backdrop-blur-sm rounded-full px-4 py-2 text-cyan-300 text-sm border border-cyan-500/30">
              <Globe className="w-4 h-4" />
              <span>Smart Booking</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-500/10 backdrop-blur-sm rounded-full px-4 py-2 text-blue-300 text-sm border border-blue-500/30">
              <Mic className="w-4 h-4" />
              <span>Translation</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 backdrop-blur-sm rounded-full px-4 py-2 text-emerald-300 text-sm border border-emerald-500/30">
              <Shield className="w-4 h-4" />
              <span>Safe Routes</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-500/10 backdrop-blur-sm rounded-full px-4 py-2 text-purple-300 text-sm border border-purple-500/30">
              <Target className="w-4 h-4" />
              <span>Trip Planning</span>
            </div>
          </div>
        </div>

        {/* Floating Glow Bubbles */}
        {[
          { top: "top-16", left: "left-8", w: "w-6", h: "h-6", color: "bg-cyan-400/30" },
          { top: "top-32", right: "right-16", w: "w-4", h: "h-4", color: "bg-blue-400/30" },
          { bottom: "bottom-24", left: "left-16", w: "w-8", h: "h-8", color: "bg-purple-400/30" },
          { bottom: "bottom-16", right: "right-8", w: "w-3", h: "h-3", color: "bg-emerald-400/30" },
          { top: "top-1/2", left: "left-4", w: "w-5", h: "h-5", color: "bg-sky-400/30" },
          { top: "top-1/3", right: "right-4", w: "w-7", h: "h-7", color: "bg-pink-400/30" },
        ].map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.top || ""} ${item.bottom || ""} ${
              item.left || ""
            } ${item.right || ""} ${item.w} ${item.h} ${item.color} rounded-full animate-bounce`}
            style={{
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${4 + index}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Intro;
