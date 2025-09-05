// src/components/Loader.tsx
import React from "react";
import { Loader2 } from "lucide-react";

const Loader: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-sky-900 to-blue-900">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinning Icon */}
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />

        {/* Brand Text */}
        <h1 className="text-2xl font-semibold text-white tracking-wide drop-shadow-md">
          Loading SafarNama...
        </h1>

        {/* Progress Bar */}
        <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-[progress_2s_linear_infinite]" />
        </div>
      </div>

      {/* Tailwind custom keyframes for progress */}
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
