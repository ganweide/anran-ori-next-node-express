import { ReactNode } from "react";
import type {
    AppMailProps,
    AppMailReplyProps,
    AppMailSidebarItem,
    ChartDataState,
    ChartOptionsState,
    CustomEvent,
    Demo,
    LayoutType,
    MailKeys,
    SortOrderType,
} from "./demo";
import { Branch } from "./branch"
import {
    AppBreadcrumbProps,
    AppConfigProps,
    AppMenuItemProps,
    AppTopbarRef,
    Breadcrumb,
    BreadcrumbItem,
    ChatContextProps,
    ColorScheme,
    LayoutConfig,
    LayoutContextProps,
    LayoutState,
    MailContextProps,
    MenuContextProps,
    MenuModel,
    MenuProps,
    NodeRef,
    Page,
    TaskContextProps,
    UseSubmenuOverlayPositionProps,
} from "./layout";

type ChildContainerProps = {
    children: ReactNode;
};

export type {
    Page,
    AppBreadcrumbProps,
    Breadcrumb,
    BreadcrumbItem,
    ColorScheme,
    MenuProps,
    MenuModel,
    MailKeys,
    LayoutConfig,
    LayoutState,
    Breadcrumb,
    LayoutContextProps,
    MailContextProps,
    MenuContextProps,
    ChatContextProps,
    TaskContextProps,
    AppConfigProps,
    NodeRef,
    AppTopbarRef,
    AppMenuItemProps,
    UseSubmenuOverlayPositionProps,
    ChildContainerProps,
    Demo,
    LayoutType,
    SortOrderType,
    CustomEvent,
    ChartDataState,
    ChartOptionsState,
    AppMailSidebarItem,
    AppMailReplyProps,
    AppMailProps,
    Branch
};
