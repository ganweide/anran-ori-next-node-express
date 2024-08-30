"use client";
import React, { useRef } from "react";
import { useFormik } from 'formik';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import API from '@/anran/service/api';
import { BlockUI } from 'primereact/blockui';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload, FileUploadUploadEvent } from 'primereact/fileupload';
import { Image } from 'primereact/image';
import { Roles } from "@/anran/service/roles";
import { InputSwitch } from 'primereact/inputswitch';
import { InputNumber } from "primereact/inputnumber";
import { dateAsString } from '@/anran/service/dateutils';

function BranchCreate() {
    const toast = useRef<Toast>(null);
    const router = useRouter();
    const [blocked, setBlocked] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const fileRef = useRef<FileUpload>(null);

    useEffect(() => {
        const userRole = localStorage.getItem('roles');
        if (!(userRole && userRole.length > 0 && userRole.includes(Roles.admin_branch_create))) {
            router.push("/accessdenied");
        }
        API.get('staff').then(function (response: any) {
            setData(response.data);
        }).catch(function (error) {
            console.log(error);
        });
    }, []);

    const formik = useFormik({
        initialValues: {
            company_name: '',
            branch_name: '',
            branch_code: '',
            whatsappno: '',
            operating_from_hours: null,
            operating_to_hours: null,
            address: '',
            google_link: '',
            waze_link: '',
            staff: null,
            image_url: '',
            image_data: null,
            sortorder: 1,
            status_active: true,
            paymentkey: '',
            apikey:'',
            hqbanch: false,
            sst: false,
            sst_percent: 0,
        },
        validate: (data) => {
            let errors: any = {};
            if (!data.company_name) {
                errors.company_name = 'Area Name is required.';
            }
            if (!data.sortorder) {
                errors.sortorder = 'Sort Order is required.';
            }
            if (!data.branch_name) {
                errors.branch_name = 'Branch Name is required.';
            }
            if (!data.branch_code) {
                errors.branch_code = 'Branch Code is required.';
            }
            if (!data.whatsappno) {
                errors.whatsappno = 'Whatsapp No is required.';
            }
            if (!data.address) {
                errors.address = 'Address is required.';
            }
            if (!data.google_link) {
                errors.google_link = 'Google Link is required.';
            }
            if (!data.waze_link) {
                errors.waze_link = 'Waze Link is required.';
            }
            if (data.sst === true && !data.sst_percent) {
                errors.sst_percent = 'SST % is required.';
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
                    data.operating_from_hours = dateAsString(data.operating_from_hours);
                    data.operating_to_hours = dateAsString(data.operating_to_hours);
                    API.post('branch', data).then(function (response) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'info', summary: 'Status', detail: 'Branch Created Successfully!!!', life: 3000 });
                        }
                        formik.resetForm();
                        router.push("/branch/summary");
                    }).catch(function (error) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'error', summary: 'Status', detail: 'Branch Not able to create', life: 3000 });
                        }
                    });
                    setBlocked(false);
                },
            });
        }
    });

    const onUpload = (event: FileUploadUploadEvent) => {
        if (event.xhr.status === 200 && event.files) {
            formik.setFieldValue('image_data', event.files[0].name);
            formik.setFieldValue('image_url', event.xhr.response);
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
                Create Branch
            </span>
            <ConfirmDialog />
            <Toast ref={toast} />
            <BlockUI blocked={blocked}>
                <form onSubmit={formik.handleSubmit}>
                    <div className="surface-0 p-4 shadow-2 border-round col-12 p-fluid formgrid grid">
                        <div className="field mb-4 col-12 md:col-12 text-xl font-medium text-600 mb-3">Branch Info</div>
                        <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <InputText
                                    id="branch_code"
                                    name="branch_code"
                                    value={formik.values.branch_code}
                                    onChange={(e) => {
                                        formik.setFieldValue('branch_code', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldValid('branch_code') })}
                                />
                                <label htmlFor="branch_code">Branch Code</label>
                            </span>
                            {getFormErrorMessage('branch_code')}
                        </div>
                        <div className="field mb-4 col-12 md:col-6"></div>
                        <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <InputText
                                    id="company_name"
                                    name="company_name"
                                    value={formik.values.company_name}
                                    onChange={(e) => {
                                        formik.setFieldValue('company_name', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldValid('company_name') })}
                                />
                                <label htmlFor="company_name">Area Name</label>
                            </span>
                            {getFormErrorMessage('company_name')}
                        </div>
                        <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <InputText
                                    id="branch_name"
                                    name="branch_name"
                                    value={formik.values.branch_name}
                                    onChange={(e) => {
                                        formik.setFieldValue('branch_name', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldValid('branch_name') })}
                                />
                                <label htmlFor="branch_name">Branch Name</label>
                            </span>
                            {getFormErrorMessage('branch_name')}
                        </div>
                        <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <InputTextarea
                                    id="address"
                                    name="address"
                                    value={formik.values.address}
                                    onChange={(e) => {
                                        formik.setFieldValue('address', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldValid('address') })}
                                />
                                <label htmlFor="address">Address</label>
                            </span>
                            {getFormErrorMessage('address')}
                        </div>
                        <div className="field mb-4 col-12 md:col-6"></div>
                        <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <InputText
                                    id="google_link"
                                    name="google_link"
                                    value={formik.values.google_link}
                                    onChange={(e) => {
                                        formik.setFieldValue('google_link', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldValid('google_link') })}
                                />
                                <label htmlFor="google_link">Google Link</label>
                            </span>
                            {getFormErrorMessage('google_link')}
                        </div>
                        <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <InputText
                                    id="waze_link"
                                    name="waze_link"
                                    value={formik.values.waze_link}
                                    onChange={(e) => {
                                        formik.setFieldValue('waze_link', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldValid('waze_link') })}
                                />
                                <label htmlFor="waze_link">Waze Link</label>
                            </span>
                            {getFormErrorMessage('waze_link')}
                        </div>
                    </div>
                    <div className="surface-0 p-4 shadow-2 border-round col-12 p-fluid formgrid grid">
                        <div className="field mb-4 col-12 md:col-12 text-xl font-medium text-600 mb-3">Operating Hours</div>
                        <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <Calendar
                                    showIcon
                                    timeOnly hourFormat="12"
                                    id="operating_from_hours"
                                    name="operating_from_hours"
                                    value={formik.values.operating_from_hours}
                                    onChange={(e) => {
                                        formik.setFieldValue('operating_from_hours', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldValid('operating_from_hours') })}
                                />
                                <label htmlFor="operating_from_hours">Operating Hours From</label>
                            </span>
                            {getFormErrorMessage('operating_from_hours')}
                        </div>
                        <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <Calendar
                                    showIcon
                                    timeOnly hourFormat="12"
                                    id="operating_to_hours"
                                    name="operating_to_hours"
                                    value={formik.values.operating_to_hours}
                                    onChange={(e) => {
                                        formik.setFieldValue('operating_to_hours', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldValid('operating_to_hours') })}
                                />
                                <label htmlFor="operating_to_hours">Operating Hours To</label>
                            </span>
                            {getFormErrorMessage('operating_to_hours')}
                        </div>
                    </div>

                    <div className="surface-0 p-4 shadow-2 border-round col-12 p-fluid formgrid grid">
                        <div className="field mb-4 col-12 md:col-12 text-xl font-medium text-600 mb-3">Contact Person</div>
                        <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <InputText
                                    id="whatsappno"
                                    name="whatsappno"
                                    value={formik.values.whatsappno}
                                    onChange={(e) => {
                                        formik.setFieldValue('whatsappno', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldValid('whatsappno') })}
                                />
                                <label htmlFor="whatsappno">Whatsapp No</label>
                            </span>
                            {getFormErrorMessage('whatsappno')}
                        </div>
                        <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <Dropdown
                                    id="staff"
                                    name="staff"
                                    filter
                                    value={formik.values.staff}
                                    options={data} optionLabel="name"
                                    onChange={(e) => {
                                        formik.setFieldValue('staff', e.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldValid('staff') })}
                                />
                                <label htmlFor="staff">Contact</label>
                            </span>
                            {getFormErrorMessage('staff')}
                        </div>
                    </div>
                    <div className="surface-0 p-4 shadow-2 border-round col-12 p-fluid formgrid grid">
                        <div className="field mb-4 col-12 md:col-12 text-xl font-medium text-600 mb-3">Financial Info</div>
                        <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <InputText
                                    id="paymentkey"
                                    name="paymentkey"
                                    value={formik.values.paymentkey}
                                    onChange={(e) => {
                                        formik.setFieldValue('paymentkey', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldValid('paymentkey') })}
                                />
                                <label htmlFor="paymentkey">Secret Key(Payment)</label>
                            </span>
                            {getFormErrorMessage('paymentkey')}
                        </div>
                        <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <InputText
                                    id="apikey"
                                    name="apikey"
                                    value={formik.values.apikey}
                                    onChange={(e) => {
                                        formik.setFieldValue('apikey', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldValid('apikey') })}
                                />
                                <label htmlFor="apikey">API Key(Payment)</label>
                            </span>
                            {getFormErrorMessage('apikey')}
                        </div>
                        <div className="field mb-4 col-12 md:col-2">  <label htmlFor="sst">SST(Service , Sales Tax)</label></div>
                        <div className="field mb-4 col-12 md:col-4">
                            <InputSwitch
                                id="sst"
                                name="sst"
                                checked={formik.values.sst}
                                value={formik.values.sst}
                                onChange={(e) => {
                                    formik.setFieldValue('sst', e.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldValid('sst') })}
                            />
                            {getFormErrorMessage('sst')}
                        </div>
                        {formik.values.sst ? <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <InputNumber
                                    id="sst_percent"
                                    name="sst_percent"
                                    value={formik.values.sst_percent}
                                    onValueChange={(e) => {
                                        formik.setFieldValue('sst_percent', e.target.value);
                                    }}
                                    useGrouping={false}
                                    min={0}
                                    max={100}
                                    className={classNames({ 'p-invalid': isFormFieldValid('sst_percent') })}
                                />
                                <label htmlFor="sst_percent">SST %</label>
                            </span>
                            {getFormErrorMessage('sst_percent')}
                        </div> : <div className="field mb-4 col-12 md:col-6"></div>}
                    </div>

                    <div className="surface-0 p-4 shadow-2 border-round col-12 p-fluid formgrid grid">
                        <div className="field mb-4 col-12 md:col-12 text-xl font-medium text-600 mb-3">Branch Image</div>
                        <div className="field mb-4 col-12 md:col-3">
                            <FileUpload url={process.env.NEXT_PUBLIC_API_FILEUPLOAD} id="image_url" onUpload={onUpload} ref={fileRef} mode="basic" name="file" accept="image/*" />
                        </div>
                        <div className="field mb-4 col-12 md:col-3">
                            <Image src={formik.values.image_url} alt={formik.values.image_data_url} width="50" preview height="50" />
                        </div>
                    </div>
                    <div className="surface-0 p-4 shadow-2 border-round col-12 p-fluid formgrid grid">
                        <div className="field mb-4 col-12 md:col-12 text-xl font-medium text-600 mb-3">Others</div>
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
                        <div className="field mb-4 col-12 md:col-2">  <label htmlFor="hqbanch">HQ</label></div>
                        <div className="field mb-4 col-12 md:col-4">
                            <InputSwitch
                                id="hqbanch"
                                name="hqbanch"
                                checked={formik.values.hqbanch}
                                value={formik.values.hqbanch}
                                onChange={(e) => {
                                    formik.setFieldValue('hqbanch', e.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldValid('hqbanch') })}
                            />
                            {getFormErrorMessage('hqbanch')}
                        </div>
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
                    </div>
                    <div className="surface-0 p-4 shadow-2 border-round col-12 p-fluid formgrid grid">
                        <div className="field mb-4 col-12 md:col-3">
                            <Button type="submit" label="Save" />
                        </div>
                        <div className="field mb-4 col-3">
                            <Button type="button"
                                label="Back"
                                className="p-button-secondary"
                                onClick={() => router.push("/branch/summary")} ></Button>
                        </div>
                    </div>
                </form>
            </BlockUI>
        </div>
    );
}
export default BranchCreate;
