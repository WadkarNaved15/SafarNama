import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Users, CreditCard, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Home/Footer';

interface Booking {
  _id: string;
  bookingId: string;
  packageTitle: string;
  destination: string;
  packageImage: string;
  travelDate: string;
  numberOfGuests: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentStatus: string;
  daysUntilTravel: number;
}

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'past'>('all');

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(response.data.data);
      } catch (err) {
        console.error("Error fetching bookings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-500 mt-1">Manage your trips and travel history</p>
            </div>
            
            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
              {['all', 'confirmed', 'past'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                    filter === f ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No bookings found</h3>
              <p className="text-gray-500 mt-2 mb-8">You haven't planned any trips yet. Start exploring now!</p>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                Explore Packages
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="md:w-64 h-48 md:h-auto relative">
                      <img 
                        src={booking.packageImage} 
                        alt={booking.packageTitle}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(booking.status)} shadow-sm backdrop-blur-md`}>
                        {booking.status.toUpperCase()}
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex-grow p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">ID: {booking.bookingId}</p>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{booking.packageTitle}</h3>
                          <div className="flex items-center text-gray-500 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{booking.destination}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Total Paid</p>
                          <p className="text-xl font-bold text-gray-900">₹{booking.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-gray-50">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-[10px] uppercase text-gray-400 font-bold">Travel Date</p>
                            <p className="text-sm font-semibold text-gray-700">
                              {new Date(booking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-[10px] uppercase text-gray-400 font-bold">Guests</p>
                            <p className="text-sm font-semibold text-gray-700">{booking.numberOfGuests} Persons</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-[10px] uppercase text-gray-400 font-bold">Payment</p>
                            <p className={`text-sm font-semibold ${booking.paymentStatus === 'completed' ? 'text-green-600' : 'text-orange-600'}`}>
                              {booking.paymentStatus}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-[10px] uppercase text-gray-400 font-bold">Countdown</p>
                            <p className="text-sm font-semibold text-blue-600">
                              {booking.daysUntilTravel > 0 ? `${booking.daysUntilTravel} Days Left` : 'Completed'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button className="flex-grow md:flex-grow-0 px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition shadow-lg shadow-gray-200">
                          View Details
                        </button>
                        {booking.status === 'confirmed' && booking.daysUntilTravel > 2 && (
                          <button className="flex-grow md:flex-grow-0 px-6 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition">
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingsPage;