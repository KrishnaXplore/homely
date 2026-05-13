const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    savedRemedies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Remedy'
    }],
    avatar: {
        type: String,
        default: null
    },
    banner: {
        type: String,
        default: null
    }
}, { timestamps: true });

// Remove password when sending user object
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', userSchema);
