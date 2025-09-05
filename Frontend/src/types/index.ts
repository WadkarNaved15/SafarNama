export interface Destination {
  _id: string;
  id: string;  // all IDs as string
  name: string;
  country: string;
  region: string;
  theme: string;
  season: string;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  highlights: string[];
  bestTime: string;
  duration: string;
  price: number;  // numeric, keep values same by stripping "$"
  gallery: string[];
  activities: string[];
  localTips: string[];
  weather: {
    temperature: string;
    condition: string;
  };
  safety: {
    level: 'safe' | 'moderate' | 'caution';
    alerts: string[];
  };
}

export interface Package {
  _id: string;
  id: string; // always string for consistency
  title: string;
  destination: string;
  duration: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: {
    day: number;
    title: string;
    description?: string;   // optional, since TravelPackage didn’t always have it
    activities: string[];
    meals?: string[];       // optional for flexibility
    accommodation?: string;
  }[];
  gallery: string[];
  category: string;
  difficulty: string;
  groupSize: string;
  languages: string[];
  cancellation: string;
  agentId: string;
  agentName: string;
  agentRating: number;
  availability: {
    date: string;
    available: boolean;
    price: number;
  }[];
}

export interface Agent {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  rating: number;
  reviews: number;
  verified: boolean;
  specialties: string[];
  languages: string[];
  experience: number;
  avatar: string;
  packages: Package[];
}

export interface SearchFilters {
  query: string;
  region: string;
  theme: string;
  season: string;
  priceRange: [number, number];
  rating: number;
  duration: string;
  category: string;
}

export interface Testimonial {
  _id: string;
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  text: string;
  trip: string;
}