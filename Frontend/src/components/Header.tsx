import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Plane } from "lucide-react";

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

  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Hamburger Menu Button (mobile only) */}
          <button
            className="md:hidden hover:border-sky-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-2 rounded-xl">
              <Plane className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                SafarNama
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-500 -mt-1">
                Premium Travel Experiences
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#destinations"
              className="text-gray-700 hover:text-sky-600 font-medium transition-colors"
            >
              Destinations
            </a>
            <a
              href="#packages"
              className="text-gray-700 hover:text-sky-600 font-medium transition-colors"
            >
              Packages
            </a>
            <a
              href="#safety"
              className="text-gray-700 hover:text-sky-600 font-medium transition-colors"
            >
              Safety
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-sky-600 font-medium transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-sky-600 font-medium transition-colors"
            >
              Contact
            </a>
            <button
              onClick={() => navigate("/agent")}
              className="text-gray-700 hover:text-sky-600 font-medium transition-colors"
            >
              For Agents
            </button>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* AI Translator Button */}
            <button
              onClick={() => navigate("/translate")}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm rounded-md 
                         bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium 
                         shadow-md hover:shadow-lg hover:from-sky-600 hover:to-blue-700 
                         transition-all sm:px-4 sm:py-2 sm:text-base sm:rounded-lg"
            >
              <span>Translator</span>
            </button>

            {/* Language Selector (desktop only) */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-sky-300 transition-colors"
              >
                <span className="text-lg">
                  {languages.find((lang) => lang.code === selectedLanguage)?.flag}
                </span>
                <span className="hidden sm:block text-sm font-medium">
                  {languages.find((lang) => lang.code === selectedLanguage)?.name}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showLanguageDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.code);
                        setShowLanguageDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-3"
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            <a href="#destinations" className="block py-2 text-gray-700 hover:text-sky-600">
              Destinations
            </a>
            <a href="#packages" className="block py-2 text-gray-700 hover:text-sky-600">
              Packages
            </a>
            <a href="#safety" className="block py-2 text-gray-700 hover:text-sky-600">
              Safety
            </a>
            <a href="#about" className="block py-2 text-gray-700 hover:text-sky-600">
              About
            </a>
            <a href="#contact" className="block py-2 text-gray-700 hover:text-sky-600">
              Contact
            </a>
            <button
              onClick={() => navigate("/agent")}
              className="block w-full text-left py-2 text-gray-700 hover:text-sky-600"
            >
              For Agents
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
