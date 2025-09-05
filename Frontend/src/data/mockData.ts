import { Destination, Package, Agent } from '../types';

export const destinations: Destination[] = [
  {
    id: '1',
    name: 'Santorini',
    country: 'Greece',
    region: 'Europe',
    theme: 'Culture',
    season: 'Summer',
    image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    reviews: 2847,
    description: 'Experience the magic of Santorini with its iconic blue-domed churches, stunning sunsets, and crystal-clear waters. This volcanic island offers a perfect blend of romance, culture, and natural beauty.',
    highlights: ['Iconic Blue Domes', 'Spectacular Sunsets', 'Volcanic Beaches', 'Wine Tasting', 'Traditional Villages'],
    bestTime: 'April to October',
    duration: '4-7 days',
    price: 1200,
    gallery: [
      'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3264723/pexels-photo-3264723.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    activities: ['Sunset Watching', 'Wine Tours', 'Boat Trips', 'Photography', 'Beach Relaxation'],
    localTips: [
      'Book sunset dinner reservations in advance',
      'Wear comfortable shoes for cobblestone streets',
      'Try local Assyrtiko wine',
      'Visit Oia for the best sunset views'
    ],
    weather: {
      temperature: '25°C',
      condition: 'Sunny'
    },
    safety: {
      level: 'safe',
      alerts: []
    }
  },
  {
    id: '2',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    theme: 'Nature',
    season: 'Year-round',
    image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.7,
    reviews: 3521,
    description: 'Discover the enchanting island of Bali with its lush rice terraces, ancient temples, pristine beaches, and vibrant culture. Perfect for both adventure seekers and those looking for relaxation.',
    highlights: ['Rice Terraces', 'Ancient Temples', 'Beautiful Beaches', 'Yoga Retreats', 'Local Markets'],
    bestTime: 'April to October',
    duration: '5-10 days',
    price: 800,
    gallery: [
      'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    activities: ['Temple Visits', 'Surfing', 'Yoga Classes', 'Cooking Classes', 'Volcano Hiking'],
    localTips: [
      'Respect local customs at temples',
      'Bargain at traditional markets',
      'Try authentic Balinese cuisine',
      'Book volcano tours early morning'
    ],
    weather: {
      temperature: '28°C',
      condition: 'Tropical'
    },
    safety: {
      level: 'safe',
      alerts: ['Check volcano activity updates']
    }
  },
  {
    id: '3',
    name: 'Swiss Alps',
    country: 'Switzerland',
    region: 'Europe',
    theme: 'Adventure',
    season: 'Winter',
    image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    reviews: 1876,
    description: 'Experience the breathtaking beauty of the Swiss Alps with world-class skiing, stunning mountain views, charming villages, and pristine alpine lakes.',
    highlights: ['World-Class Skiing', 'Mountain Railways', 'Alpine Lakes', 'Charming Villages', 'Hiking Trails'],
    bestTime: 'December to March (Winter), June to September (Summer)',
    duration: '6-8 days',
    price: 2200,
    gallery: [
      'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1559821/pexels-photo-1559821.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    activities: ['Skiing', 'Snowboarding', 'Mountain Hiking', 'Cable Car Rides', 'Photography'],
    localTips: [
      'Book ski equipment in advance',
      'Try traditional Swiss fondue',
      'Purchase Swiss Travel Pass for trains',
      'Dress in layers for mountain weather'
    ],
    weather: {
      temperature: '-2°C',
      condition: 'Snowy'
    },
    safety: {
      level: 'safe',
      alerts: ['Check weather conditions before mountain activities']
    }
  },
  {
    id: '4',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    theme: 'Culture',
    season: 'Spring',
    image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.6,
    reviews: 4231,
    description: 'Immerse yourself in the vibrant culture of Tokyo, where ancient traditions meet cutting-edge technology. Experience cherry blossoms, incredible cuisine, and bustling city life.',
    highlights: ['Cherry Blossoms', 'Traditional Temples', 'Modern Architecture', 'Street Food', 'Pop Culture'],
    bestTime: 'March to May, September to November',
    duration: '5-7 days',
    price: 1500,
    gallery: [
      'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1822605/pexels-photo-1822605.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    activities: ['Temple Visits', 'Sushi Making', 'Shopping', 'Karaoke', 'Cherry Blossom Viewing'],
    localTips: [
      'Get a JR Pass for train travel',
      'Learn basic Japanese phrases',
      'Try authentic ramen and sushi',
      'Respect local customs and etiquette'
    ],
    weather: {
      temperature: '18°C',
      condition: 'Mild'
    },
    safety: {
      level: 'safe',
      alerts: []
    }
  },
  {
    id: '5',
    name: 'Machu Picchu',
    country: 'Peru',
    region: 'South America',
    theme: 'Adventure',
    season: 'Year-round',
    image: 'https://images.pexels.com/photos/259967/pexels-photo-259967.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    reviews: 2156,
    description: 'Discover the ancient Incan citadel of Machu Picchu, one of the New Seven Wonders of the World. Trek through stunning Andean landscapes and explore this archaeological marvel.',
    highlights: ['Ancient Incan Ruins', 'Inca Trail Trek', 'Andean Mountains', 'Sacred Valley', 'Llama Encounters'],
    bestTime: 'May to September',
    duration: '4-6 days',
    price: 1800,
    gallery: [
      'https://images.pexels.com/photos/259967/pexels-photo-259967.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2356037/pexels-photo-2356037.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    activities: ['Inca Trail Hiking', 'Archaeological Tours', 'Photography', 'Cultural Experiences', 'Train Rides'],
    localTips: [
      'Book Inca Trail permits well in advance',
      'Acclimatize to altitude in Cusco first',
      'Pack layers for varying temperatures',
      'Respect the archaeological site rules'
    ],
    weather: {
      temperature: '15°C',
      condition: 'Variable'
    },
    safety: {
      level: 'moderate',
      alerts: ['Altitude sickness precautions', 'Weather can change quickly']
    }
  },
  {
    id: '6',
    name: 'Maldives',
    country: 'Maldives',
    region: 'Asia',
    theme: 'Nature',
    season: 'Year-round',
    image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    reviews: 1654,
    description: 'Escape to paradise in the Maldives with crystal-clear turquoise waters, pristine white sand beaches, and luxurious overwater bungalows. Perfect for romance and relaxation.',
    highlights: ['Overwater Bungalows', 'Crystal Clear Waters', 'Coral Reefs', 'Luxury Resorts', 'Water Sports'],
    bestTime: 'November to April',
    duration: '5-8 days',
    price: 3500,
    gallery: [
      'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3250613/pexels-photo-3250613.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    activities: ['Snorkeling', 'Diving', 'Spa Treatments', 'Sunset Cruises', 'Water Sports'],
    localTips: [
      'Book seaplane transfers in advance',
      'Respect local Islamic customs',
      'Try fresh seafood and tropical fruits',
      'Bring reef-safe sunscreen'
    ],
    weather: {
      temperature: '30°C',
      condition: 'Tropical'
    },
    safety: {
      level: 'safe',
      alerts: []
    }
  }
];


export const packages: Package[] = [
  {
    id: 'pkg-1',
    title: 'Santorini Romantic Getaway',
    destination: 'Santorini',
    duration: '5 Days, 4 Nights',
    price: 2499,
    originalPrice: 2999,
    rating: 4.8,
    reviews: 342,
    image: 'https://images.pexels.com/photos/161815/santorini-travel-vacation-europe-161815.jpeg?auto=compress&cs=tinysrgb&w=800',
    highlights: ['Luxury Cave Hotel', 'Private Sunset Tour', 'Wine Tasting Experience', 'Couples Spa Treatment'],
    inclusions: ['4-star accommodation', 'Daily breakfast', 'Airport transfers', 'Guided tours', 'Wine tasting'],
    exclusions: ['International flights', 'Lunch and dinner', 'Personal expenses', 'Travel insurance'],
    category: 'Romantic',
    difficulty: 'Easy',
    groupSize: '2-8 people',
    languages: ['English', 'Greek'],
    cancellation: 'Free cancellation up to 48 hours',
    agentId: 'agent-1',
    agentName: 'Mediterranean Dreams Travel',
    agentRating: 4.9,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Santorini',
        description: 'Welcome to the magical island of Santorini! Upon arrival, you\'ll be transferred to your luxury cave hotel.',
        activities: ['Airport pickup', 'Hotel check-in', 'Welcome drink', 'Orientation tour'],
        meals: ['Welcome drink'],
        accommodation: 'Luxury Cave Hotel with Caldera View'
      },
      {
        day: 2,
        title: 'Oia Village & Sunset Tour',
        description: 'Explore the famous Oia village with its iconic blue domes and enjoy a spectacular sunset.',
        activities: ['Oia village tour', 'Photography session', 'Sunset viewing', 'Traditional dinner'],
        meals: ['Breakfast', 'Traditional dinner'],
      },
      {
        day: 3,
        title: 'Wine Tasting & Beach Day',
        description: 'Discover Santorini\'s unique volcanic wines and relax at the famous Red Beach.',
        activities: ['Winery visits', 'Wine tasting', 'Red Beach visit', 'Swimming'],
        meals: ['Breakfast', 'Wine tasting snacks'],
      },
      {
        day: 4,
        title: 'Couples Spa & Free Time',
        description: 'Indulge in a relaxing couples spa treatment and enjoy free time to explore.',
        activities: ['Couples massage', 'Spa treatments', 'Free time', 'Shopping'],
        meals: ['Breakfast'],
      },
      {
        day: 5,
        title: 'Departure',
        description: 'Check out and transfer to the airport for your departure.',
        activities: ['Hotel check-out', 'Last-minute shopping', 'Airport transfer'],
        meals: ['Breakfast'],
      }
    ],
    gallery: [
      'https://images.pexels.com/photos/161815/santorini-travel-vacation-europe-161815.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3264723/pexels-photo-3264723.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    availability: [
      { date: '2024-03-15', available: true, price: 2499 },
      { date: '2024-03-22', available: true, price: 2499 },
      { date: '2024-03-29', available: false, price: 2499 },
      { date: '2024-04-05', available: true, price: 2699 },
    ]
  },
  {
    id: 'pkg-2',
    title: 'Bali Adventure & Culture',
    destination: 'Bali',
    duration: '7 Days, 6 Nights',
    price: 1899,
    rating: 4.7,
    reviews: 567,
    image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800',
    highlights: ['Temple Tours', 'Rice Terrace Trek', 'Cooking Class', 'Volcano Sunrise Hike'],
    inclusions: ['3-star accommodation', 'Daily breakfast', 'All transfers', 'Guided tours', 'Cooking class'],
    exclusions: ['International flights', 'Lunch and dinner', 'Personal expenses', 'Travel insurance'],
    category: 'Adventure',
    difficulty: 'Moderate',
    groupSize: '4-12 people',
    languages: ['English', 'Indonesian'],
    cancellation: 'Free cancellation up to 72 hours',
    agentId: 'agent-2',
    agentName: 'Bali Explorer Tours',
    agentRating: 4.8,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Denpasar',
        description: 'Welcome to Bali! Transfer to your hotel in Ubud, the cultural heart of Bali.',
        activities: ['Airport pickup', 'Hotel check-in', 'Welcome briefing', 'Local market visit'],
        meals: ['Welcome drink'],
        accommodation: 'Traditional Balinese Hotel in Ubud'
      },
      {
        day: 2,
        title: 'Ubud Cultural Tour',
        description: 'Explore Ubud\'s temples, art villages, and famous rice terraces.',
        activities: ['Temple visits', 'Art village tour', 'Rice terrace walk', 'Traditional dance show'],
        meals: ['Breakfast'],
      },
      {
        day: 3,
        title: 'Mount Batur Sunrise Trek',
        description: 'Early morning trek to Mount Batur for a spectacular sunrise view.',
        activities: ['Pre-dawn departure', 'Volcano trek', 'Sunrise viewing', 'Hot springs visit'],
        meals: ['Breakfast', 'Picnic lunch'],
      },
      {
        day: 4,
        title: 'Cooking Class & Spa',
        description: 'Learn to cook authentic Balinese dishes and enjoy a relaxing spa treatment.',
        activities: ['Market visit', 'Cooking class', 'Traditional spa', 'Free time'],
        meals: ['Breakfast', 'Cooking class lunch'],
      },
      {
        day: 5,
        title: 'Beach Day in Seminyak',
        description: 'Transfer to Seminyak for beach relaxation and water activities.',
        activities: ['Beach time', 'Water sports', 'Sunset viewing', 'Beach dinner'],
        meals: ['Breakfast'],
        accommodation: 'Beach Resort in Seminyak'
      },
      {
        day: 6,
        title: 'Free Day & Shopping',
        description: 'Enjoy a free day for shopping, spa treatments, or beach activities.',
        activities: ['Free time', 'Shopping', 'Optional activities', 'Farewell dinner'],
        meals: ['Breakfast', 'Farewell dinner'],
      },
      {
        day: 7,
        title: 'Departure',
        description: 'Check out and transfer to the airport for departure.',
        activities: ['Hotel check-out', 'Airport transfer'],
        meals: ['Breakfast'],
      }
    ],
    gallery: [
      'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    availability: [
      { date: '2024-03-10', available: true, price: 1899 },
      { date: '2024-03-17', available: true, price: 1899 },
      { date: '2024-03-24', available: true, price: 1999 },
      { date: '2024-03-31', available: false, price: 1899 },
    ]
  },
  {
    id: 'pkg-3',
    title: 'Swiss Alps Ski Adventure',
    destination: 'Swiss Alps',
    duration: '6 Days, 5 Nights',
    price: 3299,
    rating: 4.9,
    reviews: 234,
    image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
    highlights: ['Ski Lessons', 'Mountain Railways', 'Alpine Dining', 'Scenic Cable Cars'],
    inclusions: ['4-star mountain hotel', 'Daily breakfast', 'Ski pass', 'Equipment rental', 'Ski lessons'],
    exclusions: ['International flights', 'Lunch and dinner', 'Personal expenses', 'Travel insurance'],
    category: 'Adventure',
    difficulty: 'Challenging',
    groupSize: '6-15 people',
    languages: ['English', 'German', 'French'],
    cancellation: 'Free cancellation up to 7 days',
    agentId: 'agent-3',
    agentName: 'Alpine Adventures Switzerland',
    agentRating: 4.9,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Zermatt',
        description: 'Arrive in the car-free village of Zermatt, home to the iconic Matterhorn.',
        activities: ['Train arrival', 'Hotel check-in', 'Equipment fitting', 'Village orientation'],
        meals: ['Welcome drink'],
        accommodation: '4-star Alpine Hotel with Matterhorn View'
      },
      {
        day: 2,
        title: 'First Day on the Slopes',
        description: 'Begin your skiing adventure with lessons and exploring the Zermatt ski area.',
        activities: ['Ski lessons', 'Slope exploration', 'Cable car rides', 'Mountain lunch'],
        meals: ['Breakfast'],
      },
      {
        day: 3,
        title: 'Gornergrat Railway & Skiing',
        description: 'Take the famous Gornergrat railway and enjoy advanced skiing.',
        activities: ['Gornergrat railway', 'Advanced skiing', 'Photography', 'Alpine dining'],
        meals: ['Breakfast'],
      },
      {
        day: 4,
        title: 'Matterhorn Glacier Paradise',
        description: 'Visit Europe\'s highest cable car station and ski on the glacier.',
        activities: ['Glacier cable car', 'Glacier skiing', 'Ice palace visit', 'Panoramic views'],
        meals: ['Breakfast'],
      },
      {
        day: 5,
        title: 'Free Skiing & Spa',
        description: 'Enjoy free skiing time and relax at the hotel spa.',
        activities: ['Free skiing', 'Spa treatments', 'Shopping', 'Farewell dinner'],
        meals: ['Breakfast', 'Farewell dinner'],
      },
      {
        day: 6,
        title: 'Departure',
        description: 'Check out and transfer to departure point.',
        activities: ['Hotel check-out', 'Equipment return', 'Departure transfer'],
        meals: ['Breakfast'],
      }
    ],
    gallery: [
      'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1559821/pexels-photo-1559821.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    availability: [
      { date: '2024-01-15', available: true, price: 3299 },
      { date: '2024-01-22', available: true, price: 3299 },
      { date: '2024-01-29', available: false, price: 3299 },
      { date: '2024-02-05', available: true, price: 3499 },
    ]
  }
];

export const agents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Mediterranean Dreams Travel',
    email: 'info@meddreams.com',
    phone: '+30 210 123 4567',
    company: 'Mediterranean Dreams Travel Agency',
    rating: 4.9,
    reviews: 1247,
    verified: true,
    specialties: ['Greek Islands', 'Romantic Getaways', 'Luxury Travel', 'Cultural Tours'],
    languages: ['English', 'Greek', 'German', 'French'],
    experience: 12,
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200',
    packages: []
  },
  {
    id: 'agent-2',
    name: 'Bali Explorer Tours',
    email: 'hello@baliexplorer.com',
    phone: '+62 361 123 456',
    company: 'Bali Explorer Tours & Travel',
    rating: 4.8,
    reviews: 892,
    verified: true,
    specialties: ['Adventure Tours', 'Cultural Experiences', 'Eco Tourism', 'Photography Tours'],
    languages: ['English', 'Indonesian', 'Dutch', 'Japanese'],
    experience: 8,
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200',
    packages: []
  },
  {
    id: 'agent-3',
    name: 'Alpine Adventures Switzerland',
    email: 'info@alpineadventures.ch',
    phone: '+41 27 123 4567',
    company: 'Alpine Adventures Switzerland',
    rating: 4.9,
    reviews: 654,
    verified: true,
    specialties: ['Ski Tours', 'Mountain Adventures', 'Luxury Alpine', 'Winter Sports'],
    languages: ['English', 'German', 'French', 'Italian'],
    experience: 15,
    avatar: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=200',
    packages: []
  }
];