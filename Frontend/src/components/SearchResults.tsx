// import React, { useState, useEffect } from "react";
// import { useSearchParams, Link } from "react-router-dom";
// import axios from "axios";
// import {
//   Search,
//   Filter,
//   Star,
//   MapPin,
//   Calendar,
//   ArrowRight,
//   Grid,
//   List,
// } from "lucide-react";
// import { SearchFilters, Destination, Package } from "../types";
// import { Loader2 } from "lucide-react"; 

// const SearchResults: React.FC = () => {
//   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
//   const [searchParams] = useSearchParams();
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

//   const [filters, setFilters] = useState<SearchFilters>({
//     query: searchParams.get("q") || "",
//     region: searchParams.get("region") || "",
//     theme: searchParams.get("theme") || "",
//     season: searchParams.get("season") || "",
//     priceRange: [0, 5000],
//     rating: 0,
//     duration: "",
//     category: "",
//   });

//   const [destinations, setDestinations] = useState<Destination[]>([]);
//   const [packages, setPackages] = useState<Package[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filteredResults, setFilteredResults] = useState<{
//     destinations: Destination[];
//     packages: Package[];
//   }>({ destinations: [], packages: [] });


// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       const queryObj: Record<string, string> = {};

//       if (filters.query) queryObj.q = filters.query;
//       if (filters.region) queryObj.region = filters.region;
//       if (filters.theme) queryObj.theme = filters.theme;
//       if (filters.season) queryObj.season = filters.season;
//       if (filters.duration) queryObj.duration = filters.duration;
//       if (filters.category) queryObj.category = filters.category;

//       // Only send price if it’s not default
//       if (filters.priceRange[0] > 0) {
//         queryObj.minPrice = filters.priceRange[0].toString();
//       }
//       if (filters.priceRange[1] < 5000) {
//         queryObj.maxPrice = filters.priceRange[1].toString();
//       }

//       // Only send rating if > 0
//       if (filters.rating > 0) {
//         queryObj.rating = filters.rating.toString();
//       }

//       const queryParams = new URLSearchParams(queryObj).toString();

//       const [destRes, pkgRes] = await Promise.all([
//         axios.get(`${BACKEND_URL}/api/v1/destinations?${queryParams}`),
//         axios.get(`${BACKEND_URL}/api/v1/packages?${queryParams}`),
//       ]);

//       setDestinations(destRes.data);
//       setPackages(pkgRes.data);
//       setFilteredResults({ destinations: destRes.data, packages: pkgRes.data });
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchData();
// }, [filters, BACKEND_URL]);


//   // total results directly from fetched (already filtered) data
//   const totalResults = destinations.length + packages.length;

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Search Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 Search Results
//                 {filters.query && (
//                   <span className="text-blue-600"> for "{filters.query}"</span>
//                 )}
//               </h1>
//               <p className="text-gray-600 mt-1">
//                 {totalResults} results found
//               </p>
//             </div>
            
//             <div className="flex items-center gap-4">
//               <div className="flex items-center bg-gray-100 rounded-lg p-1">
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`p-2 rounded-md transition-colors ${
//                     viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
//                   }`}
//                 >
//                   <Grid className="w-4 h-4" />
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`p-2 rounded-md transition-colors ${
//                     viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
//                   }`}
//                 >
//                   <List className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Filters Sidebar */}
//           <div className="lg:w-80 flex-shrink-0">
//             <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
//               <div className="flex items-center gap-2 mb-6">
//                 <Filter className="w-5 h-5 text-blue-600" />
//                 <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
//               </div>

//               <div className="space-y-6">
//                 {/* Search Input */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Search
//                   </label>
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                     <input
//                       type="text"
//                       value={filters.query}
//                       onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
//                       placeholder="Search destinations, packages..."
//                       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>

//                 {/* Region Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Region
//                   </label>
//                   <select
//                     value={filters.region}
//                     onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="">All Regions</option>
//                     <option value="Europe">Europe</option>
//                     <option value="Asia">Asia</option>
//                     <option value="South America">South America</option>
//                     <option value="North America">North America</option>
//                     <option value="Africa">Africa</option>
//                     <option value="Oceania">Oceania</option>
//                   </select>
//                 </div>

//                 {/* Theme Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Theme
//                   </label>
//                   <select
//                     value={filters.theme}
//                     onChange={(e) => setFilters(prev => ({ ...prev, theme: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="">All Themes</option>
//                     <option value="Adventure">Adventure</option>
//                     <option value="Culture">Culture</option>
//                     <option value="Nature">Nature</option>
//                     <option value="Relaxation">Relaxation</option>
//                   </select>
//                 </div>

//                 {/* Price Range */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
//                   </label>
//                   <input
//                     type="range"
//                     min="0"
//                     max="5000"
//                     step="100"
//                     value={filters.priceRange[1]}
//                     onChange={(e) => setFilters(prev => ({ 
//                       ...prev, 
//                       priceRange: [prev.priceRange[0], parseInt(e.target.value)] 
//                     }))}
//                     className="w-full"
//                   />
//                 </div>

//                 {/* Rating Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Minimum Rating
//                   </label>
//                   <div className="flex gap-1">
//                     {[1, 2, 3, 4, 5].map((rating) => (
//                       <button
//                         key={rating}
//                         onClick={() => setFilters(prev => ({ ...prev, rating }))}
//                         className={`p-1 ${
//                           filters.rating >= rating ? 'text-yellow-400' : 'text-gray-300'
//                         }`}
//                       >
//                         <Star className="w-5 h-5 fill-current" />
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Results */}
//           <div className="flex-1">
//             {/* Destinations Section */}
//             {filteredResults.destinations.length > 0 && (
//               <div className="mb-12">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-6">
//                   Destinations ({filteredResults.destinations.length})
//                 </h2>
//                 <div className={`grid gap-6 ${
//                   viewMode === 'grid' 
//                     ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
//                     : 'grid-cols-1'
//                 }`}>
//                   {filteredResults.destinations.map((destination) => (
//                     <div
//                       key={destination.id}
//                       className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden ${
//                         viewMode === 'list' ? 'flex' : ''
//                       }`}
//                     >
//                       <div className={`${viewMode === 'list' ? 'w-80 flex-shrink-0' : ''}`}>
//                         <img
//                           src={destination.image}
//                           alt={destination.name}
//                           className={`w-full object-cover ${
//                             viewMode === 'list' ? 'h-full' : 'h-48'
//                           }`}
//                         />
//                       </div>
//                       <div className="p-6 flex-1">
//                         <div className="flex items-start justify-between mb-3">
//                           <div>
//                             <h3 className="text-lg font-semibold text-gray-900">
//                               {destination.name}
//                             </h3>
//                             <div className="flex items-center text-gray-600 text-sm mt-1">
//                               <MapPin className="w-4 h-4 mr-1" />
//                               {destination.country}
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <div className="flex items-center">
//                               <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
//                               <span className="text-sm font-medium">{destination.rating}</span>
//                               <span className="text-xs text-gray-500 ml-1">
//                                 ({destination.reviews})
//                               </span>
//                             </div>
//                             <div className="text-lg font-bold text-blue-600 mt-1">
//                               ${destination.price}
//                             </div>
//                           </div>
//                         </div>
                        
//                         <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                           {destination.description}
//                         </p>
                        
//                         <div className="flex flex-wrap gap-2 mb-4">
//                           {destination.highlights.slice(0, 3).map((highlight, index) => (
//                             <span
//                               key={index}
//                               className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
//                             >
//                               {highlight}
//                             </span>
//                           ))}
//                         </div>
                        
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center text-sm text-gray-600">
//                             <Calendar className="w-4 h-4 mr-1" />
//                             {destination.duration}
//                           </div>
//                           <Link
//                             to={`/destination/${destination.id}`}
//                             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
//                           >
//                             Explore
//                             <ArrowRight className="w-4 h-4 ml-1" />
//                           </Link>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Packages Section */}
//             {filteredResults.packages.length > 0 && (
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900 mb-6">
//                   Travel Packages ({filteredResults.packages.length})
//                 </h2>
//                 <div className={`grid gap-6 ${
//                   viewMode === 'grid' 
//                     ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
//                     : 'grid-cols-1'
//                 }`}>
//                   {filteredResults.packages.map((pkg) => (
//                     <div
//                       key={pkg.id}
//                       className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden ${
//                         viewMode === 'list' ? 'flex' : ''
//                       }`}
//                     >
//                       <div className={`${viewMode === 'list' ? 'w-80 flex-shrink-0' : ''}`}>
//                         <img
//                           src={pkg.image}
//                           alt={pkg.title}
//                           className={`w-full object-cover ${
//                             viewMode === 'list' ? 'h-full' : 'h-48'
//                           }`}
//                         />
//                       </div>
//                       <div className="p-6 flex-1">
//                         <div className="flex items-start justify-between mb-3">
//                           <div>
//                             <h3 className="text-lg font-semibold text-gray-900">
//                               {pkg.title}
//                             </h3>
//                             <div className="flex items-center text-gray-600 text-sm mt-1">
//                               <MapPin className="w-4 h-4 mr-1" />
//                               {pkg.destination}
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <div className="flex items-center">
//                               <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
//                               <span className="text-sm font-medium">{pkg.rating}</span>
//                               <span className="text-xs text-gray-500 ml-1">
//                                 ({pkg.reviews})
//                               </span>
//                             </div>
//                             <div className="text-lg font-bold text-green-600 mt-1">
//                               ${pkg.price}
//                               {pkg.originalPrice && (
//                                 <span className="text-sm text-gray-500 line-through ml-2">
//                                   ${pkg.originalPrice}
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
                        
//                         <div className="flex flex-wrap gap-2 mb-4">
//                           {pkg.highlights.slice(0, 3).map((highlight, index) => (
//                             <span
//                               key={index}
//                               className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
//                             >
//                               {highlight}
//                             </span>
//                           ))}
//                         </div>
                        
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center text-sm text-gray-600">
//                             <Calendar className="w-4 h-4 mr-1" />
//                             {pkg.duration}
//                           </div>
//                           <Link
//                             to={`/package/${pkg.id}`}
//                             className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
//                           >
//                             Book Now
//                             <ArrowRight className="w-4 h-4 ml-1" />
//                           </Link>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* No Results */}
//             {totalResults === 0 && (
//               <div className="text-center py-12">
//                 <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                   <Search className="w-8 h-8 text-gray-400" />
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   No results found
//                 </h3>
//                 <p className="text-gray-600 mb-4">
//                   Try adjusting your search criteria or filters
//                 </p>
//                 <button
//                   onClick={() => setFilters({
//                     query: '',
//                     region: '',
//                     theme: '',
//                     season: '',
//                     priceRange: [0, 5000],
//                     rating: 0,
//                     duration: '',
//                     category: ''
//                   })}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Clear Filters
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchResults;



import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Calendar,
  ArrowRight,
  Grid,
  List,
} from "lucide-react";
import { SearchFilters, Destination, Package } from "../types";

const SearchResults: React.FC = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get("q") || "",
    region: searchParams.get("region") || "",
    theme: searchParams.get("theme") || "",
    season: searchParams.get("season") || "",
    priceRange: [0, 5000],
    rating: 0,
    duration: "",
    category: "",
  });

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [destRes, pkgRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/v1/destinations`),
          axios.get(`${BACKEND_URL}/api/v1/packages`),
        ]);
        setDestinations(destRes.data);
        setPackages(pkgRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [BACKEND_URL]);

  // Apply filters
  const filteredResults = useMemo(() => {
    const query = filters.query.toLowerCase();

    const filteredDestinations = destinations.filter((dest) => {
      const matchesQuery =
        !query ||
        dest.name.toLowerCase().includes(query) ||
        dest.country.toLowerCase().includes(query) ||
        dest.region.toLowerCase().includes(query) ||
        dest.theme.toLowerCase().includes(query) ||
        dest.description.toLowerCase().includes(query);

      const matchesRegion =
        !filters.region ||
        dest.region.toLowerCase() === filters.region.toLowerCase();
      const matchesTheme =
        !filters.theme ||
        dest.theme.toLowerCase() === filters.theme.toLowerCase();
      const matchesSeason =
        !filters.season ||
        dest.season.toLowerCase() === filters.season.toLowerCase();
      const matchesPrice =
        dest.price >= filters.priceRange[0] &&
        dest.price <= filters.priceRange[1];
      const matchesRating = dest.rating >= filters.rating;

      return (
        matchesQuery &&
        matchesRegion &&
        matchesTheme &&
        matchesSeason &&
        matchesPrice &&
        matchesRating
      );
    });

    const filteredPackages = packages.filter((pkg) => {
      const matchesQuery =
        !query ||
        pkg.title.toLowerCase().includes(query) ||
        pkg.destination.toLowerCase().includes(query) ||
        pkg.category.toLowerCase().includes(query);

      const matchesPrice =
        pkg.price >= filters.priceRange[0] &&
        pkg.price <= filters.priceRange[1];
      const matchesRating = pkg.rating >= filters.rating;
      const matchesCategory =
        !filters.category ||
        pkg.category.toLowerCase() === filters.category.toLowerCase();

      return matchesQuery && matchesPrice && matchesRating && matchesCategory;
    });

    return { destinations: filteredDestinations, packages: filteredPackages };
  }, [filters, destinations, packages]); // 👈 added deps

  const totalResults =
    filteredResults.destinations.length + filteredResults.packages.length;

    
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Search Results
                {filters.query && (
                  <span className="text-blue-600"> for "{filters.query}"</span>
                )}
              </h1>
              <p className="text-gray-600 mt-1">
                {totalResults} results found
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              </div>

              <div className="space-y-6">
                {/* Search Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={filters.query}
                      onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                      placeholder="Search destinations, packages..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Region Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region
                  </label>
                  <select
                    value={filters.region}
                    onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Regions</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                    <option value="South America">South America</option>
                    <option value="North America">North America</option>
                    <option value="Africa">Africa</option>
                    <option value="Oceania">Oceania</option>
                  </select>
                </div>

                {/* Theme Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={filters.theme}
                    onChange={(e) => setFilters(prev => ({ ...prev, theme: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Themes</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Culture">Culture</option>
                    <option value="Nature">Nature</option>
                    <option value="Relaxation">Relaxation</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      priceRange: [prev.priceRange[0], parseInt(e.target.value)] 
                    }))}
                    className="w-full"
                  />
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFilters(prev => ({ ...prev, rating }))}
                        className={`p-1 ${
                          filters.rating >= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Destinations Section */}
            {filteredResults.destinations.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Destinations ({filteredResults.destinations.length})
                </h2>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredResults.destinations.map((destination) => (
                    <div
                      key={destination.id}
                      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      <div className={`${viewMode === 'list' ? 'w-80 flex-shrink-0' : ''}`}>
                        <img
                          src={destination.image}
                          alt={destination.name}
                          className={`w-full object-cover ${
                            viewMode === 'list' ? 'h-full' : 'h-48'
                          }`}
                        />
                      </div>
                      <div className="p-6 flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {destination.name}
                            </h3>
                            <div className="flex items-center text-gray-600 text-sm mt-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              {destination.country}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-sm font-medium">{destination.rating}</span>
                              <span className="text-xs text-gray-500 ml-1">
                                ({destination.reviews})
                              </span>
                            </div>
                            <div className="text-lg font-bold text-blue-600 mt-1">
                              ${destination.price}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {destination.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {destination.highlights.slice(0, 3).map((highlight, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            {destination.duration}
                          </div>
                          <Link
                            to={`/destination/${destination.id}`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Explore
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Packages Section */}
            {filteredResults.packages.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Travel Packages ({filteredResults.packages.length})
                </h2>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredResults.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      <div className={`${viewMode === 'list' ? 'w-80 flex-shrink-0' : ''}`}>
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className={`w-full object-cover ${
                            viewMode === 'list' ? 'h-full' : 'h-48'
                          }`}
                        />
                      </div>
                      <div className="p-6 flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {pkg.title}
                            </h3>
                            <div className="flex items-center text-gray-600 text-sm mt-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              {pkg.destination}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-sm font-medium">{pkg.rating}</span>
                              <span className="text-xs text-gray-500 ml-1">
                                ({pkg.reviews})
                              </span>
                            </div>
                            <div className="text-lg font-bold text-green-600 mt-1">
                              ${pkg.price}
                              {pkg.originalPrice && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  ${pkg.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {pkg.highlights.slice(0, 3).map((highlight, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            {pkg.duration}
                          </div>
                          <Link
                            to={`/package/${pkg.id}`}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Book Now
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {totalResults === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={() => setFilters({
                    query: '',
                    region: '',
                    theme: '',
                    season: '',
                    priceRange: [0, 5000],
                    rating: 0,
                    duration: '',
                    category: ''
                  })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
