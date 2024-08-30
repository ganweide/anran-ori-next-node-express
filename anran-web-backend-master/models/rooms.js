const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const branchSchema = new Schema({
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'branch'
  },
  room_no: {
    type: String,
    required: true,
  },
  floor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'floor'
  },
  noof_persons: {
    type: Number,
    required: true,
  },
  room_floor_plan: {
    type: String,
  },
  room_floor_url: {
    type: String,
  },
  room_gender:{
    type: String
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
module.exports = mongoose.model('rooms', branchSchema);