import { Crown, Sparkles, Search } from "lucide-react";


export default function HeroSection({ searchQuery, setSearchQuery, handleSearch }) {
  return (
    <section className="relative flex items-center justify-center overflow-hidden py-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-sky-900/90 to-blue-900/90 z-10"></div>

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1920)",
        }}
      ></div>

      {/* Content */}
      <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
        {/* Icons */}
        <div className="flex items-center justify-center mb-6">
          <Crown className="h-12 w-12 text-yellow-400 mr-4" />
          <Sparkles className="h-8 w-8 text-yellow-300" />
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Discover Your Next
          <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Dream Destination
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
          Experience the world's most breathtaking destinations with our expertly curated travel
          packages. From ancient wonders to modern marvels, your perfect adventure awaits.
        </p>

        {/* Search Bar */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto shadow-2xl">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 text-lg"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Search Adventures
            </button>
          </form>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-yellow-400">50K+</div>
            <div className="text-gray-300">Happy Travelers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400">98%</div>
            <div className="text-gray-300">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400">150+</div>
            <div className="text-gray-300">Destinations</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400">24/7</div>
            <div className="text-gray-300">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
