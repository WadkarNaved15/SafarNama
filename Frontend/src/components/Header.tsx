import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Plane, LogIn, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";


const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

export default function Header() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  
  // 🔹 Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Hamburger Menu Button (mobile only) */}
          <button
            className="md:hidden hover:border-sky-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-2 rounded-xl">
              <Plane className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                SafarNama
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-500 -mt-1">Premium Travel Experiences</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#destinations" className="text-gray-700 hover:text-sky-600 font-medium transition-colors">Destinations</a>
            <a href="#packages" className="text-gray-700 hover:text-sky-600 font-medium transition-colors">Packages</a>
            <a href="#safety" className="text-gray-700 hover:text-sky-600 font-medium transition-colors">Safety</a>
            <button onClick={() => navigate("/agent")} className="text-gray-700 hover:text-sky-600 font-medium transition-colors">For Agents</button>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* AI Translator Button (Icon only on small mobile) */}
            <button
              onClick={() => navigate("/translate")}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm rounded-md bg-sky-50 text-sky-600 font-medium border border-sky-200 hover:bg-sky-100 transition-all hidden sm:flex"
            >
              <span>Translator</span>
            </button>

            {/* 🔹 Auth Button (Login/Logout) */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-all border border-red-100"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}

            {/* Language Selector (desktop only) */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-sky-300 transition-colors"
              >
                <span className="text-lg">{languages.find((l) => l.code === selectedLanguage)?.flag}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {showLanguageDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setSelectedLanguage(lang.code); setShowLanguageDropdown(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-sky-50 flex items-center space-x-3 transition-colors"
                    >
                      <span>{lang.flag}</span>
                      <span className="text-sm font-medium text-gray-700">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4">
          <a href="#destinations" className="block text-gray-700 font-medium">Destinations</a>
          <a href="#packages" className="block text-gray-700 font-medium">Packages</a>
          <button onClick={() => navigate("/login")} className="block w-full text-left text-blue-600 font-bold">
            {isLoggedIn ? 'Dashboard' : 'Sign In'}
          </button>
        </div>
      )}
    </header>
  );
}