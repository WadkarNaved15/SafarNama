// src/components/TravelPackages.jsx
import { Heart, Share2, Star, MapPin, Clock, CheckCircle, Users, Award } from "lucide-react";
import { Package } from "../../types";

export default function TravelPackages({ travelPackages, handleBookPackage }: { travelPackages: Package[]; handleBookPackage: (id: string) => void }) {
  return (
    <section id="packages" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Curated <span className="text-sky-600">Travel Packages</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expertly designed travel packages that combine the best destinations, accommodations, and experiences. 
            Each package is crafted to provide exceptional value and unforgettable memories.
          </p>
        </div>

        {/* Grid of Packages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {travelPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {pkg.originalPrice && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Save ${pkg.originalPrice - pkg.price}
                  </div>
                )}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                    <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                  </button>
                  <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                {/* Title + Rating */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{pkg.title}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-700">{pkg.rating}</span>
                    <span className="text-sm text-gray-500">({pkg.reviews})</span>
                  </div>
                </div>
                
                {/* Location + Duration */}
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm mr-4">{pkg.destination}</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{pkg.duration}</span>
                </div>
                
                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-sky-600">${pkg.price}</span>
                    {pkg.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">${pkg.originalPrice}</span>
                    )}
                    <span className="text-sm text-gray-500">per person</span>
                  </div>
                </div>
                
                {/* Highlights */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Package Highlights:</h4>
                  <div className="flex flex-wrap gap-2">
                    {pkg.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                      >
                        ✓ {highlight}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Inclusions */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Includes:</h4>
                  <div className="grid grid-cols-2 gap-1 text-sm text-gray-600">
                    {pkg.inclusions.slice(0, 4).map((inclusion, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        <span>{inclusion}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Group Size + Difficulty */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{pkg.groupSize}</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    <span>{pkg.difficulty}</span>
                  </div>
                </div>
                
                {/* Book Button */}
                <button
                  onClick={() => handleBookPackage(pkg._id)}
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Book Now - ${pkg.price}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
