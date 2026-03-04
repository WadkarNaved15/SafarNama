import { User,AuthorityRequest } from "../models/User.js";
import { validateRegistration,generateToken,authenticateToken} from "../middlewares/auth.js";
import express from 'express';
import { apiLimiter  as authLimiter } from '../middlewares/rateLimit.js';
const router = express.Router();

router.post('/register', authLimiter, validateRegistration, async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    console.log('Registration request body:', req.body);
    console.log('Name:', name.trim(), 'Email:', email, 'Phone:', phone);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create new tourist user
    const newUser = new User({
      name: name,
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password,
      role: 'tourist'
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id);

    // Return user data without password
    const userData = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      emailVerified: newUser.emailVerified
    };

    res.status(201).json({
      success: true,
      user: userData,
      token,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// Authority Registration Request
router.post('/request-authority', authLimiter, async (req, res) => {
  try {
    const {
      name, email, department, badgeNumber,
      jurisdiction, officialEmail, phoneNumber
    } = req.body;

    // Validation
    if (!name || !email || !department || !badgeNumber || !jurisdiction || !officialEmail || !phoneNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if request already exists
    const existingRequest = await AuthorityRequest.findOne({
      $or: [{ email }, { badgeNumber }, { officialEmail }]
    });

    if (existingRequest) {
      return res.status(400).json({ 
        error: 'A request with this email, badge number, or official email already exists' 
      });
    }

    // Create authority request
    const authorityRequest = new AuthorityRequest({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      department: department.trim(),
      badgeNumber: badgeNumber.trim(),
      jurisdiction: jurisdiction.trim(),
      officialEmail: officialEmail.toLowerCase().trim(),
      phoneNumber: phoneNumber.trim()
    });

    await authorityRequest.save();

    res.status(201).json({
      success: true,
      message: 'Authority access request submitted. You will be notified once approved.',
      requestId: authorityRequest._id
    });

  } catch (error) {
    console.error('Authority request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login request body:', req.body);
    console.log('Email:', email, 'Password:', password);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ 
      email: email.toLowerCase().trim(),
      isActive: true 
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({ 
        error: 'Account temporarily locked due to too many failed attempts. Please try again later.' 
      });
    }

    // Verify password
    try {
      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        await user.incLoginAttempts();
        return res.status(401).json({ error: 'Invalid email or password' });
      }
    } catch (error) {
      return res.status(423).json({ error: error.message });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Prepare user data
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified
    };

    if (user.role === 'tourist') {
      userData.phone = user.phone;
      userData.didData = user.didData;
    } else if (user.role === 'authority') {
      userData.authorityInfo = user.authorityInfo;
    }

    res.json({
      success: true,
      user: userData,
      token,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Logout endpoint
router.post('/logout', authenticateToken, async (req, res) => {
  // In a real app, you might want to blacklist the token
  res.json({ success: true, message: 'Logged out successfully' });
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userData = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      emailVerified: req.user.emailVerified,
      lastLogin: req.user.lastLogin
    };

    if (req.user.role === 'tourist') {
      userData.phone = req.user.phone;
      userData.didData = req.user.didData;
    } else if (req.user.role === 'authority') {
      userData.authorityInfo = req.user.authorityInfo;
    }

    res.json({ success: true, user: userData });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;