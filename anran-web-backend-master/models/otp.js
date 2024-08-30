const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new Schema({
    mobileNumber: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: '5m' } // TTL index set to 5 minutes
    }
});

module.exports = mongoose.model('otps', otpSchema);
