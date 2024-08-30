const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const rolePermissionSchema = new Schema({
  view: {
    type: Boolean,
    required: true
  },
  create: {
    type: Boolean,
    required: true
  },
  update: {
    type: Boolean,
    required: true
  }
});

const rolePermissionDelSchema = new Schema({
  view: {
    type: Boolean,
    required: true
  },
  create: {
    type: Boolean,
    required: true
  },
  delete: {
    type: Boolean,
    required: true
  }
});

const roleSchema = new Schema({
  role_name: {
    type: String,
    required: true,
    unique: true
  },
  admin_role: rolePermissionSchema,
  admin_banner: rolePermissionDelSchema,
  admin_message: rolePermissionDelSchema,
  admin_staff: rolePermissionSchema,
  admin_branch: rolePermissionSchema,
  admin_room: rolePermissionSchema,
  admin_package: rolePermissionSchema,
  member_member: rolePermissionSchema,
  member_booking: rolePermissionSchema,
  member_checkin: rolePermissionSchema,
  member_checkinqr: rolePermissionSchema,
  member_transfer: rolePermissionSchema,
  finance_purchase: rolePermissionSchema,
  finance_checkin: rolePermissionSchema,
  finance_attendance: rolePermissionSchema,
  branch: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'branch'
  }],
  all_branch: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status_active: {
    type: Boolean,
    required: true,
  },
});
module.exports = mongoose.model('roles', roleSchema);