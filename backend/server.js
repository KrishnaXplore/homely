const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    /\.vercel\.app$/,              // all Vercel preview deployments
    process.env.FRONTEND_URL       // production Vercel URL (set in Render)
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Basic Route
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the local Homely API' });
});

// Import and use routes (will create these next)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/remedies', require('./routes/remedyRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
