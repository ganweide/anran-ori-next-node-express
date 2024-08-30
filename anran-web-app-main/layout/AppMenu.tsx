import type { MenuModel } from "@/types";
import AppSubMenu from "./AppSubMenu";
import { useTranslation } from "react-i18next";
import "../app/i18n/config";
import { useEffect, useState } from "react";
import { Roles } from "@/anran/service/roles";

const AppMenu = () => {
    const { t } = useTranslation();
    const [model, setModel] = useState<MenuModel[]>([]);

    useEffect(() => {
        const role = localStorage.getItem('roles');
        if (role && role.length > 0) {
            const adminitemsmenus = [];
            const useritemsmenus = [];
            const menus = [];
            if (role.includes(Roles.admin_role_view)) {
                adminitemsmenus.push({
                    label: t('menu_role'),
                    icon: "pi pi-fw pi-cog",
                    to: "/role/summary",
                });
            }
            if (role.includes(Roles.admin_banner_view)) {
                adminitemsmenus.push({
                    label: t('menu_banner'),
                    icon: "pi pi-fw pi-cog",
                    to: "/banner/summary",
                });
            }
            if (role.includes(Roles.admin_message_view)) {
                adminitemsmenus.push({
                    label: t('menu_messages'),
                    icon: "pi pi-fw pi-cog",
                    to: "/messages/summary",
                });
            }
            if (role.includes(Roles.admin_staff_view)) {
                adminitemsmenus.push({
                    label: t('menu_staff'),
                    icon: "pi pi-fw pi-users",
                    to: "/staff/summary",
                });
            }
            if (role.includes(Roles.admin_branch_view)) {
                adminitemsmenus.push({
                    label: t('menu_branch'),
                    icon: "pi pi-fw pi-list",
                    to: "/branch/summary",
                });
            }
            if (role.includes(Roles.admin_branch_view)) {
                adminitemsmenus.push({
                    label: t('menu_floor'),
                    icon: "pi pi-fw pi-list",
                    to: "/floors/summary",
                });
            }
            if (role.includes(Roles.admin_room_view)) {
                adminitemsmenus.push({
                    label: t('menu_room'),
                    icon: "pi pi-fw pi-list",
                    to: "/rooms/summary",
                });
            }
            if (role.includes(Roles.admin_package_view)) {
                adminitemsmenus.push({
                    label: t('menu_package'),
                    icon: "pi pi-fw pi-list",
                    to: "/packages/summary",
                });
            }
            if (role.includes(Roles.member_member_view)) {
                useritemsmenus.push({
                    label: t('menu_members_info'),
                    icon: "pi pi-fw pi-key",
                    to: "/members/info",
                });
            }

            if (role.includes(Roles.member_checkinqr_view)) {
                useritemsmenus.push({
                    label: t('menu_purchase_details'),
                    icon: "pi pi-fw pi-key",
                    to: "/paymentlist",
                });
            }
            if (role.includes(Roles.finance_purchase_view)) {
                useritemsmenus.push({
                    label: t('menu_transfercredit'),
                    icon: "pi pi-fw pi-key",
                    to: "/members/transfercredits",
                });
            }
            if (role.includes(Roles.member_booking_view)) {
                useritemsmenus.push({
                    label: t('menu_booking'),
                    icon: "pi pi-fw pi-calendar",
                    to: "/booking",
                });
            }
            if (role.includes(Roles.member_checkin_view)) {
                useritemsmenus.push({
                    label: t('menu_booking_checkin'),
                    icon: "pi pi-fw pi-key",
                    to: "/members/membercheckin",
                });
            }
          
            if (role.includes(Roles.finance_checkin_view)) {
                useritemsmenus.push({
                    label: t('menu_attendance'),
                    icon: "pi pi-fw pi-users",
                    to: "/attendance/summary",
                });
            }
            if (role.includes(Roles.finance_checkin_view)) {
                useritemsmenus.push({
                    label: t('menu_finance'),
                    icon: "pi pi-fw pi-chart-bar",
                    items: [
                        {
                            label: 'usage_report',
                            icon: "pi pi-fw pi-calendar",
                            to: "/usagereport"
                        },
                        {
                            label: 'package_report',
                            icon: "pi pi-fw pi-box",
                            to: "/packagereport"
                        }
                    ]
                });
            }
            if (adminitemsmenus && adminitemsmenus.length > 0) {
                menus.push({
                    label: t('menu_admin'),
                    icon: "pi pi-cog",
                    items: adminitemsmenus
                })
            }
            if (useritemsmenus && useritemsmenus.length > 0) {
                menus.push({
                    label: t('menu_users'),
                    icon: "pi pi-cog",
                    items: useritemsmenus
                })
            }
            setModel(menus);
        }
    }, []);

    return <AppSubMenu model={model} />;
};

export default AppMenu;
