import {
  Plane,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Shield,
  Award,
  CheckCircle,
} from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-2 rounded-xl">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Safarnama</h3>
                <p className="text-sm text-gray-400">
                  Premium Travel Experiences
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Creating extraordinary travel experiences for over 15 years. Your
              journey to discover the world starts here.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#destinations"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Destinations
                </a>
              </li>
              <li>
                <a
                  href="#packages"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Travel Packages
                </a>
              </li>
              <li>
                <a
                  href="#safety"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Safety Information
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Travel Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Customer Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Customer Support</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Booking Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Travel Insurance
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Cancellation Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Information</h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-sky-400 mr-3" />
                <div>
                  <p className="text-white font-medium">24/7 Emergency</p>
                  <p className="text-gray-300 text-sm">+1-800-TRAVEL-911</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-sky-400 mr-3" />
                <div>
                  <p className="text-white font-medium">Email Support</p>
                  <p className="text-gray-300 text-sm">support@safarnama.com</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-sky-400 mr-3" />
                <div>
                  <p className="text-white font-medium">Headquarters</p>
                  <p className="text-gray-300 text-sm">Mumbai, MH 400010</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 SafarNama. All rights reserved. | Licensed Travel Agency
              #TA-2024-001
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center">
                <Shield className="h-4 w-4 mr-1 text-green-400" />
                SSL Secured
              </span>
              <span className="flex items-center">
                <Award className="h-4 w-4 mr-1 text-yellow-400" />
                IATA Certified
              </span>
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-blue-400" />
                Verified Agency
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
