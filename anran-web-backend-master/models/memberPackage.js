const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('./counterSchema');

const membersSchema = new Schema({
    package_date: {
        type: Date,
        default: Date.now
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'members',
        required: true
    },
    packageid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'items',
        required: true
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'branch'
    },
    package: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    price: {
        type: Number,
    },
    times: {
        type: Number,
    },
    used: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number
    },
    purchasetype: {
        type: String,
        default: 'Purchased'
    },
    transferfrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'memberPackage',
        default: null
    },
    transferedtimes: {
        type: Number,
        default: 0
    },
    paymenttype: {
        type: String,
    },
    invoicenumber: {
        type: String,
    

    },
});




module.exports = mongoose.model('memberPackage', membersSchema);