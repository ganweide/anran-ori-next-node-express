const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bannerSchema = new Schema({
    image_url: {
        type: String,
        required: true
    },
    image_data_url: {
        type: String,
        required: true
    },
    startdate: {
        type: Date
    },
    enddate: {
        type: Date
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
module.exports = mongoose.model('banner', bannerSchema);