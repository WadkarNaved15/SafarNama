import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Edit, Trash2, Eye, Star, MapPin, Calendar, 
  Users, DollarSign, TrendingUp, Package, Settings,
 Save, X, CheckCircle, AlertCircle
} from 'lucide-react';
import { Package as PackageType, Agent } from '../types';

const AgentDashboard: React.FC = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  console.log("Backend URL:", BACKEND_URL); 
  const [activeTab, setActiveTab] = useState('packages');
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [newPackage, setNewPackage] = useState<Partial<PackageType>>({ title: '', destination: '', duration: '', price: 0, category: 'Adventure', difficulty: 'Easy', groupSize: '2-8 people', highlights: [], inclusions: [], exclusions: [], languages: ['English'], cancellation: 'Free cancellation up to 48 hours' });
  const [agent, setAgent] = useState<Agent | null>(null);
  const stats = { totalPackages: packages.length, totalBookings: 47, totalRevenue: 89340, averageRating: 4.7 };


  const agentId = "68b5d30011c78580f94ff2fb";

    // 🔹 Fetch all packages for this agent
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/agents/${agentId}`);
        console.log("Fetched agent data:", res.data);
        setAgent(res.data);
        setPackages(res.data.packages || []);
      } catch (err) {
        console.error("Error fetching packages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, [agentId]);
  const handleAddPackage = () => {
    if (newPackage.title && newPackage.destination && newPackage.price) {
      const packageToAdd: PackageType = {
        id: `pkg-${Date.now()}`,
        title: newPackage.title!,
        destination: newPackage.destination!,
        duration: newPackage.duration || '5 Days, 4 Nights',
        price: newPackage.price!,
        rating: 0,
        reviews: 0,
        image: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800',
        highlights: newPackage.highlights || [],
        inclusions: newPackage.inclusions || [],
        exclusions: newPackage.exclusions || [],
        category: newPackage.category || 'Adventure',
        difficulty: newPackage.difficulty || 'Easy',
        groupSize: newPackage.groupSize || '2-8 people',
        languages: newPackage.languages || ['English'],
        cancellation: newPackage.cancellation || 'Free cancellation up to 48 hours',
        agentId: 'agent-current',
        agentName: 'Your Travel Agency',
        agentRating: 4.8,
        itinerary: [],
        gallery: [],
        availability: []
      };
      
      setPackages([...packages, packageToAdd]);
      setNewPackage({
        title: '',
        destination: '',
        duration: '',
        price: 0,
        category: 'Adventure',
        difficulty: 'Easy',
        groupSize: '2-8 people',
        highlights: [],
        inclusions: [],
        exclusions: [],
        languages: ['English'],
        cancellation: 'Free cancellation up to 48 hours'
      });
      setShowAddPackage(false);
    }
  };

  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
  };

  const AddPackageModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Add New Package</h3>
            <button
              onClick={() => setShowAddPackage(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Title *
              </label>
              <input
                type="text"
                value={newPackage.title || ''}
                onChange={(e) => setNewPackage(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Amazing Bali Adventure"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination *
              </label>
              <input
                type="text"
                value={newPackage.destination || ''}
                onChange={(e) => setNewPackage(prev => ({ ...prev, destination: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Bali, Indonesia"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <input
                type="text"
                value={newPackage.duration || ''}
                onChange={(e) => setNewPackage(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 5 Days, 4 Nights"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (USD) *
              </label>
              <input
                type="number"
                value={newPackage.price || ''}
                onChange={(e) => setNewPackage(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1299"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={newPackage.category || 'Adventure'}
                onChange={(e) => setNewPackage(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Adventure">Adventure</option>
                <option value="Romantic">Romantic</option>
                <option value="Family">Family</option>
                <option value="Cultural">Cultural</option>
                <option value="Luxury">Luxury</option>
                <option value="Budget">Budget</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={newPackage.difficulty || 'Easy'}
                onChange={(e) => setNewPackage(prev => ({ ...prev, difficulty: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Size
              </label>
              <input
                type="text"
                value={newPackage.groupSize || ''}
                onChange={(e) => setNewPackage(prev => ({ ...prev, groupSize: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2-8 people"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Policy
              </label>
              <select
                value={newPackage.cancellation || 'Free cancellation up to 48 hours'}
                onChange={(e) => setNewPackage(prev => ({ ...prev, cancellation: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Free cancellation up to 48 hours">Free cancellation up to 48 hours</option>
                <option value="Free cancellation up to 72 hours">Free cancellation up to 72 hours</option>
                <option value="Free cancellation up to 7 days">Free cancellation up to 7 days</option>
                <option value="Non-refundable">Non-refundable</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Package Highlights (comma-separated)
            </label>
            <textarea
              value={newPackage.highlights?.join(', ') || ''}
              onChange={(e) => setNewPackage(prev => ({ 
                ...prev, 
                highlights: e.target.value.split(',').map(h => h.trim()).filter(h => h) 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="e.g., Temple Tours, Rice Terrace Trek, Cooking Class"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inclusions (comma-separated)
            </label>
            <textarea
              value={newPackage.inclusions?.join(', ') || ''}
              onChange={(e) => setNewPackage(prev => ({ 
                ...prev, 
                inclusions: e.target.value.split(',').map(i => i.trim()).filter(i => i) 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="e.g., 3-star accommodation, Daily breakfast, All transfers"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exclusions (comma-separated)
            </label>
            <textarea
              value={newPackage.exclusions?.join(', ') || ''}
              onChange={(e) => setNewPackage(prev => ({ 
                ...prev, 
                exclusions: e.target.value.split(',').map(e => e.trim()).filter(e => e) 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="e.g., International flights, Lunch and dinner, Personal expenses"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowAddPackage(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddPackage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your travel packages and bookings</p>
            </div>
            
            <button
              onClick={() => setShowAddPackage(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Package
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Packages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPackages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'packages', label: 'My Packages', icon: Package },
                { id: 'bookings', label: 'Bookings', icon: Calendar },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'packages' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Your Packages</h3>
                  <div className="text-sm text-gray-600">
                    {packages.length} package{packages.length !== 1 ? 's' : ''} total
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 line-clamp-2">{pkg.title}</h4>
                          <div className="flex items-center gap-1">
                            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeletePackage(pkg.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          {pkg.destination}
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm">{pkg.rating}</span>
                            <span className="text-xs text-gray-500 ml-1">({pkg.reviews})</span>
                          </div>
                          <div className="text-lg font-bold text-green-600">${pkg.price}</div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{pkg.duration}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            pkg.category === 'Adventure' ? 'bg-orange-50 text-orange-700' :
                            pkg.category === 'Romantic' ? 'bg-pink-50 text-pink-700' :
                            pkg.category === 'Cultural' ? 'bg-purple-50 text-purple-700' :
                            'bg-blue-50 text-blue-700'
                          }`}>
                            {pkg.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {packages.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No packages yet</h3>
                    <p className="text-gray-600 mb-4">Create your first travel package to get started</p>
                    <button
                      onClick={() => setShowAddPackage(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Package
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Bookings</h3>
                <div className="space-y-4">
                  {[
                    { id: 1, customer: 'John Smith', package: 'Romantic Paris Getaway', date: '2024-03-15', status: 'Confirmed', amount: 1899 },
                    { id: 2, customer: 'Sarah Johnson', package: 'Romantic Paris Getaway', date: '2024-03-22', status: 'Pending', amount: 1899 },
                    { id: 3, customer: 'Mike Wilson', package: 'Romantic Paris Getaway', date: '2024-03-29', status: 'Confirmed', amount: 3798 }
                  ].map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{booking.customer}</h4>
                        <p className="text-sm text-gray-600">{booking.package}</p>
                        <p className="text-xs text-gray-500">Departure: {booking.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">${booking.amount}</div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'Confirmed' 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {booking.status === 'Confirmed' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <AlertCircle className="w-3 h-3 mr-1" />
                          )}
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Monthly Revenue</h4>
                    <div className="text-3xl font-bold text-green-600 mb-2">$24,580</div>
                    <div className="flex items-center text-sm text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +12% from last month
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Booking Rate</h4>
                    <div className="text-3xl font-bold text-blue-600 mb-2">68%</div>
                    <div className="flex items-center text-sm text-blue-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +5% from last month
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agency Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Your Travel Agency"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      defaultValue="agent@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddPackage && <AddPackageModal />}
    </div>
  );
};

export default AgentDashboard;