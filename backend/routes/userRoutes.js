const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   PUT /api/users/profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, avatar, banner } = req.body;
        
        let updateData = {};
        if (name) updateData.name = name;
        if (avatar !== undefined) updateData.avatar = avatar;
        if (banner !== undefined) updateData.banner = banner;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true }
        );

        res.json({ success: true, message: 'Profile updated', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/users/password
router.put('/password', auth, async (req, res) => {
    // Mock password update
    res.json({ success: true, message: 'Password updated (Mocked)' });
});

module.exports = router;
