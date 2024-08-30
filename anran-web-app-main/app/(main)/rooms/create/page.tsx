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

function RoomsCreate() {
    const toast = useRef<Toast>(null);
    const router = useRouter();
    const [blocked, setBlocked] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [floors, setFloors] = useState<any[]>([]);
    const fileRef = useRef<FileUpload>(null);
    const gender = ['Male', 'Female', 'Both'];
    useEffect(() => {
        const userRole = localStorage.getItem('roles');
        if (!(userRole && userRole.length > 0 && userRole.includes(Roles.admin_room_create))) {
            router.push("/accessdenied");
        }
        API.get('branch').then(function (response: any) {
            if (response.data)
                setData(response.data);
        }).catch(function (error) {
            console.log(error);
        });
    }, []);

    const getFloorsBranch = (id: any) => {
        API.get('floors/branchfloor/' + id).then(function (response: any) {
            if (response.data)
                setFloors(response.data);
        }).catch(function (error) {
            console.log(error);
        });

    }

    const formik = useFormik({
        initialValues: {
            noof_persons: null,
            room_no: null,
            floor: null,
            branch: null,
            room_floor_plan: null,
            room_floor_url: null,
            room_gender: null,
            sortorder: 1,
            status_active: true,
        },
        validate: (data) => {
            let errors: any = {};
            if (!data.noof_persons) {
                errors.noof_persons = 'No of Persons is required.';
            }
            if (!data.room_no) {
                errors.room_no = 'Room is required.';
            }
            if (!data.room_floor_plan) {
                errors.room_floor_plan = 'Room image is required.';
            }
            if (!data.floor) {
                errors.floor = 'Floor is required.';
            }
            if (!data.room_gender) {
                errors.room_gender = 'Gender is required.';
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
                    API.post('rooms', data).then(function (response) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'info', summary: 'Status', detail: 'Rooms Created Successfully!!!', life: 3000 });
                        }
                        formik.resetForm();
                        router.push("/rooms/summary");
                    }).catch(function (error) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'error', summary: 'Status', detail: 'Rooms Not able to create', life: 3000 });
                        }
                    });
                    setBlocked(false);
                },
            });
        }
    });

    const onUpload = (event: FileUploadUploadEvent) => {
        if (event.xhr.status === 200 && event.files) {
            formik.setFieldValue('room_floor_plan', event.files[0].name);
            formik.setFieldValue('room_floor_url', event.xhr.response);
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
                Create Room
            </span>
            <ConfirmDialog />
            <Toast ref={toast} />
            <BlockUI blocked={blocked}>
                <form onSubmit={formik.handleSubmit} className="col-12 p-fluid formgrid grid">
                   
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
                                    getFloorsBranch(e.value._id);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldValid('branch') })}
                            />
                            <label htmlFor="branch">Branch</label>
                        </span>
                        {getFormErrorMessage('branch')}
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <Dropdown
                                id="floor"
                                name="floor"
                                filter
                                value={formik.values.floor}
                                options={floors} optionLabel="floor_no"
                                onChange={(e) => {
                                    formik.setFieldValue('floor', e.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldValid('floor') })}
                            />
                            <label htmlFor="floor">Floor</label>
                        </span>
                        {getFormErrorMessage('floor')}
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputText
                                id="noof_persons"
                                name="noof_persons"
                                value={formik.values.noof_persons}
                                onChange={(e) => {
                                    formik.setFieldValue('noof_persons', e.target.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldValid('noof_persons') })}
                            />
                            <label htmlFor="noof_persons">No of Persons</label>
                        </span>
                        {getFormErrorMessage('noof_persons')}
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <Dropdown
                                inputId="room_gender"
                                name="room_gender"
                                value={formik.values.room_gender}
                                options={gender}
                                placeholder="Select a gender"
                                onChange={(e) => {
                                    formik.setFieldValue('room_gender', e.value);
                                }}
                            />
                            <label htmlFor="room_gender">Gender</label>
                        </span>
                        {getFormErrorMessage('room_gender')}
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputText
                                 id="room_no"
                                name="room_no"
                                value={formik.values.room_no}
                                onChange={(e) => {
                                    formik.setFieldValue('room_no', e.target.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldValid('room_no') })}
                            />
                            <label htmlFor="room_no">Room No</label>
                        </span>
                        {getFormErrorMessage('room_no')}
                    </div>
                    <div className="field mb-4 col-12 md:col-6"></div>
                    <div className="field mb-4 col-12 md:col-3">
                        <Image src={formik.values.room_floor_url} alt={formik.values.room_floor_plan} width="50" preview height="50" />
                        {getFormErrorMessage('room_floor_plan')}
                    </div>
                    <div className="field mb-4 col-12 md:col-3">
                        <FileUpload url={process.env.NEXT_PUBLIC_API_FILEUPLOAD} id="room_floor_url" onUpload={onUpload} ref={fileRef} mode="basic" name="file" accept="image/*" />
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
                    <div className="field mb-4 col-3">
                        <Button type="submit" label="Save" />
                    </div>
                    <div className="field mb-4 col-3">
                        <Button type="button"
                            label="Back"
                            className="p-button-secondary"
                            onClick={() => router.push("/rooms/summary")} ></Button>
                    </div>
                </form>
            </BlockUI>
        </div>
    );
}
export default RoomsCreate;
