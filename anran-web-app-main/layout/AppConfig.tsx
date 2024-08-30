"use client";
import type { AppConfigProps, ColorScheme } from "@/types";
import { PrimeReactContext } from "primereact/api";
import { Button } from "primereact/button";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { Sidebar } from "primereact/sidebar";
import { classNames } from "primereact/utils";
import { useContext, useEffect } from "react";
import { LayoutContext } from "./context/layoutcontext";

const AppConfig = (props: AppConfigProps) => {
    const {
        layoutConfig,
        setLayoutConfig,
        layoutState,
        setLayoutState,
        isSlim,
        isSlimPlus,
        isHorizontal,
    } = useContext(LayoutContext);
    const { changeTheme } = useContext(PrimeReactContext);
    const scales = [12, 13, 14, 15, 16];
    const componentThemes = [
        { name: "indigo", color: "#005446" },
        { name: "blue", color: "#3B82F6" },
        { name: "purple", color: "#8B5CF6" },
        { name: "teal", color: "#14B8A6" },
        { name: "cyan", color: "#06b6d4" },
        { name: "green", color: "#10b981" },
        { name: "orange", color: "#f59e0b" },
        { name: "pink", color: "#d946ef" },
    ];

    useEffect(() => {
        if (isSlim() || isSlimPlus() || isHorizontal()) {
            setLayoutState((prevState) => ({ ...prevState, resetMenu: true }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layoutConfig.menuMode]);

    const onConfigButtonClick = () => {
        setLayoutState((prevState) => ({
            ...prevState,
            configSidebarVisible: true,
        }));
    };

    const onConfigSidebarHide = () => {
        setLayoutState((prevState) => ({
            ...prevState,
            configSidebarVisible: false,
        }));
    };

    const changeInputStyle = (e: RadioButtonChangeEvent) => {
        setLayoutConfig((prevState) => ({ ...prevState, inputStyle: e.value }));
    };

    const changeRipple = (e: InputSwitchChangeEvent) => {
        setLayoutConfig((prevState) => ({
            ...prevState,
            ripple: e.value as boolean,
        }));
    };

    const changeMenuMode = (e: RadioButtonChangeEvent) => {
        setLayoutConfig((prevState) => ({ ...prevState, menuMode: e.value }));
    };

    const changeMenuTheme = (e: RadioButtonChangeEvent) => {
        setLayoutConfig((prevState) => ({ ...prevState, menuTheme: e.value }));
    };

    const changeColorScheme = (colorScheme: ColorScheme) => {
        changeTheme?.(
            layoutConfig.colorScheme,
            colorScheme,
            "theme-link",
            () => {
                setLayoutConfig((prevState) => ({ ...prevState, colorScheme }));
            }
        );
    };

    const _changeTheme = (theme: string) => {
        changeTheme?.(layoutConfig.theme, theme, "theme-link", () => {
            setLayoutConfig((prevState) => ({ ...prevState, theme }));
        });
    };

    const decrementScale = () => {
        setLayoutConfig((prevState) => ({
            ...prevState,
            scale: prevState.scale - 1,
        }));
    };

    const incrementScale = () => {
        setLayoutConfig((prevState) => ({
            ...prevState,
            scale: prevState.scale + 1,
        }));
    };

    const applyScale = () => {
        document.documentElement.style.fontSize = layoutConfig.scale + "px";
    };

    useEffect(() => {
        applyScale();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layoutConfig.scale]);

    return (
        <>

        </>
    );
};

export default AppConfig;
