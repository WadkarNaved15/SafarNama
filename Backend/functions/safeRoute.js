import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();    

// Configuration
// Ensure Python runs on 5001. If on Mac, 127.0.0.1 is safer than localhost.
const PYTHON_API_URL = 'http://127.0.0.1:5001/predict_safety'; 
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const getSafeRoutes = async (req, res) => {
    const { origin, destination } = req.body;

    // 1. Validation
    if (!origin || !destination) {
        return res.status(400).json({ error: 'Origin and Destination are required' });
    }

    try {
        console.log(`\n🔍 Received Request: ${origin} -> ${destination}`);
        
        // 2. Call Google Maps Directions API
        const googleResponse = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
            params: {
                origin,
                destination,
                alternatives: true, // Request multiple routes
                key: GOOGLE_API_KEY,
                mode: 'driving'
            }
        });

        if (googleResponse.data.status !== 'OK') {
            console.error("❌ Google Maps Error:", googleResponse.data.status);
            return res.status(500).json({ error: `Google Maps Error: ${googleResponse.data.status}` });
        }

        const routes = googleResponse.data.routes;
        console.log(`   -> Google found ${routes.length} potential routes.`);

        // 3. Analyze each route with Python AI
        const analyzedRoutes = await Promise.all(routes.map(async (route, index) => {
            
            let totalScore = 0;
            let checkPoints = 0;

            // We check sample points along the route (every step's end location)
            const steps = route.legs[0].steps;
            
            // Limit checks to maximum 10 points per route to speed up performance
            const samplePoints = steps.map(s => ({
                lat: s.end_location.lat,
                lng: s.end_location.lng
            })).slice(0, 10); 

            for (const point of samplePoints) {
                try {
                    const pyRes = await axios.post(PYTHON_API_URL, {
                        latitude: point.lat,
                        longitude: point.lng,
                        time_hour: new Date().getHours()
                    });

                    if (pyRes.data.success) {
                        totalScore += pyRes.data.safety_score;
                        checkPoints++;
                    }
                } catch (err) {
                    console.log("   ⚠️ Python AI unavailable for a point (using default).");
                }
            }

            // Calculate Average Score (Default to 50 if Python fails)
            const avgSafetyScore = checkPoints > 0 ? Math.round(totalScore / checkPoints) : 50;
            
            // Assign Risk Level
            let riskLevel = "Moderate";
            if (avgSafetyScore >= 80) riskLevel = "Safe";
            if (avgSafetyScore < 50) riskLevel = "Risky";

            return {
                summary: route.summary,
                duration: route.legs[0].duration,
                distance: route.legs[0].distance,
                polyline: route.overview_polyline.points, // Encoded string for Frontend
                safety_score: avgSafetyScore,
                risk_level: riskLevel
            };
        }));

        // 4. Sort routes by Safety Score (Highest First)
        analyzedRoutes.sort((a, b) => b.safety_score - a.safety_score);

        // 5. Send Response
        console.log("✅ Sent optimized routes to frontend.");
        res.json({
            success: true,
            recommended_route_index: 0,
            routes: analyzedRoutes
        });

    } catch (error) {
        console.error("❌ Server Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default getSafeRoutes;