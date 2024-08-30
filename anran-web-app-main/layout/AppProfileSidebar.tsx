import { Badge } from "primereact/badge";
import { Sidebar } from "primereact/sidebar";
import { useContext } from "react";
import { LayoutContext } from "./context/layoutcontext";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import "../app/i18n/config";
 
const AppProfileSidebar = () => {
    const { layoutState, setLayoutState } = useContext(LayoutContext);
    const { t } = useTranslation();
    const router = useRouter();
    const [username, setUsername] = useState('');
    const onProfileSidebarHide = () => {
        setLayoutState((prevState) => ({
            ...prevState,
            profileSidebarVisible: false,
        }));
    };

    useEffect(() => {
       setUsername(''+localStorage.getItem('username'));
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('superadmin');
        localStorage.removeItem('roles');
        router.push("/");
    };


    return (
        <Sidebar
            visible={layoutState.profileSidebarVisible}
            onHide={onProfileSidebarHide}
            position="right"
            className="layout-profile-sidebar w-full sm:w-25rem"
        >
            <div className="flex flex-column mx-auto md:mx-0">
                <span className="mb-2 font-semibold">{t("welcome")}</span>
                <span className="text-color-secondary font-medium mb-5">
                    {username}
                </span>

                <Button
                    label={t("logout")}
                    className="w-full"
                    icon="pi pi-power-off"
                    onClick={logout}
                ></Button>
            </div>
        </Sidebar>
    );
};

export default AppProfileSidebar;
