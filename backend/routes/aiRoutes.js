const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// @route   POST /api/ai/chat
router.post('/chat', auth, async (req, res) => {
    try {
        const { message, context } = req.body;
        
        // Mocking AI response for local testing without an API key
        const mockResponse = `This is a simulated AI response for: "${message}". In a real deployment, this would connect to OpenAI or Gemini.`;
        
        // Simulating network delay
        setTimeout(() => {
            res.json({ success: true, response: mockResponse });
        }, 1500);

    } catch (error) {
        res.status(500).json({ success: false, message: 'AI Server error' });
    }
});

// @route   POST /api/ai/moderate
router.post('/moderate', auth, async (req, res) => {
    // Mock moderation
    res.json({ success: true, isSafe: true });
});

// @route   POST /api/ai/format
router.post('/format', auth, async (req, res) => {
    // Mock format
    res.json({ success: true, formattedText: req.body.text });
});

module.exports = router;
