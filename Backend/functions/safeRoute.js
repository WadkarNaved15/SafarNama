import axios from 'axios';

import 'dotenv/config';

const PYTHON_API_URL = `${process.env.PYTHON_API_URL}/predict_safety` || 'http://localhost:5001/predict_safety';
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// ==========================================
// 1. HELPER: Fetch Routes from Google
// =========================================

export const fetchGoogleRoutes = async (origin, destination) => {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
            params: {
                origin: origin,       // e.g., "Andheri Station, Mumbai"
                destination: destination,
                alternatives: true,   // <--- CRITICAL: Asks for multiple paths
                mode: 'walking',      // or 'driving'
                key: GOOGLE_API_KEY
            }
        });

        if (response.data.status !== 'OK') {
            throw new Error(`Google Maps API Error: ${response.data.status}`);
        }

        return response.data.routes;
    } catch (error) {
        console.error("Google Fetch Failed:", error.message);
        return [];
    }
};

// ==========================================
// 2. HELPER: Get Safety Score for ONE Point
// ==========================================
export const getPointSafety = async (lat, lon) => {
    try {
        console.log("python url is ->", PYTHON_API_URL);
        // Call your Python Microservice
        const response = await axios.post(PYTHON_API_URL, {
            latitude: lat,
            longitude: lon,
            time_hour: new Date().getHours() // Dynamic time
        });
        return response.data.safety_score;
    } catch (error) {
        console.error("Python API Failed:", error.message);
        return 50; // Fallback score if Python is down
    }
};

