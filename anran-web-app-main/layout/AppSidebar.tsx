import Link from "next/link";
import { useContext } from "react";
import AppMenu from "./AppMenu";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import { LayoutState } from "../types/layout";
import { Image } from 'primereact/image';
import { useTranslation } from "react-i18next";
import "../app/i18n/config";

const AppSidebar = () => {
    const { setLayoutState } = useContext(LayoutContext);
    const { t } = useTranslation();
    const anchor = () => {
        setLayoutState((prevLayoutState: LayoutState) => ({
            ...prevLayoutState,
            anchored: !prevLayoutState.anchored,
        }));
    };
    return (
        <>
            <div className="sidebar-header">
                <Link href="/dashboard" className="app-logo">
                    <Image width="124" className="app-logo-normal"
                        height="124" src={`/logo/logo.png`} />
                    <Image width="70" className="app-logo-small"
                        height="70" src={`/logo/logo.png`} />
                </Link>
                <button
                    className="layout-sidebar-anchor p-link z-2 mb-2"
                    type="button"
                    onClick={anchor}
                ></button>
            </div>

            <div className="layout-menu-container">
                <MenuProvider>
                    <AppMenu />
                </MenuProvider>
            </div>
        </>
    );
};

export default AppSidebar;
