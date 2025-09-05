import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star, MapPin, Calendar, Clock, Thermometer, Shield,
  ArrowLeft, Heart, Share2, Camera, ChevronLeft, ChevronRight,
  CheckCircle, AlertTriangle, Info, Globe
} from "lucide-react";
import { Package ,Destination} from "../types";

const DestinationDetail: React.FC = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [relatedPackages, setRelatedPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch destination + related packages from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch destination detail
        const res = await fetch(`${BACKEND_URL}/api/v1/destinations/${id}`);
        const data = await res.json();
        console.log("Fetched destination:", data);
        setDestination(data.destination);
        setRelatedPackages(data.packages || []);

      } catch (err) {
        console.error("Error fetching destination details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, BACKEND_URL]);

  // Helpers
  const nextImage = () => {
    if (!destination?.gallery) return;
    setCurrentImageIndex((prev) =>
      prev === destination.gallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!destination?.gallery) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? destination.gallery.length - 1 : prev - 1
    );
  };

  const getSafetyColor = (level: string) => {
    switch (level) {
      case "safe": return "text-green-600 bg-green-50";
      case "moderate": return "text-yellow-600 bg-yellow-50";
      case "caution": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getSafetyIcon = (level: string) => {
    switch (level) {
      case "safe": return CheckCircle;
      case "moderate": return Info;
      case "caution": return AlertTriangle;
      default: return Shield;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-medium text-gray-600">Loading destination...</div>
      </div>
    );
  }

  // Not found
  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Destination not found</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to destinations
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite
                    ? "text-red-500 bg-red-50 hover:bg-red-100"
                    : "text-gray-400 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
              </button>
              <button className="p-2 rounded-full text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 lg:h-[500px] overflow-hidden">
        <img
          src={destination.gallery?.[currentImageIndex]}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />

        {/* Image Navigation */}
        {destination.gallery && destination.gallery.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-white hover:bg-opacity-30 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-white hover:bg-opacity-30 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {destination.gallery && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {destination.gallery.map((_: string, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? "bg-white" : "bg-white bg-opacity-50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {destination.name}
                </h1>
                <div className="flex items-center text-white text-lg mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  {destination.country}, {destination.region}
                </div>
                <div className="flex items-center gap-4 text-white">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{destination.rating}</span>
                    <span className="ml-1 opacity-80">({destination.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-1" />
                    {destination.duration}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg text-white opacity-90">Explore</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tabs + Details */}
          <div className="lg:w-2/3">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "activities", label: "Activities" },
                    { id: "tips", label: "Local Tips" },
                    { id: "safety", label: "Safety Info" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        About {destination.name}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {destination.description}
                      </p>
                    </div>

                    {destination.highlights?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Highlights
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {destination.highlights.map((highlight: string, index: number) => (
                            <div key={index} className="flex items-center">
                              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                              <span className="text-gray-700">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="font-medium text-blue-900">Best Time</span>
                        </div>
                        <p className="text-blue-700">{destination.bestTime}</p>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Thermometer className="w-5 h-5 text-green-600 mr-2" />
                          <span className="font-medium text-green-900">Weather</span>
                        </div>
                        <p className="text-green-700">{destination.weather?.temperature}</p>
                        <p className="text-green-600 text-sm">{destination.weather?.condition}</p>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Globe className="w-5 h-5 text-purple-600 mr-2" />
                          <span className="font-medium text-purple-900">Theme</span>
                        </div>
                        <p className="text-purple-700">{destination.theme}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "activities" && destination.activities?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Activities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {destination.activities.map((activity: string, index: number) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Camera className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "tips" && destination.localTips?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Local Tips</h3>
                    <div className="space-y-3">
                      {destination.localTips.map((tip: string, index: number) => (
                        <div key={index} className="flex items-start p-3 bg-yellow-50 rounded-lg">
                          <Info className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "safety" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Information</h3>
                    <div className="space-y-4">
                      <div
                        className={`flex items-center p-4 rounded-lg ${getSafetyColor(
                          destination.safety?.level || ""
                        )}`}
                      >
                        {React.createElement(getSafetyIcon(destination.safety?.level || ""), {
                          className: "w-6 h-6 mr-3 flex-shrink-0",
                        })}
                        <div>
                          <div className="font-medium capitalize">{destination.safety?.level} Level</div>
                          <div className="text-sm opacity-80">Current safety assessment</div>
                        </div>
                      </div>

                      {destination.safety?.alerts?.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Current Alerts</h4>
                          <div className="space-y-2">
                            {destination.safety.alerts.map((alert: string, index: number) => (
                              <div
                                key={index}
                                className="flex items-start p-3 bg-orange-50 rounded-lg"
                              >
                                <AlertTriangle className="w-5 h-5 text-orange-600 mr-3 flex-shrink-0 mt-0.5" />
                                <span className="text-orange-800">{alert}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Packages */}
            {relatedPackages.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Travel Packages for {destination.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPackages.map((pkg) => (
                    <div
                      key={pkg._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{pkg.title}</h4>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            {pkg.duration}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">${pkg.price}</div>
                          <div className="flex items-center text-sm">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            {pkg.rating}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {pkg.highlights?.slice(0, 2).map((highlight: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>

                      <Link
                        to={`/package/${pkg._id}`}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors w-full justify-center"
                      >
                        View Package Details
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Region</span>
                  <span className="font-medium">{destination.region}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Theme</span>
                  <span className="font-medium">{destination.theme}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Best Season</span>
                  <span className="font-medium">{destination.season}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{destination.duration}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Need Help?</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <div>📞 24/7 Support: +1 (555) 123-4567</div>
                  <div>✉️ Email: support@wanderlust.com</div>
                  <div>💬 Live Chat Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
