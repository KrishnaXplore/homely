const mongoose = require('mongoose');

const remedySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, default: 'easy' },
    prepTime: { type: Number },
    ingredients: [
        {
            name: { type: String, required: true },
            amount: { type: String },
            unit: { type: String }
        }
    ],
    steps: [
        {
            stepNumber: { type: Number },
            instruction: { type: String, required: true }
        }
    ],
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    image: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Remedy', remedySchema);
