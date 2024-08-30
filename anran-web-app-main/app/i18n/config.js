import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
    .use(initReactI18next)
    .init({
        lng: "en",
        fallbackLng: "en",
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: {
                translation: {
                    login_text: "Anran - Log in",
                    menu_admin: "Admin",
                    menu_staff: "Staff",
                    menu_role: "Role",
                    menu_banner: "Banner",
                    menu_messages: "Messages",
                    menu_branch: "Branch",
                    menu_floor: "Floor",
                    menu_room: "Room",
                    menu_package: "Package",
                    menu_users: "Users",
                    menu_members_info: "Members Info",
                    menu_purchase_details: "Purchase Details",
                    menu_booking: "Booking",
                    menu_booking_checkin: "Bookings Checkin",
                    menu_transfercredit: "Transfer Package",
                    menu_attendance: "Attendance info",
                    menu_finance: "Financial Report",
                    logout:"Logout",
                    login:"LogIn",
                    welcome:"Welcome",
                    add_new:"Add New",
                    role_name:"Role Name",
                    role_branch:"Role Branch",
                    save:"Save",
                    update:"Update",
                    create:"Create",
                    username:"Username",
                    password:"Password"
                },
            },
            ch: {
                translation: {
                    login_text: "安然 - 登录",
                    menu_admin: "行政",
                    menu_staff: "职员",
                    menu_branch: "分支",
                    menu_role: "角色",
                    menu_banner: "横幅",
                    menu_messages: "留言",
                    menu_room: "分支",
                    menu_floor: "分支",
                    menu_package: "包裹",
                    menu_users: "用户",
                    menu_members_info: "会员信息",
                    menu_purchase_details: "购买详情",
                    menu_booking: "购买详情",
                    menu_booking_checkin: "预订登记",
                    menu_transfercredit: "转移学分",
                    menu_attendance: "出席信息",
                    menu_finance: "财务报告",
                    logout:"Logout",
                    login:"LogIn",
                    welcome:"Welcome",
                    add_new:"Add New",
                    role_name:"Role Name",
                    role_branch:"Role Branch",
                    save:"Save",
                    update:"Update",
                    create:"Create",
                    username:"Username",
                    password:"Password"
                },
            },
        },
    });

export default i18n;