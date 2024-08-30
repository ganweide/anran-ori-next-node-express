const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const branchSchema = new Schema({
  company_name: {
    type: String,
    required: true
  },
  branch_name: {
    type: String,
    required: true,
  },
  branch_code: {
    type: String,
    required: true,
  },
  whatsappno: {
    type: String,
    required: true,
  },
  operating_from_hours: {
    type: Date,
    required: true,
    timestamps: true
  },
  operating_to_hours: {
    type: Date,
    required: true,
    timestamps: true
  },
  address: {
    type: String,
    required: true
  },
  google_link: {
    type: String,
    required: false
  },
  waze_link: {
    type: String,
    required: false
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'staff'
  },
  image_url: {
    type: String,
  },
  image_data: {
    type: String,
  },
  paymentkey: {
    type: String,
  },
  apikey: {
    type: String,
  },
  hqbanch: {
    type: Boolean,
    required: true,
  },
  sst: {
    type: Boolean,
    required: true,
  },
  sst_percent: {
    type: Number,
  },
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
  }
});
module.exports = mongoose.model('branch', branchSchema);