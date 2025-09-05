import { Shield, Phone, Mail, Globe, Info, AlertTriangle } from "lucide-react";

const SafetySection = () => {
  return (
    <section id="safety" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your <span className="text-sky-600">Safety</span> is Our Priority
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive safety information and real-time alerts to
            ensure your travels are secure and worry-free. Our 24/7 support team
            is always ready to assist you.
          </p>
        </div>

        {/* Safety Features + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Safety Features */}
          <div className="space-y-8">
            {/* Emergency Support */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-xl mr-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    24/7 Emergency Support
                  </h3>
                  <p className="text-gray-600">
                    Round-the-clock assistance wherever you are
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-semibold text-gray-800">
                    Emergency Hotline: +1-800-TRAVEL-911
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-semibold text-gray-800">
                    emergency@safarnama.com
                  </span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-semibold text-gray-800">
                    Available in 15+ languages
                  </span>
                </div>
              </div>
            </div>

            {/* Real-Time Alerts */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-xl mr-4">
                  <Info className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Real-Time Travel Alerts
                  </h3>
                  <p className="text-gray-600">Stay informed about your destination</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-green-800 font-medium">Greece - Santorini</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                    SAFE
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-yellow-800 font-medium">Peru - Machu Picchu</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                    MODERATE
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-800 font-medium">Japan - Tokyo</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                    VERY SAFE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Map */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Global Safety Map
            </h3>
            <div className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center">
                <Globe className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Interactive Safety Map</p>
                <p className="text-sm text-gray-500 mt-2">
                  Real-time safety indicators for all destinations
                </p>
              </div>

              {/* Example indicators */}
              <div className="absolute top-4 left-4 bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
              <div className="absolute top-8 right-8 bg-yellow-500 w-3 h-3 rounded-full animate-pulse"></div>
              <div className="absolute bottom-12 left-12 bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
              <div className="absolute bottom-8 right-16 bg-blue-500 w-3 h-3 rounded-full animate-pulse"></div>
            </div>

            {/* Legend */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Safe</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Moderate</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Caution</span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Essential Travel Safety Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-xl mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Travel Insurance</h4>
              <p className="text-sm text-gray-600">
                Always purchase comprehensive travel insurance before departure
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-xl mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Emergency Contacts</h4>
              <p className="text-sm text-gray-600">
                Keep local emergency numbers and embassy contacts handy
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 p-4 rounded-xl mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Stay Alert</h4>
              <p className="text-sm text-gray-600">
                Be aware of your surroundings and trust your instincts
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-xl mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Local Laws</h4>
              <p className="text-sm text-gray-600">
                Research and respect local customs and regulations
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafetySection;
