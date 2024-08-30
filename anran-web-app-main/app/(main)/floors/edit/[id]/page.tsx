"use client";
import React, { useRef } from "react";
import { useFormik } from 'formik';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from '@/anran/service/api';
import { BlockUI } from 'primereact/blockui';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload, FileUploadUploadEvent } from 'primereact/fileupload';
import { Image } from 'primereact/image';
import { Roles } from "@/anran/service/roles";
import { InputSwitch } from "primereact/inputswitch";


function FloorsEdit({ params }: { params: { id: string } }) {
    const toast = useRef<Toast>(null);
    const router = useRouter();
    const [blocked, setBlocked] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const { id } = params;
    const fileRef = useRef<FileUpload>(null);

    useEffect(() => {
        const userRole = localStorage.getItem('roles');
        if (!(userRole && userRole.length > 0 && userRole.includes(Roles.admin_branch_update))) {
            router.push("/accessdenied");
        }
        API.get('branch').then(function (response: any) {
            const dt = response.data;
            setData(dt);
        }).catch(function (error) {
            console.log(error);
        });
        API.get('floors/' + id).then(function (response: any) {
            formik.setFieldValue('floor_no', response.data.floor_no, false);
            formik.setFieldValue('floor_details', response.data.floor_details, false);
            formik.setFieldValue('branch', response.data.branch, false);
            formik.setFieldValue('floor_plan', response.data.floor_plan, false);
            formik.setFieldValue('floor_url', response.data.floor_url, false);
            formik.setFieldValue('status_active', response.data.status_active, false);
            formik.setFieldValue('sortorder', response.data.sortorder, false);
        }).catch(function (error) {
            console.log(error);
        });
    }, []);

    const formik = useFormik({
        initialValues: {
            floor_no: null,
            floor_details: null,
            branch: null,
            floor_plan: null,
            floor_url: null,
            sortorder: 1,
            status_active: true,
        },
        validate: (data) => {
            let errors: any = {};
            if (!data.floor_no) {
                errors.floor_no = 'Floor No is required.';
            }
            if (!data.floor_plan) {
                errors.floor_plan = 'Floor image is required.';
            }
            if (!data.floor_details) {
                errors.floor_details = 'Floor Details is required.';
            }
            if (!data.branch) {
                errors.branch = 'Branch is required.';
            }
            if (!data.sortorder) {
                errors.sortorder = 'Sort Order is required.';
            }
            return errors;
        },
        onSubmit: (data: any) => {
            confirmDialog({
                message: 'Are you sure you want to save?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept() {
                    setBlocked(true);
                    API.put('floors/' + id, data).then(function (response) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'info', summary: 'Status', detail: 'Floor Updated Successfully!!!', life: 3000 });
                        }
                        formik.resetForm();
                        router.push("/floors/summary");
                    }).catch(function (error) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'error', summary: 'Status', detail: 'Floor Not able to create', life: 3000 });
                        }
                    });
                    setBlocked(false);
                },
            });
        }
    });

    const onUpload = (event: FileUploadUploadEvent) => {
        if (event.xhr.status === 200 && event.files) {
            formik.setFieldValue('floor_plan', event.files[0].name);
            formik.setFieldValue('floor_url', event.xhr.response);
        } else {
            if (toast && toast.current) {
                toast.current.show({ severity: 'error', summary: 'Status', detail: 'File not able to Upload.', life: 3000 });
            }
        }
    }

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
        <div className="card">
            <span className="text-900 text-xl font-bold mb-4 block">
                Update Floor
            </span>
            <ConfirmDialog />
            <Toast ref={toast} />
            <BlockUI blocked={blocked}>
                <form onSubmit={formik.handleSubmit} className="col-12 p-fluid formgrid grid">
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputText
                                id="floor_no"
                                name="floor_no"
                                value={formik.values.floor_no}
                                onChange={(e) => {
                                    formik.setFieldValue('floor_no', e.target.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldValid('floor_no') })}
                            />
                            <label htmlFor="floor_no">Floor No</label>
                        </span>
                        {getFormErrorMessage('floor_no')}
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <Dropdown
                                id="branch"
                                name="branch"
                                filter
                                value={formik.values.branch}
                                options={data} optionLabel="branch_name"
                                onChange={(e) => {
                                    formik.setFieldValue('branch', e.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldValid('branch') })}
                            />
                            <label htmlFor="branch">Branch</label>
                        </span>
                        {getFormErrorMessage('branch')}
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputText
                                id="floor_details"
                                name="floor_details"
                                value={formik.values.floor_details}
                                onChange={(e) => {
                                    formik.setFieldValue('floor_details', e.target.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldValid('floor_details') })}
                            />
                            <label htmlFor="floor_details">Floor Details</label>
                        </span>
                        {getFormErrorMessage('floor_details')}
                    </div>
                    <div className="field mb-4 col-12 md:col-6"></div>
                    <div className="field mb-4 col-12 md:col-3">
                        <Image src={formik.values.floor_url} alt={formik.values.floor_plan} width="50" preview height="50" />
                        {getFormErrorMessage('floor_plan')}
                    </div>
                    <div className="field mb-4 col-12 md:col-3">
                        <FileUpload url={process.env.NEXT_PUBLIC_API_FILEUPLOAD} id="floor_url" onUpload={onUpload} ref={fileRef} mode="basic" name="file" accept="image/*" />
                    </div>
                    <div className="field mb-4 col-12 md:col-6"></div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputText
                                id="sortorder"
                                name="sortorder"
                                value={formik.values.sortorder}
                                onChange={(e) => {
                                    formik.setFieldValue('sortorder', e.target.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldValid('sortorder') })}
                            />
                            <label htmlFor="sortorder">Sort Order</label>
                        </span>
                        {getFormErrorMessage('sortorder')}
                    </div>
                    <div className="field mb-4 col-12 md:col-6"></div>
                    <div className="field mb-4 col-12 md:col-2">  <label htmlFor="status_active">Active/InActive</label></div>
                    <div className="field mb-4 col-12 md:col-4">
                        <InputSwitch
                            id="status_active"
                            name="status_active"
                            checked={formik.values.status_active}
                            value={formik.values.status_active}
                            onChange={(e) => {
                                formik.setFieldValue('status_active', e.value);
                            }}
                            className={classNames({ 'p-invalid': isFormFieldValid('status_active') })}
                        />
                        {getFormErrorMessage('status_active')}
                    </div>
                    <div className="field mb-4 col-12 md:col-6"></div>
                    <div className="field mb-4 col-12 md:col-3">
                        <Button type="submit" label="Update" />
                    </div>
                    <div className="field mb-4 col-3">
                        <Button type="button"
                            label="Back"
                            className="p-button-secondary"
                            onClick={() => router.push("/floors/summary")} ></Button>
                    </div>
                </form>
            </BlockUI>
        </div>
    );
}
export default FloorsEdit;
