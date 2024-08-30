const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({

    booking_date: {
        type: Date,
        default: Date.now
    },
    booking_no: {
        type: String
    },
    title:{
        type: String,
    },
    package_name:{
        type: String,
    },
    room_no:{
        type: String,
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'members'
    },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'memberPackage'
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'branch'
    },
    floor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'floor'
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rooms'
    },
    start: {
        type: Date,
    },
    end: {
        type: Date,
    },
    pax: {
        type: Number,
    },
    malecount: {
        type: Number,
        default:0,
    },
    femaleCount: {
        type: Number,
        default:0,
    },
    bookingstatus:{
        type:String,
        default:'Booked',
    },
    checkin_date: {
        type: Date,
        default:null,
    },
    transaction_no:{
        type: String
    }

});

module.exports = mongoose.model('booking', bookingSchema);