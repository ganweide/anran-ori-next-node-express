const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const transferSchema = new Schema({
    transfer_date: {
        type: Date,
        default: Date.now
    },
    memberfrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'members'
    },
    memberto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'members'
    },
    memberpackage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'memberPackage'
    },
    points: {
        type: Number,
        required: true,
    }, 
    transaction_no: {
        type: String
    }

});
module.exports = mongoose.model('transfer', transferSchema);


