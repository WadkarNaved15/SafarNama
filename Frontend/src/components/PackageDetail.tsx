import React, { useState ,useEffect} from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, MapPin, Clock, Users, Shield, 
  ArrowLeft, Heart, Share2, ChevronDown, ChevronUp,
  CheckCircle, X,  Phone, Mail, Award
} from 'lucide-react';
import axios from 'axios';
import { Package, Agent } from '../types';
import BookingModal from './BookingModal';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PackageDetail: React.FC = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams<{ id: string }>();
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [packageData, setPackageData] = useState<Package | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)

  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookingForm, setBookingForm] = useState({
  travelerName: user?.name || "",
  travelerEmail: user?.email || "",
  travelerPhone: "",
  specialRequests: "",
});
const [bookingLoading, setBookingLoading] = useState(false);
const [bookingError, setBookingError] = useState<string | null>(null);
const [bookingSuccess, setBookingSuccess] = useState(false);



const handleBookingChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  setBookingForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleConfirmBooking = async () => {
  try {
    setBookingError(null);
    setBookingSuccess(false);

    if (!isAuthenticated || !token) {
      navigate("/login");
      return;
    }

    if (!selectedDate) {
      setBookingError("Please select a travel date");
      return;
    }

    if (!bookingForm.travelerName ||
        !bookingForm.travelerEmail ||
        !bookingForm.travelerPhone) {
      setBookingError("Please fill all required fields");
      return;
    }

    setBookingLoading(true);

    const payload = {
      packageId: packageData?._id,
      numberOfGuests: guests,
      travelDate: selectedDate,
      travelerName: bookingForm.travelerName,
      travelerEmail: bookingForm.travelerEmail,
      travelerPhone: bookingForm.travelerPhone,
      specialRequests: bookingForm.specialRequests,
      paymentMethod: "card",
    };


    const res = await axios.post(
      `${BACKEND_URL}/api/v1/bookings`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
      }
      }
    );

    if (res.data.success) {
      setBookingSuccess(true);

      setTimeout(() => {
        setShowBookingModal(false);
        navigate("/my-bookings"); // optional redirect
      }, 1500);
    }

  } catch (err: any) {
    console.error("Booking error:", err);
    setBookingError(
      err.response?.data?.error || "Booking failed. Please try again."
    );
  } finally {
    setBookingLoading(false);
  }
};
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Fetch package
        const res = await axios.get(`${BACKEND_URL}/api/v1/packages/${id}`);
        setPackageData(res.data);

        // ✅ Fetch linked agent
        if (res.data.agentId) {
          const agentRes = await axios.get(
            `${BACKEND_URL}/api/v1/agents/${res.data.agentId}`
          );
          setAgent(agentRes.data);
        }
      } catch (err) {
        console.error("Error fetching package:", err);
        setError("Package not found");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPackage();
  }, [id]);

  useEffect(() => {
  if (user) {
    setBookingForm((prev) => ({
      ...prev,
      travelerName: user.name,
      travelerEmail: user.email,
    }));
  }
}, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading package details...</p>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Package not found"}
          </h2>
          <Link to="/home" className="text-blue-600 hover:text-blue-700">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Calculate totals
  const totalPrice = packageData.price * guests;
  const savings = packageData.originalPrice
    ? (packageData.originalPrice - packageData.price) * guests
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/home"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to packages
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite 
                    ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-80 lg:h-96 overflow-hidden">
        <img
          src={packageData.image}
          alt={packageData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <div className="inline-flex items-center px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full mb-3">
                  {packageData.category}
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {packageData.title}
                </h1>
                <div className="flex items-center text-white text-lg mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  {packageData.destination}
                </div>
                <div className="flex items-center gap-4 text-white">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{packageData.rating}</span>
                    <span className="ml-1 opacity-80">({packageData.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-1" />
                    {packageData.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-1" />
                    {packageData.groupSize}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white mb-1">
                  ${packageData.price}
                  {packageData.originalPrice && (
                    <span className="text-xl text-gray-300 line-through ml-2">
                      ${packageData.originalPrice}
                    </span>
                  )}
                </div>
                <div className="text-white opacity-80">per person</div>
                {savings > 0 && (
                  <div className="text-green-400 text-sm font-medium">
                    Save ${packageData.originalPrice! - packageData.price}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'itinerary', label: 'Itinerary' },
                    { id: 'inclusions', label: 'Inclusions' },
                    { id: 'gallery', label: 'Gallery' },
                    { id: 'agent', label: 'Travel Agent' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-green-500 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'itinerary' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Day-by-Day Itinerary
                    </h3>
                    {packageData.itinerary.map((day) => (
                      <div key={day.day} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Day {day.day}: {day.title}
                            </h4>

                            {/* ✅ render description only if available */}
                            {day.description && (
                              <p className="text-gray-600 text-sm mt-1">{day.description}</p>
                            )}
                          </div>

                          {expandedDay === day.day ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </button>

                        {expandedDay === day.day && (
                          <div className="px-4 pb-4 border-t border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              
                              {/* ✅ Activities (always required) */}
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Activities</h5>
                                <ul className="space-y-1">
                                  {day.activities.map((activity, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center text-sm text-gray-600"
                                    >
                                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                      {activity}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                {/* ✅ render meals only if available */}
                                {day.meals && day.meals.length > 0 && (
                                  <>
                                    <h5 className="font-medium text-gray-900 mb-2">Meals Included</h5>
                                    <ul className="space-y-1">
                                      {day.meals.map((meal, index) => (
                                        <li
                                          key={index}
                                          className="flex items-center text-sm text-gray-600"
                                        >
                                          <CheckCircle className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                                          {meal}
                                        </li>
                                      ))}
                                    </ul>
                                  </>
                                )}

                                {/* ✅ render accommodation only if available */}
                                {day.accommodation && (
                                  <div className="mt-3">
                                    <h5 className="font-medium text-gray-900 mb-1">Accommodation</h5>
                                    <p className="text-sm text-gray-600">{day.accommodation}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                  </div>
                )}

                {activeTab === 'inclusions' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-green-600">
                        ✓ What's Included
                      </h3>
                      <ul className="space-y-2">
                        {packageData.inclusions.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-red-600">
                        ✗ What's Not Included
                      </h3>
                      <ul className="space-y-2">
                        {packageData.exclusions.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <X className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo Gallery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {packageData.gallery.map((image, index) => (
                        <div key={index} className="aspect-w-16 aspect-h-12 rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'agent' && agent && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Travel Agent</h3>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <img
                          src={agent.avatar}
                          alt={agent.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">{agent.name}</h4>
                            {agent.verified && (
                              <Award className="w-5 h-5 text-blue-500" />
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{agent.company}</p>
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-sm font-medium">{agent.rating}</span>
                              <span className="text-xs text-gray-500 ml-1">({agent.reviews} reviews)</span>
                            </div>
                            <span className="text-sm text-gray-600">{agent.experience} years experience</span>
                          </div>
                          
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-900 mb-2">Specialties</h5>
                            <div className="flex flex-wrap gap-2">
                              {agent.specialties.map((specialty, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {agent.phone}
                            </div>
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {agent.email}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-green-600">
                    ${packageData.price}
                  </span>
                  {packageData.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      ${packageData.originalPrice}
                    </span>
                  )}
                </div>
                <p className="text-gray-600">per person</p>
                {savings > 0 && (
                  <p className="text-green-600 text-sm font-medium">
                    Save ${packageData.originalPrice! - packageData.price} per person
                  </p>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Choose a date</option>
                    {packageData.availability.map((slot) => (
                      <option 
                        key={slot.date} 
                        value={slot.date}
                        disabled={!slot.available}
                      >
                        {new Date(slot.date).toLocaleDateString()} - ${slot.price}
                        {!slot.available && ' (Sold Out)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Total ({guests} guests)</span>
                  <span className="font-medium">${totalPrice.toLocaleString()}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>You Save</span>
                    <span>-${savings.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/login");
                    return;
                  }
                  setShowBookingModal(true);
                }}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors mb-3"
              >
                Book Now - ${totalPrice.toLocaleString()}
              </button>

              <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Contact Agent
              </button>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Booking Protection</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• {packageData.cancellation}</li>
                  <li>• 24/7 customer support</li>
                  <li>• Secure payment processing</li>
                  <li>• Travel insurance available</li>
                </ul>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Quick Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span>{packageData.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Group Size</span>
                    <span>{packageData.groupSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty</span>
                    <span>{packageData.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Languages</span>
                    <span>{packageData.languages.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBookingModal && (
  <BookingModal
    selectedDate={selectedDate}
    setSelectedDate={setSelectedDate}
    guests={guests}
    setGuests={setGuests}
    bookingForm={bookingForm}
    handleBookingChange={handleBookingChange}
    handleConfirmBooking={handleConfirmBooking}
    bookingLoading={bookingLoading}
    totalPrice={totalPrice}
    savings={savings}
    packageData={packageData}
    bookingError={bookingError}
    bookingSuccess={bookingSuccess}
    setShowBookingModal={setShowBookingModal}
  />
)}
    </div>
  );
};

export default PackageDetail;