"use client";
import type { Page } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { useContext, useState, useEffect } from "react";
import { LayoutContext } from "../../layout/context/layoutcontext";
import React, { useRef } from "react";
import { useFormik } from 'formik';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import { BlockUI } from 'primereact/blockui';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { useTranslation } from "react-i18next";
import "../i18n/config";

const Login: Page = () => {
    const { layoutConfig, setLayoutState } = useContext(LayoutContext);
    const dark = layoutConfig.colorScheme !== "light";
    const toast = useRef<Toast>(null);
    const router = useRouter();
    const [blocked, setBlocked] = useState(false);
    const { t } = useTranslation();

    const onProfileSidebarHide = () => {
        setLayoutState((prevState) => ({
            ...prevState,
            profileSidebarVisible: false,
        }));
    };

    useEffect(() => {

    }, []);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validate: (data) => {
            let errors: any = {};
            if (!data.username) {
                errors.username = 'Username Name is required.';
            }
            if (!data.password) {
                errors.password = 'Password is required.';
            }
            return errors;
        },
        onSubmit: (data: any) => {
            setBlocked(true);
            if (data && data.username && data.password) {
                axios.post(process.env.NEXT_PUBLIC_API_LOGIN_URL + '', data).then(function (response) {
                    if (response && response.data && response.data.status) {
                        localStorage.setItem('token', response.data.token);
                        localStorage.setItem('username', response.data.username);
                        localStorage.setItem('roles', response.data.roles);
                        formik.resetForm();
                        onProfileSidebarHide();
                        router.push("/dashboard");
                    } else {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'error', summary: 'Status', detail: 'Username or Password Invalid!!!', life: 3000 });
                        }
                    }
                }).catch(function (error) {
                    if (toast && toast.current) {
                        toast.current.show({ severity: 'error', summary: 'Status', detail: 'Username or Password Invalid!!!', life: 3000 });
                    }
                });
            } else {
                if (toast && toast.current) {
                    toast.current.show({ severity: 'error', summary: 'Status', detail: 'Username or Password Invalid!!!', life: 3000 });
                }
            }
            setBlocked(false);
        }
    });

    const isFormFieldValid = (name: string) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name: string) => {
        if (isFormFieldValid(name) && formik.errors) {
            let err: any = formik.errors;
            return <small className="p-error">{err[name]}</small>;
        } else {
            return "";
        }
    };


    return (
        <>
            <div className="px-8 min-h-screen flex justify-content-center align-items-center">
                <div className="border-1 surface-border surface-card border-round py-7 px-4 md:px-7 z-1">
                    <div className="mb-4">
                        <ConfirmDialog />
                        <Toast ref={toast} />
                        <div style={{ textAlign: 'center' }} className="text-900 text-xl font-bold mb-2">
                            {t("login_text")}
                        </div>
                    </div>
                    <BlockUI blocked={blocked} >
                        <form onSubmit={formik.handleSubmit} className="col-12 p-fluid formgrid grid">
                            <div className="field col-12 md:col-12">
                                <span className="p-float-label">
                                    <InputText
                                        id="username"
                                        name="username"
                                        value={formik.values.username}
                                        onChange={(e) => {
                                            formik.setFieldValue('username', e.target.value);
                                        }}
                                        className={classNames({ 'p-invalid': isFormFieldValid('username') })}
                                    />
                                    <label htmlFor="username">{t("username")}</label>
                                </span>
                                {getFormErrorMessage('username')}
                            </div>
                            <div className="field col-12 md:col-12">
                                <span className="p-float-label">
                                    <InputText
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formik.values.password}
                                        onChange={(e) => {
                                            formik.setFieldValue('password', e.target.value);
                                        }}
                                        className={classNames({ 'p-invalid': isFormFieldValid('password') })}
                                    />
                                    <label htmlFor="password">{t("password")}</label>
                                </span>
                                {getFormErrorMessage('password')}
                            </div>
                            <div className="field col-12 md:col-12">
                                <Button type="submit" label={t("login")} />
                            </div>
                        </form>
                    </BlockUI>
                </div>
            </div>
        </>
    );
};

export default Login;
