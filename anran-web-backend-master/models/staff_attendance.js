const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staffAttendanceSchema = new Schema({
    att_date: {
        type: Date,
        default: Date.now
    },
    att_type: {
        type: String,
        required: true,
    },
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff',
        required: true,
    },
});

module.exports = mongoose.model('staff_attendance', staffAttendanceSchema);