const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const messagesSchema = new Schema({
    msg: {
        type: String,
        required: true
    },
    msg_type: {
        type: String,
        required: true,
    },
    image_url: {
        type: String,
    },
    image_data_url: {
        type: String,
    },
    startdate: {
        type: Date,
    },
    enddate: {
        type: Date,
    },
    status_active: {
        type: Boolean,
        required: true,
    },
    allways: {
        type: Boolean,
        required: true,
    },
    sortorder: {
        type: Number,
        default: 1
    },
});
module.exports = mongoose.model('messages', messagesSchema);