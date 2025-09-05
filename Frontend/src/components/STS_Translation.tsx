import React, { useState, useEffect } from 'react';
import { ChevronDown, Mic, Square } from 'lucide-react';

const AITranslationInterface = () => {
  const [currentState, setCurrentState] = useState('idle');
  const [fromLanguage, setFromLanguage] = useState('en');
  const [toLanguage, setToLanguage] = useState('es');
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);

  const languages = [
    { code: 'eng', name: 'English', flag: '🇺🇸' },
    // { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    // { code: 'fr', name: 'French', flag: '🇫🇷' },
    // { code: 'de', name: 'German', flag: '🇩🇪' },
    // { code: 'it', name: 'Italian', flag: '🇮🇹' },
    // { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'jpn', name: 'Japanese', flag: '🇯🇵' },
    // { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    // { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    // { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
    // { code: 'ru', name: 'Russian', flag: '🇷🇺' }
  ];

  const getLanguageName = (code) => {
    return languages.find(lang => lang.code === code)?.name || 'Unknown';
  };

  const getLanguageFlag = (code) => {
    return languages.find(lang => lang.code === code)?.flag || '🌐';
  };

  const handleStateChange = (newState) => {
    setCurrentState(newState);
    
    if (newState === 'listening') {
      setTimeout(() => setCurrentState('translating'), 3000);
    } else if (newState === 'translating') {
      setTimeout(() => setCurrentState('completed'), 4000);
    } else if (newState === 'completed') {
      setTimeout(() => setCurrentState('idle'), 2000);
    }
  };

  const getStatusText = () => {
    switch (currentState) {
      case 'listening': return 'LISTENING...';
      case 'translating': return 'TRANSLATING...';
      case 'completed': return 'TRANSLATION COMPLETE';
      default: return 'AI TRANSLATION READY';
    }
  };

  const getOrbClasses = () => {
    const baseClasses = "relative w-32 h-28 rounded-full transition-all duration-500 shadow-2xl";
    
    switch (currentState) {
      case 'listening':
        return `${baseClasses} bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 shadow-emerald-500/50 animate-pulse`;
      case 'translating':
        return `${baseClasses} bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 shadow-orange-500/50`;
      case 'completed':
        return `${baseClasses} bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500 shadow-green-500/60`;
      default:
        return `${baseClasses} bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-cyan-500/50`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-6">
      {/* Language Selection */}
      <div className="absolute top-8 flex items-center gap-4 mb-8">
        {/* From Language */}
        <div className="relative">
          <button
            onClick={() => setIsFromOpen(!isFromOpen)}
            className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/15 transition-all duration-300"
          >
            <span className="text-xl">{getLanguageFlag(fromLanguage)}</span>
            <span className="text-sm font-medium">{getLanguageName(fromLanguage)}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isFromOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isFromOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-md border border-white/20 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setFromLanguage(lang.code);
                    setIsFromOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors first:rounded-t-xl last:rounded-b-xl"
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm">{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Arrow */}
        <div className="text-white/60 text-xl">→</div>

        {/* To Language */}
        <div className="relative">
          <button
            onClick={() => setIsToOpen(!isToOpen)}
            className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/15 transition-all duration-300"
          >
            <span className="text-xl">{getLanguageFlag(toLanguage)}</span>
            <span className="text-sm font-medium">{getLanguageName(toLanguage)}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isToOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isToOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-md border border-white/20 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setToLanguage(lang.code);
                    setIsToOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors first:rounded-t-xl last:rounded-b-xl"
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm">{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Text */}
      <div className="text-cyan-300 text-lg font-light tracking-widest mb-12">
        {getStatusText()}
      </div>

      {/* Main Animation Container */}
      <div className="relative w-96 h-96 flex items-center justify-center">
        {/* Outer Ring */}
        <div className={`absolute w-80 h-72 rounded-full border border-white/20 ${
          currentState === 'listening' ? 'animate-spin' : ''
        }`} style={{
          animation: currentState === 'translating' ? 'spin 8s linear infinite' : 
                    currentState === 'listening' ? 'spin 15s linear infinite' : 'none'
        }}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></div>
        </div>

        {/* Middle Ring */}
        <div className={`absolute w-64 h-56 rounded-full border border-white/15`} style={{
          animation: currentState === 'translating' ? 'spin 12s linear infinite reverse' : 
                    currentState === 'listening' ? 'spin 20s linear infinite reverse' : 'none'
        }}>
          <div className="absolute top-1/4 right-0 transform translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
          <div className="absolute bottom-1/4 left-0 transform -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-violet-400 rounded-full shadow-lg shadow-violet-400/50"></div>
        </div>

        {/* Inner Ring */}
        <div className={`absolute w-48 h-40 rounded-full border border-white/10`} style={{
          animation: currentState === 'translating' ? 'spin 6s linear infinite' : 
                    currentState === 'listening' ? 'spin 10s linear infinite' : 'none'
        }}>
          <div className="absolute top-0 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-cyan-300 rounded-full shadow-lg shadow-cyan-300/50"></div>
          <div className="absolute bottom-0 left-1/4 transform -translate-x-1/2 translate-y-1/2 w-1 h-1 bg-pink-300 rounded-full shadow-lg shadow-pink-300/50"></div>
        </div>

        {/* Main Central Orb (Elliptical) */}
        <div className={getOrbClasses()}>
          {/* Inner Glow */}
          <div className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm"></div>
          
          {/* Core */}
          <div className="absolute inset-4 rounded-full bg-white/30 backdrop-blur-md"></div>

          {/* Pulse Waves for Listening */}
          {currentState === 'listening' && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400/60 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400/40 animate-ping" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400/20 animate-ping" style={{animationDelay: '1s'}}></div>
            </>
          )}

          {/* Rotating Gradient Border */}
          <div className={`absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-transparent to-purple-400 ${
            currentState === 'translating' ? 'animate-spin' : ''
          }`} style={{
            animation: currentState === 'translating' ? 'spin 3s linear infinite' : 'none'
          }}></div>
        </div>

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 ${
              currentState === 'listening' ? 'animate-bounce' : ''
            }`}
            style={{
              top: `${30 + Math.sin(i * 60 * Math.PI / 180) * 25}%`,
              left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 35}%`,
              animationDelay: `${i * 0.2}s`,
              animation: currentState === 'translating' ? `orbit${i} ${4 + i}s linear infinite` : 
                        currentState === 'listening' ? `bounce 1s infinite ${i * 0.1}s` : 'none'
            }}
          ></div>
        ))}
      </div>

      {/* Control Button */}
      <div className="mt-12">
        <button
          onClick={() => handleStateChange(currentState === 'listening' ? 'idle' : 'listening')}
          className={`relative flex items-center justify-center w-16 h-16 rounded-xl transition-all duration-300 ${
            currentState === 'listening' 
              ? 'bg-red-500/20 border-2 border-red-400 shadow-lg shadow-red-500/30 hover:bg-red-500/30' 
              : 'bg-white/10 border-2 border-white/20 backdrop-blur-md hover:bg-white/15 shadow-lg shadow-cyan-500/20'
          }`}
        >
          {currentState === 'listening' ? (
            <Square className="w-6 h-6 text-red-400" />
          ) : (
            <Mic className="w-6 h-6 text-cyan-400" />
          )}
        </button>
      </div>

      {/* Demo Controls */}
      <div className="absolute bottom-8 flex gap-3">
        {['idle', 'listening', 'translating', 'completed'].map((state) => (
          <button
            key={state}
            onClick={() => setCurrentState(state)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
              currentState === state
                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50'
                : 'bg-white/10 text-white/60 border border-white/20 hover:bg-white/15'
            }`}
          >
            {state.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Dynamic Keyframes */}
      <style jsx>{`
        @keyframes orbit0 {
          0% { transform: rotate(0deg) translateX(140px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(140px) rotate(-360deg); }
        }
        @keyframes orbit1 {
          0% { transform: rotate(60deg) translateX(120px) rotate(-60deg); }
          100% { transform: rotate(420deg) translateX(120px) rotate(-420deg); }
        }
        @keyframes orbit2 {
          0% { transform: rotate(120deg) translateX(160px) rotate(-120deg); }
          100% { transform: rotate(480deg) translateX(160px) rotate(-480deg); }
        }
        @keyframes orbit3 {
          0% { transform: rotate(180deg) translateX(100px) rotate(-180deg); }
          100% { transform: rotate(540deg) translateX(100px) rotate(-540deg); }
        }
        @keyframes orbit4 {
          0% { transform: rotate(240deg) translateX(130px) rotate(-240deg); }
          100% { transform: rotate(600deg) translateX(130px) rotate(-600deg); }
        }
        @keyframes orbit5 {
          0% { transform: rotate(300deg) translateX(110px) rotate(-300deg); }
          100% { transform: rotate(660deg) translateX(110px) rotate(-660deg); }
        }
      `}</style>
    </div>
  );
};

export default AITranslationInterface;