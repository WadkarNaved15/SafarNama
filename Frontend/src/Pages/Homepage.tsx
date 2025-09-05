import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import HeroSection from '../components/Home/Hero';
import DestinationsSection from '../components/Home/Destinations';
import TravelPackages from '../components/Home/TravelPackages';
import SafetySection from '../components/Home/SafetySection';
import TestimonialsSection from '../components/Home/Testimonials';
import About from '../components/Home/About';
import Footer from '../components/Home/Footer';
import { Package,Testimonial } from '../types';


const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // 🔹 State for data
  const [travelPackages, setTravelPackages] = useState<Package[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // 🔹 State for filters
  const [searchQuery, setSearchQuery] = useState("");


  // ✅ Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packRes, testRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/v1/packages`),
          axios.get(`${BACKEND_URL}/api/v1/testimonials`),
        ]);

        setTravelPackages(packRes.data);
        setTestimonials(testRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ Search & filters
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };



  const handleBookPackage = (packageId: string) => {
    navigate(`/package/${packageId}`);
  };



  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      {/* Destinations Section */}
      <DestinationsSection      />

      {/* Travel Packages Section */}
      <TravelPackages
        travelPackages={travelPackages}
        handleBookPackage={handleBookPackage}
      />

      {/* Safety Section */}
      <SafetySection />

      {/* Testimonials Section */}
      <TestimonialsSection testimonials={testimonials} />

      {/* About Section */}
      <About />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;