"use client";
import React, { useRef } from "react";
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from '@/anran/service/api';
import { BlockUI } from 'primereact/blockui';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { FileUpload, FileUploadUploadEvent } from 'primereact/fileupload';
import { Calendar } from 'primereact/calendar';
import { Image } from 'primereact/image';
import { Editor } from 'primereact/editor';
import { Dropdown } from "primereact/dropdown";
import { Roles } from "@/anran/service/roles";
import { InputSwitch } from 'primereact/inputswitch';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from "primereact/inputtext";
import { dateAsString } from '@/anran/service/dateutils';

function MessagesCreate() {
    const toast = useRef<Toast>(null);
    const router = useRouter();
    const [blocked, setBlocked] = useState(false);
    const fileRef = useRef<FileUpload>(null);
    const msgtype = ['WELCOME', 'GREETING', 'WISHES', 'BOOKING'];
    useEffect(() => {
        const userRole = localStorage.getItem('roles');
        if (!(userRole && userRole.length > 0 && userRole.includes(Roles.admin_message_create))) {
            router.push("/accessdenied");
        }
    }, []);

    const onUpload = (event: FileUploadUploadEvent) => {
        if (event.xhr.status === 200 && event.files) {
            formik.setFieldValue('image_data_url', event.files[0].name);
            formik.setFieldValue('image_url', event.xhr.response);
        } else {
            if (toast && toast.current) {
                toast.current.show({ severity: 'error', summary: 'Status', detail: 'File not able to Upload.', life: 3000 });
            }
        }
    }

    const formik = useFormik({
        initialValues: {
            msg: '',
            image_url: null,
            image_data_url: null,
            startdate: null,
            enddate: null,
            msg_type: 'WELCOME',
            status_active: true,
            allways: false,
            sortorder: 0,
        },
        validate: (data) => {
            let errors: any = {};
            if (!data.msg) {
                errors.msg = 'Message is required.';
            }
            if (!data.msg_type) {
                errors.msg_type = 'Message Type is required.';
            }
            if (!data.sortorder) {
                errors.sortorder = 'Sort Order is required.';
            }
            if (data.allways === false) {
                if (!data.startdate) {
                    errors.startdate = 'Start Date is required.';
                }
                if (!data.enddate) {
                    errors.enddate = 'End Date is required.';
                }
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
                    data.startdate = dateAsString(data.startdate);
                    data.enddate = dateAsString(data.enddate);
                    API.post('messages', data).then(function (response) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'info', summary: 'Status', detail: 'Messages Saved Successfully!!!', life: 3000 });
                        }
                        formik.resetForm();
                        router.push("/messages/summary");
                    }).catch(function (error) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'error', summary: 'Status', detail: 'Messages Not able to create', life: 3000 });
                        }
                    });
                    setBlocked(false);
                },
            });
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
        <div className="card">
            <span className="text-900 text-xl font-bold mb-4 block">
                Messages
            </span>
            <ConfirmDialog />
            <Toast ref={toast} />
            <BlockUI blocked={blocked}>
                <form onSubmit={formik.handleSubmit} className="col-12 p-fluid formgrid grid">
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <Dropdown
                                inputId="msg_type"
                                name="msg_type"
                                value={formik.values.msg_type}
                                options={msgtype}
                                placeholder="Select a Type"
                                onChange={(e) => {
                                    formik.setFieldValue('msg_type', e.value);
                                }}
                            />
                            <label htmlFor="msg_type">Type</label>
                        </span>
                        {getFormErrorMessage('msg_type')}
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        Note:<br />
                        WELCOME:  &lt;MemberName&gt; append member name <br />
                        BOOKING:  &lt;MemberName&gt; append member name<br />
                        &lt;BookingDate&gt; append booking date<br />
                        &lt;BookingTime&gt; append booking time
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <Editor style={{ height: '350px' }}
                            id="msg"
                            name="msg"
                            onTextChange={(e) => {
                                formik.setFieldValue('msg', e.htmlValue);
                            }}
                            value={formik.values.msg}
                            className={classNames({ 'p-invalid': isFormFieldValid('msg') })}
                        />
                        {getFormErrorMessage('msg')}
                    </div>
                    <div className="field mb-4 col-12 md:col-6"></div>
                    <div className="field mb-4 col-12 md:col-3">
                        <Image src={formik.values.image_url} alt={formik.values.image_data_url} width="50" preview height="50" />
                    </div>
                    <div className="field mb-4 col-12 md:col-3">
                        <FileUpload maxFileSize={500000} url={process.env.NEXT_PUBLIC_API_FILEUPLOAD} id="image_url" onUpload={onUpload} ref={fileRef} mode="basic" name="file" accept="image/*" />
                    </div>

                    <div className="fiel d mb-4 col-12 md:col-6"></div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span>
                            <Checkbox inputId="allways" name="allways" onChange={e => formik.setFieldValue('allways', e.checked)} checked={formik.values.allways} />
                            <label htmlFor="allways">Always</label>
                        </span>
                        {getFormErrorMessage('allways')}
                    </div>
                    <div className="field mb-4 col-12 md:col-6"></div>
                    {!formik.values.allways ?


                        <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <Calendar
                                    showIcon
                                    id="startdate"
                                    name="startdate"
                                    value={formik.values.startdate}
                                    dateFormat="dd/mm/yy"
                                    onChange={(e) => {
                                        formik.setFieldValue('startdate', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldValid('startdate') })}
                                />
                                <label htmlFor="startdate">Display From</label>
                            </span>
                            {getFormErrorMessage('startdate')}
                        </div> : ''}
                    {!formik.values.allways ?
                        <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <Calendar
                                    showIcon
                                    id="enddate"
                                    name="enddate"
                                    value={formik.values.enddate}
                                    dateFormat="dd/mm/yy"
                                    onChange={(e) => {
                                        formik.setFieldValue('enddate', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldValid('enddate') })}
                                />
                                <label htmlFor="enddate">Display Until</label>
                            </span>
                            {getFormErrorMessage('enddate')}
                        </div> : ''}
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
                    <div className="field mb-4 col-12 md:col-6">
                        <label htmlFor="status_active">Active/InActive</label>
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
                    <div className="field mb-4 col-3">
                        <Button type="submit" label="Create" />
                    </div>
                    <div className="field mb-4 col-3">
                        <Button type="button"
                            label="Back"
                            className="p-button-secondary"
                            onClick={() => router.push("/messages/summary")} ></Button>
                    </div>
                </form>
            </BlockUI>
        </div>
    );
}
export default MessagesCreate;
