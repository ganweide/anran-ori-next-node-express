const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const packageSchema = new Schema({
    package_name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    }, noof_times: {
        type: Number,
        required: true,
    }, promo_noof_times: {
        type: Number,
    },
    percentage_ownbranch: {
        type: Number,
    },
    price_ownbranch: {
        type: Number,
    },
    price_checkinbranch: {
        type: Number,
    },
    promotion: {
        type: Boolean,
        required: true
    },
    promotion_period_from: {
        type: Date,
    },
    promotion_period_to: {
        type: Date,
    },
    transferable: {
        type: Boolean,
        required: true
    },
    all_branch: {
        type: Boolean,
        required: true
    },
    individual_package: {
        type: Boolean,
        required: true
    },
    package_image: {
        type: String,
    },
    package_category: {
        type: String,
    },
    package_image_url: {
        type: String,
    },
    branch: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'branch'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    sortorder: {
        type: Number,
        default: 1
    },
    status_active: {
        type: Boolean,
        required: true,
    },
    unlimitedyear: {
        type: Boolean,
        required: true,
    }
});
module.exports = mongoose.model('items', packageSchema);