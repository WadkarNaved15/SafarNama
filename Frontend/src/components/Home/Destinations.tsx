import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Filter, Star, MapPin } from "lucide-react";
import { Destination } from "../../types";

export default function DestinationsSection() {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // ✅ Fetch destinations on mount
useEffect(() => {
  const fetchDestinations = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/destinations`, {
        params: {
          q: searchQuery || undefined,
          region: selectedRegion !== "all" ? selectedRegion : undefined,
          theme: selectedTheme !== "all" ? selectedTheme : undefined,
          season: selectedSeason !== "all" ? selectedSeason : undefined,
        },
      });
      console.log("API response:", res.data);
      setDestinations(res.data);
    } catch (err) {
      console.error("Error fetching destinations:", err);
    }
  };
  fetchDestinations();
}, [searchQuery, selectedRegion, selectedTheme, selectedSeason]);


  // // ✅ Apply filters locally
  // const filteredDestinations = destinations.filter((dest) => {
  //   const matchesSearch =
  //     dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     dest.country.toLowerCase().includes(searchQuery.toLowerCase());
  //   const matchesRegion = selectedRegion === "all" || dest.region === selectedRegion;
  //   const matchesTheme = selectedTheme === "all" || dest.theme === selectedTheme;
  //   const matchesSeason = selectedSeason === "all" || dest.season === selectedSeason;
  //   return matchesSearch && matchesRegion && matchesTheme && matchesSeason;
  // });

  const handleExploreDestination = (destinationId: string) => {
    navigate(`/destination/${destinationId}`);
  };

  return (
    <section id="destinations" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Explore Amazing <span className="text-sky-600">Destinations</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover handpicked destinations that offer unique experiences, rich culture,
            and unforgettable memories.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">Filter Destinations</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center space-x-2 px-4 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          <div className={`${showFilters ? "block" : "hidden"} md:block`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Region Filter */}
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl bg-white"
              >
                <option value="all">All Regions</option>
                <option value="europe">Europe</option>
                <option value="asia">Asia</option>
                <option value="north-america">North America</option>
                <option value="south-america">South America</option>
                <option value="middle-east">Middle East</option>
              </select>

              {/* Theme Filter */}
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl bg-white"
              >
                <option value="all">All Themes</option>
                <option value="adventure">Adventure</option>
                <option value="culture">Culture</option>
                <option value="nature">Nature</option>
                <option value="relaxation">Relaxation</option>
              </select>

              {/* Season Filter */}
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl bg-white"
              >
                <option value="all">All Seasons</option>
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="winter">Winter</option>
                <option value="year-round">Year Round</option>
              </select>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedRegion("all");
                  setSelectedTheme("all");
                  setSelectedSeason("all");
                  setSearchQuery("");
                }}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <div key={destination.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              {/* Image */}
              <div className="relative">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      destination.safety.level === "safe"
                        ? "bg-green-100 text-green-800"
                        : destination.safety.level === "moderate"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {destination.safety.level === "safe"
                      ? "🛡️ Very Safe"
                      : destination.safety.level === "moderate"
                      ? "⚠️ Moderate"
                      : "🚨 Caution"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">{destination.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-semibold">{destination.rating}</span>
                    <span className="text-sm text-gray-500">
                      ({destination.reviews})
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{destination.country}</span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {destination.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {destination.highlights.slice(0, 3).map((highlight, i) => (
                    <span key={i} className="px-2 py-1 bg-sky-50 text-sky-700 text-xs rounded-full">
                      {highlight}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {destination.theme} • {destination.season}
                  </div>
                  <button
                    onClick={() => handleExploreDestination(destination._id)}
                    className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-sky-600 hover:to-blue-700"
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
