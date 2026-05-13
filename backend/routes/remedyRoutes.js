const express = require('express');
const router = express.Router();
const Remedy = require('../models/Remedy');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET /api/remedies
router.get('/', async (req, res) => {
    try {
        const { category, sort, limit } = req.query;
        let query = {};
        
        if (category && category !== 'all') {
            query.category = category;
        }

        let remediesQuery = Remedy.find(query).populate('creator', 'name avatar');

        if (sort) {
            const sortField = sort.replace('-', '');
            const sortOrder = sort.startsWith('-') ? -1 : 1;
            remediesQuery = remediesQuery.sort({ [sortField]: sortOrder });
        }

        if (limit) {
            remediesQuery = remediesQuery.limit(parseInt(limit));
        }

        const remedies = await remediesQuery;
        res.json({ success: true, data: remedies });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/remedies/search
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.json({ success: true, data: [] });
        }
        
        const remedies = await Remedy.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { 'ingredients.name': { $regex: q, $options: 'i' } }
            ]
        }).populate('creator', 'name avatar');
        
        res.json({ success: true, data: remedies });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/remedies/user/saved/list
router.get('/user/saved/list', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('savedRemedies');
        res.json({ success: true, data: user.savedRemedies });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/remedies/:id
router.get('/:id', async (req, res) => {
    try {
        const remedy = await Remedy.findById(req.params.id).populate('creator', 'name avatar');
        if (!remedy) {
            return res.status(404).json({ success: false, message: 'Remedy not found' });
        }
        res.json({ success: true, data: remedy });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/remedies
router.post('/', auth, async (req, res) => {
    try {
        const newRemedy = new Remedy({
            ...req.body,
            creator: req.user._id
        });
        const savedRemedy = await newRemedy.save();
        res.json({ success: true, data: savedRemedy });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error creating remedy', error: error.message });
    }
});

// @route   POST /api/remedies/:id/save
router.post('/:id/save', auth, async (req, res) => {
    try {
        const remedyId = req.params.id;
        const user = req.user;
        
        if (!user.savedRemedies.includes(remedyId)) {
            user.savedRemedies.push(remedyId);
            await user.save();
        }
        res.json({ success: true, message: 'Remedy saved' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/remedies/:id/save
router.delete('/:id/save', auth, async (req, res) => {
    try {
        const remedyId = req.params.id;
        const user = req.user;
        
        user.savedRemedies = user.savedRemedies.filter(id => id.toString() !== remedyId);
        await user.save();
        
        res.json({ success: true, message: 'Remedy unsaved' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
