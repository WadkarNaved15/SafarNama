import { User,AuthorityRequest } from "../models/User.js";
import { authenticateToken,requireAuthority } from "../middlewares/auth.js";
import express from 'express';
const router = express.Router();

// Admin: Get pending authority requests
router.get('/authority-requests', authenticateToken, requireAuthority, async (req, res) => {
  try {
    // In a real app, you'd have super admin role check here
    const requests = await AuthorityRequest.find({ status: 'pending' })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, requests });
  } catch (error) {
    console.error('Get authority requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Approve authority request
router.post('/approve-authority/:requestId', authenticateToken, requireAuthority, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { tempPassword } = req.body;

    if (!tempPassword || tempPassword.length < 8) {
      return res.status(400).json({ error: 'Temporary password must be at least 8 characters' });
    }

    const request = await AuthorityRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Request already processed' });
    }

    // Create authority user
    const authorityUser = new User({
      name: request.name,
      email: request.email,
      password: tempPassword,
      role: 'authority',
      authorityInfo: {
        department: request.department,
        badgeNumber: request.badgeNumber,
        jurisdiction: request.jurisdiction,
        verified: true
      }
    });

    await authorityUser.save();

    // Update request status
    request.status = 'approved';
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    request.tempPassword = tempPassword; // Store for email (hash it in production)
    request.tempPasswordExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await request.save();

    res.json({
      success: true,
      message: 'Authority request approved successfully',
      userCreated: true
    });

  } catch (error) {
    console.error('Approve authority error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Reject authority request
router.post('/reject-authority/:requestId', authenticateToken, requireAuthority, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { reason } = req.body;

    const request = await AuthorityRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Request already processed' });
    }

    request.status = 'rejected';
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    request.rejectionReason = reason || 'Request rejected by administrator';
    await request.save();

    res.json({
      success: true,
      message: 'Authority request rejected successfully'
    });

  } catch (error) {
    console.error('Reject authority error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;