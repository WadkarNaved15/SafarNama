import express from 'express';
import getSafeRoutes from '../functions/safeRoute.js';

const router = express.Router();

// Define the POST route
// URL will be: http://localhost:3000/api/safe-route
router.post('/', getSafeRoutes);

export default router;