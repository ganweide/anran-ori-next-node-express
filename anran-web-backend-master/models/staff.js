const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const staffSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  staff_code: {
    type: String,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    required: true,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'branch',
    required: true,
  },
  roles: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'roles',
    required: true,
  },
  joingdate: {
    type: Date,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  loginkey: {
    type: String,
    required: true,
  },
  status_active: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  emailaddress: {
    type: String,
  },
  position_department: {
    type: String,
  },
  fullname: {
    type: String,
  },
  nirc: {
    type: String,
  },
  religion: {
    type: String,
  },
  mobilenumber: {
    type: String,
  },
  martialstatus: {
    type: String,
  },
  currentaddress: {
    type: String,
  },
  bankname: {
    type: String,
  },
  bankaccountnumber: {
    type: String,
  },
  bankepfno: {
    type: String,
  },
  banksocsono: {
    type: String,
  },
  bankincometaxno: {
    type: String,
  },
  emergency_contactname: {
    type: String,
  },
  emergency_relation: {
    type: String,
  },
  emergency_contact: {
    type: String,
  }
});
module.exports = mongoose.model('staff', staffSchema);