const jwt = require("jsonwebtoken");
const { ADMIN_USERNAME } = process.env;
const { ADMIN_PASSWORD } = process.env;
const Staff = require('../models/staff');

module.exports = {
    loginVerify
}

function getRolesList(roles, admin) {
    if (roles && admin === false) {
        const ls = [];
        //admin_role
        if (roles.admin_role && roles.admin_role.view) {
            ls.push("admin_role_view");
        }
        if (roles.admin_role && roles.admin_role.update) {
            ls.push("admin_role_update");
        }
        if (roles.admin_role && roles.admin_role.create) {
            ls.push("admin_role_create");
        }
        // admin_banner
        if (roles.admin_banner && roles.admin_banner.view) {
            ls.push("admin_banner_view");
        }
        if (roles.admin_banner && roles.admin_banner.create) {
            ls.push("admin_banner_create");
        }
        if (roles.admin_banner && roles.admin_banner.delete) {
            ls.push("admin_banner_delete");
        }
        //admin_message
        if (roles.admin_message && roles.admin_message.view) {
            ls.push("admin_message_view");
        }
        if (roles.admin_message && roles.admin_message.create) {
            ls.push("admin_message_create");
        }
        if (roles.admin_message && roles.admin_message.delete) {
            ls.push("admin_message_delete");
        }
        //admin_staff
        if (roles.admin_staff && roles.admin_staff.view) {
            ls.push("admin_staff_view");
        }
        if (roles.admin_staff && roles.admin_staff.update) {
            ls.push("admin_staff_update");
        }
        if (roles.admin_staff && roles.admin_staff.create) {
            ls.push("admin_staff_create");
        }
        //branch
        if (roles.admin_branch && roles.admin_branch.view) {
            ls.push("admin_branch_view");
        }
        if (roles.admin_branch && roles.admin_branch.update) {
            ls.push("admin_branch_update");
        }
        if (roles.admin_branch && roles.admin_branch.create) {
            ls.push("admin_branch_create");
        }
        //room
        if (roles.admin_room && roles.admin_room.view) {
            ls.push("admin_room_view");
        }
        if (roles.admin_room && roles.admin_room.update) {
            ls.push("admin_room_update");
        }
        if (roles.admin_room && roles.admin_room.create) {
            ls.push("admin_room_create");
        }
        //package
        if (roles.admin_package && roles.admin_package.view) {
            ls.push("admin_package_view");
        }
        if (roles.admin_package && roles.admin_package.update) {
            ls.push("admin_package_update");
        }
        if (roles.admin_package && roles.admin_package.create) {
            ls.push("admin_package_create");
        }
        //member_member
        if (roles.member_member && roles.member_member.view) {
            ls.push("member_member_view");
        }
        if (roles.member_member && roles.member_member.update) {
            ls.push("member_member_update");
        }
        if (roles.member_member && roles.member_member.create) {
            ls.push("member_member_create");
        }
        //member_booking
        if (roles.member_booking && roles.member_booking.view) {
            ls.push("member_booking_view");
        }
        if (roles.member_booking && roles.member_booking.update) {
            ls.push("member_booking_update");
        }
        if (roles.member_booking && roles.member_booking.create) {
            ls.push("member_booking_create");
        }
        //member_checkin
        if (roles.member_checkin && roles.member_checkin.view) {
            ls.push("member_checkin_view");
        }
        if (roles.member_checkin && roles.member_checkin.update) {
            ls.push("member_checkin_update");
        }
        if (roles.member_checkin && roles.member_checkin.create) {
            ls.push("member_checkin_create");
        }
        //member_checkinqr
        if (roles.member_checkinqr && roles.member_checkinqr.view) {
            ls.push("member_checkinqr_view");
        }
        if (roles.member_checkinqr && roles.member_checkinqr.update) {
            ls.push("member_checkinqr_update");
        }
        if (roles.member_checkinqr && roles.member_checkinqr.create) {
            ls.push("member_checkinqr_create");
        }
        //member_transfer
        if (roles.member_transfer && roles.member_transfer.view) {
            ls.push("member_transfer_view");
        }
        if (roles.member_transfer && roles.member_transfer.update) {
            ls.push("member_transfer_update");
        }
        if (roles.member_transfer && roles.member_transfer.create) {
            ls.push("member_transfer_create");
        }
        //finance_checkin
        if (roles.finance_checkin && roles.finance_checkin.view) {
            ls.push("finance_checkin_view");
        }
        if (roles.finance_checkin && roles.finance_checkin.update) {
            ls.push("finance_checkin_update");
        }
        if (roles.finance_checkin && roles.finance_checkin.create) {
            ls.push("finance_checkin_create");
        }
        //finance_purchase
        if (roles.finance_purchase && roles.finance_purchase.view) {
            ls.push("finance_purchase_view");
        }
        if (roles.finance_purchase && roles.finance_purchase.update) {
            ls.push("finance_purchase_update");
        }
        if (roles.finance_purchase && roles.finance_purchase.create) {
            ls.push("finance_purchase_create");
        }

        //finance_attendance
        if (roles.finance_attendance && roles.finance_attendance.view) {
            ls.push("finance_attendance_view");
        }
        if (roles.finance_attendance && roles.finance_attendance.update) {
            ls.push("finance_attendance_update");
        }
        if (roles.finance_attendance && roles.finance_attendance.create) {
            ls.push("finance_attendance_create");
        }
        return ls;
    } else if (admin === true) {
        const ls = ["admin_role_view",
            "admin_role_update",
            "admin_role_create",
            "admin_banner_view",
            "admin_banner_create",
            "admin_banner_delete",
            "admin_message_view",
            "admin_message_delete",
            "admin_message_create",
            "admin_staff_view",
            "admin_staff_create",
            "admin_staff_update",
            "admin_branch_view",
            "admin_branch_create",
            "admin_branch_update",
            "admin_room_view",
            "admin_room_create",
            "admin_room_update",
            "admin_package_view",
            "admin_package_create",
            "admin_package_update",
            "member_member_view",
            "member_member_create",
            "member_member_update",
            "member_booking_view",
            "member_booking_create",
            "member_booking_update",
            "member_checkin_view",
            "member_checkin_create",
            "member_checkin_update",
            "member_checkinqr_view",
            "member_checkinqr_create",
            "member_checkinqr_update",
            "member_transfer_view",
            "member_transfer_create",
            "member_transfer_update",
            "finance_purchase_view",
            "finance_purchase_create",
            "finance_purchase_update",
            "finance_checkin_view",
            "finance_checkin_create",
            "finance_checkin_update",
            "finance_attendance_view",
            "finance_attendance_update",
            "finance_attendance_create",
        ];
        return ls;
    }
    return [];
}

async function loginVerify(body) {
    try {
        var username = body.username;
        var password = body.password;
        if (!(username && password)) {
            return {
                status: false,
                message: "Username and Password is required",
                username: username,
            };
        }
        else {
            const obj = await Staff.find({ $and: [{ username: { $eq: body.username } }, { loginkey: { $eq: body.password } }, { status_active: { $eq: true } }] }).populate({
                path: "roles",
            });
            if ((obj && obj.length != 0) || (username === ADMIN_USERNAME && password === ADMIN_PASSWORD)) {
                const token = jwt.sign(
                    body,
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "50m",
                    }
                );
                return {
                    status: true,
                    statusCode: 200,
                    message: "Login successfull",
                    token,
                    username: username,
                    roles: ((obj && obj.length != 0 && username !== 'admin') ? getRolesList(obj[0].roles, false) : getRolesList([], true))
                };
            } else {
                return {
                    status: false,
                    message: "Username and Password is Not Valid!!!",
                    username: username,
                };
            }
        }
    } catch (err) {
        return {
            status: false,
            statusCode: 500,
            message: err.message
        }
    }
}
