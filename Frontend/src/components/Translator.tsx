import React, { useState } from "react";
import axios from "axios";
import { ChevronDown, Mic, Square,ArrowLeftRight } from "lucide-react";

export default function AITranslationInterface() {
    const [currentState, setCurrentState] = useState<
    "idle" | "listening" | "translating" | "completed"
  >("idle");
  const [fromLanguage, setFromLanguage] = useState("en");
  const [toLanguage, setToLanguage] = useState("hi");
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [result, setResult] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ;

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'as', name: 'Assamese', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' }, 
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'ne', name: 'Nepali', flag: '🇳🇵' },  
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'sd', name: 'Sindhi', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' }
];


  const getLanguageName = (code: string) =>
    languages.find((lang) => lang.code === code)?.name || "Unknown";
  const getLanguageFlag = (code:string) =>
    languages.find((lang) => lang.code === code)?.flag || "🌐";

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);

      recorder.onstop = async () => {
        setCurrentState("translating"); // 🔄 Step 2: Uploading + Translating
        const blob = new Blob(chunks , { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob, "input.webm");
        formData.append("from", fromLanguage);
        formData.append("to", toLanguage);

        try {
          const res = await axios.post(
            `${BACKEND_URL}/api/v1/translation`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          const data = res.data;

            if (data.error) {
            // 🚨 Backend rejected due to wrong/detected language mismatch
            setResult(null);
            alert(data.error + (data.detectedLang ? ` (Detected: ${data.detectedLang})` : ""));
            setCurrentState("idle");
            return;
          }
          setResult(data);
          setCurrentState("completed"); // ✅ Step 3: Done

          if (data.translatedAudio) {
            playBase64Audio(data.translatedAudio);
          }
        }  catch (err: any) {
  console.error("❌ Translation API error:", err.response?.data || err);

  if (err.response?.data?.error) {
    // 🚨 Backend custom error
    alert(
      err.response.data.error +
        (err.response.data.detectedLang
          ? ` (Detected: ${err.response.data.detectedLang})`
          : "")
    );
  } else {
    // ⚠️ Generic error
    alert("Something went wrong while translating. Please try again.");
  }

  setResult(null);
  setCurrentState("idle");
}
      };

      recorder.start();
      setMediaRecorder(recorder);
      setCurrentState("listening"); // 🎤 Step 1: Recording
    } catch (err) {
      console.error("❌ Mic access denied:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setCurrentState("translating"); // just in case
    }
  };

  const playBase64Audio = (base64Data: string) => {
    const audio = new Audio("data:audio/mp3;base64," + base64Data);
    audio.play();
  };

  const getStatusText = () => {
    switch (currentState) {
      case "listening":
        return "LISTENING...";
      case "translating":
        return "TRANSLATING...";
      case "completed":
        return "TRANSLATION COMPLETE";
      default:
        return "AI TRANSLATION READY";
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
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-900 to-blue-900 flex flex-col items-center p-6">

      {/* Language Selection */}
      <div className="absolute top-20 flex items-center gap-4 mb-8">
        {/* From */}
        <div className="relative">
          <button
            onClick={() => setIsFromOpen(!isFromOpen)}
            className="flex align-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/15 transition-all duration-300"
          >
            <span className="text-xl">{getLanguageFlag(fromLanguage)}</span>
            <span className="text-sm font-medium">
              {getLanguageName(fromLanguage)}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isFromOpen ? "rotate-180" : ""
              }`}
            />
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

        <div className="text-white/60 text-xl">
          <ArrowLeftRight className="w-5 h-5" />
        </div>

        {/* To */}
        <div className="relative">
          <button
            onClick={() => setIsToOpen(!isToOpen)}
            className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/15 transition-all duration-300"
          >
            <span className="text-xl">{getLanguageFlag(toLanguage)}</span>
            <span className="text-sm font-medium">
              {getLanguageName(toLanguage)}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isToOpen ? "rotate-180" : ""
              }`}
            />
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

      {/* Status */}
      {/* Status as Button */}
<div className="mb-12">
  <button
    disabled
    className={`px-6 py-2 rounded-full text-sm font-semibold tracking-wider shadow-md cursor-default transition-all
      ${
        currentState === "listening"
          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400"
          : currentState === "translating"
          ? "bg-orange-500/20 text-orange-300 border border-orange-400"
          : currentState === "completed"
          ? "bg-green-500/20 text-green-300 border border-green-400"
          : "bg-cyan-500/20 text-cyan-300 border border-cyan-400"
      }`}
  >
    {getStatusText()}
  </button>
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
  <div className="mt-12 flex flex-col items-center">
  <button
    onClick={() =>
      currentState === "listening" ? stopRecording() : startRecording()
    }
    className={`relative flex items-center justify-center w-16 h-16 rounded-xl transition-all duration-300 ${
      currentState === "listening"
        ? "bg-red-500/20 border-2 border-red-400 shadow-lg shadow-red-500/30 hover:bg-red-500/30"
        : "bg-white/10 border-2 border-white/20 backdrop-blur-md hover:bg-white/15 shadow-lg shadow-cyan-500/20"
    }`}
  >
    {currentState === "listening" ? (
      <Square className="w-6 h-6 text-red-400" />
    ) : (
      <Mic className="w-6 h-6 text-cyan-400" />
    )}
  </button>

  {/* Styled Text Below Button */}
  <p
    className={`mt-3 text-sm font-semibold tracking-wide ${
      currentState === "listening"
        ? "text-red-400 drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]"
        : "text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]"
    }`}
  >
    {currentState === "listening" ? "Listening..." : "Press to Start"}
  </p>
</div>


      {/* Transcription Results */}
      {result && (
        <div className="mt-8 text-center text-white space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-cyan-300">Original</h2>
            <p className="text-white/80">{result.transcription}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-green-300">Translated</h2>
            <p className="text-white/90">{result.translatedText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
