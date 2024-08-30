const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const membersSchema = new Schema({
    member_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "New Member"

    },
    member_name: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    fullregister: {
        type: Boolean,
        default: false
    },
    existingmobileno: {
        type: String
    },
    preferredbranch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'branch'
    },
    paymentmethod: {
        type: String,
        required: false
    },
    legalFullname: {
        type: String,
        required: false
    },
    preferredname: {
        type: String,
        required: false
    },
    chinesename: {
        type: String
    },
    passport: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },

    dob: {
        type: Date
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    postcode: {
        type: Number
    },
    states: {
        type: String
    },
    email: {
        type: String
    },
    aboutus: {
        type: String
    },
    medicalhistory: {
        type: String
    },
    suffered: {
        type: [String]
    },
    healthrelatedissue: {
        type: String
    },
    emergencyName: {
        type: String
    },
    emergencymobile: {
        type: String
    },

    emergencyrelationship: {
        type: String
    },
    agree: {
        type: Boolean
    },
    blocked: {
        type: Boolean,
        default: false
    },
    profileimageurl:{
        type: String
    },
    package_date: {
        type: Date
       
    },
    checkin_date: {
        type: Date
    },


});

module.exports = mongoose.model('members', membersSchema);