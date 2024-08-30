import type { AppTopbarRef } from "@/types";
import { forwardRef, useContext, useImperativeHandle, useRef, useEffect } from "react";
import AppBreadcrumb from "./AppBreadCrumb";
import { LayoutContext } from "./context/layoutcontext";
import { Dropdown } from 'primereact/dropdown';
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../app/i18n/config";

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { onMenuToggle, showProfileSidebar, showConfigSidebar } =
        useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const [selectedLocale, setSelectedLocale] = useState("en");
    const { i18n } = useTranslation();

    const translateOptions = [
        { language: "English", locale: "en" },
        { language: "Chiense", locale: "ch" }
    ];

    const onConfigButtonClick = () => {
        showConfigSidebar();
    };

    useEffect(() => {
        const locale = localStorage.getItem('locale');
        if (locale) {
            i18n.changeLanguage(locale);
            setSelectedLocale(locale);
        }
    }, []);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
    }));

    return (
        <div className="layout-topbar">
            <div className="topbar-start">
                <button
                    ref={menubuttonRef}
                    type="button"
                    className="topbar-menubutton p-link p-trigger"
                    onClick={onMenuToggle}
                >
                    <i className="pi pi-bars"></i>
                </button>

                <AppBreadcrumb className="topbar-breadcrumb"></AppBreadcrumb>
            </div>

            <div className="topbar-end">
                <ul className="topbar-menu">
                    <li>
                        <Dropdown
                            value={selectedLocale}
                            options={translateOptions}
                            onChange={(e) => { setSelectedLocale(e.value); i18n.changeLanguage(e.value); localStorage.setItem("locale", e.value) }}
                            optionLabel="language"
                            optionValue="locale"
                            className="p-ml-3"
                        />
                    </li>
                    <li className="topbar-profile">
                        <button
                            type="button"
                            className="p-link"
                            onClick={showProfileSidebar}
                        >
                            <img
                                src="/layout/images/avatar/avatar.png"
                                alt="Profile"
                            />
                        </button>
                    </li>
                </ul>
            </div>
        </div >
    );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;
