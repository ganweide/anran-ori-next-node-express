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
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { Checkbox } from 'primereact/checkbox';
import { Roles } from "@/anran/service/roles";
import { InputSwitch } from 'primereact/inputswitch';

function RoleEdit({ params }: { params: { id: string } }) {
    const toast = useRef<Toast>(null);
    const router = useRouter();
    const [blocked, setBlocked] = useState(false);
    const { id } = params;
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const userRole = localStorage.getItem('roles');
        if (!(userRole && userRole.length > 0 && userRole.includes(Roles.admin_role_update))) {
            router.push("/accessdenied");
        }
        API.get('branch').then(function (response: any) {
            setData(response.data);
        }).catch(function (error) {
            console.log(error);
        });
        API.get('roles/' + id).then(function (response: any) {
            formik.setFieldValue('role_name', response.data.role_name, false);
            formik.setFieldValue('branch', response.data.branch, false);
            formik.setFieldValue('all_branch', response.data.all_branch, false);
            if (response.data.admin_role)
                formik.setFieldValue('admin_role', response.data.admin_role, false);
            if (response.data.admin_banner)
                formik.setFieldValue('admin_banner', response.data.admin_banner, false);
            if (response.data.admin_message)
                formik.setFieldValue('admin_message', response.data.admin_message, false);
            if (response.data.admin_staff)
                formik.setFieldValue('admin_staff', response.data.admin_staff, false);
            if (response.data.admin_branch)
                formik.setFieldValue('admin_branch', response.data.admin_branch, false);
            if (response.data.admin_room)
                formik.setFieldValue('admin_room', response.data.admin_room, false);
            if (response.data.admin_package)
                formik.setFieldValue('admin_package', response.data.admin_package, false);
            if (response.data.member_member)
                formik.setFieldValue('member_member', response.data.member_member, false);
            if (response.data.member_booking)
                formik.setFieldValue('member_booking', response.data.member_booking, false);
            if (response.data.member_checkin)
                formik.setFieldValue('member_checkin', response.data.member_checkin, false);
            if (response.data.member_checkinqr)
                formik.setFieldValue('member_checkinqr', response.data.member_checkinqr, false);
            if (response.data.member_transfer)
                formik.setFieldValue('member_transfer', response.data.member_transfer, false);
            if (response.data.finance_purchase)
                formik.setFieldValue('finance_purchase', response.data.finance_purchase, false);
            if (response.data.finance_checkin)
                formik.setFieldValue('finance_checkin', response.data.finance_checkin, false);
            if (response.data.finance_attendance)
                formik.setFieldValue('finance_attendance', response.data.finance_attendance, false);
            formik.setFieldValue('status_active', response.data.status_active, false);
        }).catch(function (error) {
            console.log(error);
        });
    }, []);



    const formik = useFormik({
        initialValues: {
            role_name: '',
            admin_role: { view: false, create: false, update: false },
            admin_banner: { view: false, create: false, delete: false },
            admin_message: { view: false, create: false, delete: false },
            admin_staff: { view: false, create: false, update: false },
            admin_branch: { view: false, create: false, update: false },
            admin_room: { view: false, create: false, update: false },
            admin_package: { view: false, create: false, update: false },
            member_member: { view: false, create: false, update: false },
            member_booking: { view: false, create: false, update: false },
            member_checkin: { view: false, create: false, update: false },
            member_checkinqr: { view: false, create: false, update: false },
            member_transfer: { view: false, create: false, update: false },
            finance_purchase: { view: false, create: false, update: false },
            finance_checkin: { view: false, create: false, update: false },
            finance_attendance: { view: false, create: false, update: false },
            branch: [],
            all_branch: false,
            status_active: true,
        },
        validate: (data) => {
            let errors: any = {};
            if (!data.role_name) {
                errors.role_name = 'Role Name is required.';
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
                    API.put('roles/' + id, data).then(function (response) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'info', summary: 'Status', detail: 'Role Created Successfully!!!', life: 3000 });
                        }
                        formik.resetForm();
                        router.push("/role/summary");
                    }).catch(function (error) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'error', summary: 'Status', detail: 'Role Not able to create', life: 3000 });
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
                Update Role
            </span>
            <ConfirmDialog />
            <Toast ref={toast} />
            <BlockUI blocked={blocked}>
                <form onSubmit={formik.handleSubmit} className="col-12 p-fluid formgrid grid">
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputText
                                id="role_name"
                                name="role_name"
                                value={formik.values.role_name}
                                onChange={(e) => {
                                    formik.setFieldValue('role_name', e.target.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldValid('role_name') })}
                            />
                            <label htmlFor="role_name">Role Name</label>
                        </span>
                        {getFormErrorMessage('role_name')}
                    </div>
                    <div className="field mb-4 col-12 md:col-6"></div>
                    <div className="field mb-4 col-12 md:col-12">
                        <span>
                            <Checkbox inputId="all_branch" name="all_branch" onChange={e => formik.setFieldValue('all_branch', e.checked)} checked={formik.values.all_branch} />
                            <label htmlFor="all_branch">All Branch</label>
                        </span>
                        {getFormErrorMessage('all_branch')}
                    </div>
                    {!formik.values.all_branch ?
                        <div className="field mb-4 col-12 md:col-12">
                            <span className="p-float-label">
                                <MultiSelect id="branch"
                                    name="branch" value={formik.values.branch} onChange={(e: MultiSelectChangeEvent) => formik.setFieldValue('branch', e.value)} options={data} optionLabel="branch_name"
                                    placeholder="Select Branch" className="w-full md:w-20rem" />
                                <label htmlFor="branch">Branch</label>
                            </span>
                            {getFormErrorMessage('branch')}
                        </div> : <div className="field mb-4 col-12 md:col-12"></div>}
                    <div className="field mb-4 col-4">
                        <label htmlFor="admin_role">Admin-Role</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="admin_role.view" name="admin_role.view" onChange={e => formik.setFieldValue('admin_role.view', e.checked)} checked={formik.values.admin_role.view} />
                        <label htmlFor="view" className="ml-2">View</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="admin_role.create" name="admin_role.create" onChange={e => formik.setFieldValue('admin_role.create', e.checked)} checked={formik.values.admin_role.create} />
                        <label htmlFor="create" className="ml-2">Create</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="admin_role.update" name="admin_role.update" onChange={e => formik.setFieldValue('admin_role.update', e.checked)} checked={formik.values.admin_role.update} />
                        <label htmlFor="update" className="ml-2">Update</label>
                    </div>
                    <div className="field mb-4 col-2">
                    </div>
                    <div className="field mb-4 col-4">
                        <label htmlFor="admin_banner">Admin-Banner</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="admin_banner.view" name="admin_banner.view" onChange={e => formik.setFieldValue('admin_banner.view', e.checked)} checked={formik.values.admin_banner.view} />
                        <label htmlFor="view" className="ml-2">View</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="admin_banner.create" name="admin_banner.create" onChange={e => formik.setFieldValue('admin_banner.create', e.checked)} checked={formik.values.admin_banner.create} />
                        <label htmlFor="create" className="ml-2">Create</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="admin_banner.delete" name="admin_banner.delete" onChange={e => formik.setFieldValue('admin_banner.delete', e.checked)} checked={formik.values.admin_banner.delete} />
                        <label htmlFor="delete" className="ml-2">Delete</label>
                    </div>
                    <div className="field mb-4 col-2">
                    </div>
                    {/* admin_message */}
                    <div className="field mb-4 col-4">
                        <label htmlFor="admin_message">Admin_Message</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="admin_message.view" name="admin_message.view" onChange={e => formik.setFieldValue('admin_message.view', e.checked)} checked={formik.values.admin_message.view} />
                        <label htmlFor="view" className="ml-2">View</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="admin_message.create" name="admin_message.create" onChange={e => formik.setFieldValue('admin_message.create', e.checked)} checked={formik.values.admin_message.create} />
                        <label htmlFor="create" className="ml-2">Create</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="admin_message.delete" name="admin_message.delete" onChange={e => formik.setFieldValue('admin_message.delete', e.checked)} checked={formik.values.admin_message.delete} />
                        <label htmlFor="delete" className="ml-2">Delete</label>
                    </div>
                    <div className="field mb-4 col-2">
                    </div>
                    {/* staff */}
                    <div className="field mb-4 col-4">
                        <label htmlFor="admin_staff">Admin-Staff</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="admin_staff.view" name="admin_staff.view" onChange={e => formik.setFieldValue('admin_staff.view', e.checked)} checked={formik.values.admin_staff.view} />
                        <label htmlFor="view" className="ml-2">View</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="admin_staff.create" name="admin_staff.create" onChange={e => formik.setFieldValue('admin_staff.create', e.checked)} checked={formik.values.admin_staff.create} />
                        <label htmlFor="create" className="ml-2">Create</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="admin_staff.update" name="admin_staff.update" onChange={e => formik.setFieldValue('admin_staff.update', e.checked)} checked={formik.values.admin_staff.update} />
                        <label htmlFor="update" className="ml-2">Update</label>
                    </div>
                    <div className="field mb-4 col-2">
                    </div>
                    {/* branch */}
                    <div className="field mb-4 col-4">
                        <label htmlFor="admin_branch">Admin-Branch</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="admin_branch.view" name="admin_branch.view" onChange={e => formik.setFieldValue('admin_branch.view', e.checked)} checked={formik.values.admin_branch.view} />
                        <label htmlFor="view" className="ml-2">View</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="admin_branch.create" name="admin_branch.create" onChange={e => formik.setFieldValue('admin_branch.create', e.checked)} checked={formik.values.admin_branch.create} />
                        <label htmlFor="create" className="ml-2">Create</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="admin_branch.update" name="admin_branch.update" onChange={e => formik.setFieldValue('admin_branch.update', e.checked)} checked={formik.values.admin_branch.update} />
                        <label htmlFor="update" className="ml-2">Update</label>
                    </div>
                    <div className="field mb-4 col-2">
                    </div>
                    {/* room */}
                    <div className="field mb-4 col-4">
                        <label htmlFor="admin_room">Admin-Room</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="admin_room.view" name="admin_room.view" onChange={e => formik.setFieldValue('admin_room.view', e.checked)} checked={formik.values.admin_room.view} />
                        <label htmlFor="view" className="ml-2">View</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="admin_room.create" name="admin_room.create" onChange={e => formik.setFieldValue('admin_room.create', e.checked)} checked={formik.values.admin_room.create} />
                        <label htmlFor="create" className="ml-2">Create</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="admin_room.update" name="admin_room.update" onChange={e => formik.setFieldValue('admin_room.update', e.checked)} checked={formik.values.admin_room.update} />
                        <label htmlFor="update" className="ml-2">Update</label>
                    </div>
                    <div className="field mb-4 col-2">
                    </div>
                    {/* package */}
                    <div className="field mb-4 col-4">
                        <label htmlFor="admin_package">Admin-Package</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="admin_package.view" name="admin_package.view" onChange={e => formik.setFieldValue('admin_package.view', e.checked)} checked={formik.values.admin_package.view} />
                        <label htmlFor="view" className="ml-2">View</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="admin_package.create" name="admin_package.create" onChange={e => formik.setFieldValue('admin_package.create', e.checked)} checked={formik.values.admin_package.create} />
                        <label htmlFor="create" className="ml-2">Create</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="admin_package.update" name="admin_package.update" onChange={e => formik.setFieldValue('admin_package.update', e.checked)} checked={formik.values.admin_package.update} />
                        <label htmlFor="update" className="ml-2">Update</label>
                    </div>
                    <div className="field mb-4 col-2">
                    </div>
                    {/* member */}
                    <div className="field mb-4 col-4">
                        <label htmlFor="member_member">Admin-Member</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="member_member.view" name="member_member.view" onChange={e => formik.setFieldValue('member_member.view', e.checked)} checked={formik.values.member_member.view} />
                        <label htmlFor="view" className="ml-2">View</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="member_member.create" name="member_member.create" onChange={e => formik.setFieldValue('member_member.create', e.checked)} checked={formik.values.member_member.create} />
                        <label htmlFor="create" className="ml-2">Create</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="member_member.update" name="member_member.update" onChange={e => formik.setFieldValue('member_member.update', e.checked)} checked={formik.values.member_member.update} />
                        <label htmlFor="update" className="ml-2">Update</label>
                    </div>
                    <div className="field mb-4 col-2">
                    </div>
                    {/* booking */}
                    <div className="field mb-4 col-4">
                        <label htmlFor="member_booking">Admin-Booking</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="member_booking.view" name="member_booking.view" onChange={e => formik.setFieldValue('member_booking.view', e.checked)} checked={formik.values.member_booking.view} />
                        <label htmlFor="view" className="ml-2">View</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="member_booking.create" name="member_booking.create" onChange={e => formik.setFieldValue('member_booking.create', e.checked)} checked={formik.values.member_booking.create} />
                        <label htmlFor="create" className="ml-2">Create</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="member_booking.update" name="member_booking.update" onChange={e => formik.setFieldValue('member_booking.update', e.checked)} checked={formik.values.member_booking.update} />
                        <label htmlFor="update" className="ml-2">Update</label>
                    </div>
                    <div className="field mb-4 col-2">
                    </div>
                    {/* checkin */}
                    <div className="field mb-4 col-4">
                        <label htmlFor="member_checkin">Member-Check-In</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="member_checkin.view" name="member_checkin.view" onChange={e => formik.setFieldValue('member_checkin.view', e.checked)} checked={formik.values.member_checkin.view} />
                        <label htmlFor="view" className="ml-2">View</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="member_checkin.create" name="member_checkin.create" onChange={e => formik.setFieldValue('member_checkin.create', e.checked)} checked={formik.values.member_checkin.create} />
                        <label htmlFor="create" className="ml-2">Create</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="member_checkin.update" name="member_checkin.update" onChange={e => formik.setFieldValue('member_checkin.update', e.checked)} checked={formik.values.member_checkin.update} />
                        <label htmlFor="update" className="ml-2">Update</label>
                    </div>
                    <div className="field mb-4 col-2">
                    </div>
                    {/* qr */}
                    <div className="field mb-4 col-4">
                        <label htmlFor="member_checkinqr">Member-QR</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="member_checkinqr.view" name="member_checkinqr.view" onChange={e => formik.setFieldValue('member_checkinqr.view', e.checked)} checked={formik.values.member_checkinqr.view} />
                        <label htmlFor="view" className="ml-2">View</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="member_checkinqr.create" name="member_checkinqr.create" onChange={e => formik.setFieldValue('member_checkinqr.create', e.checked)} checked={formik.values.member_checkinqr.create} />
                        <label htmlFor="create" className="ml-2">Create</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="member_checkinqr.update" name="member_checkinqr.update" onChange={e => formik.setFieldValue('member_checkinqr.update', e.checked)} checked={formik.values.member_checkinqr.update} />
                        <label htmlFor="update" className="ml-2">Update</label>
                    </div>
                    <div className="field mb-4 col-2">
                    </div>
                    {/* transfer */}
                    <div className="field mb-4 col-4">
                        <label htmlFor="member_transfer">Member-Staff</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="member_transfer.view" name="member_transfer.view" onChange={e => formik.setFieldValue('member_transfer.view', e.checked)} checked={formik.values.member_transfer.view} />
                        <label htmlFor="view" className="ml-2">View</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="member_transfer.create" name="member_transfer.create" onChange={e => formik.setFieldValue('member_transfer.create', e.checked)} checked={formik.values.member_transfer.create} />
                        <label htmlFor="create" className="ml-2">Create</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="member_transfer.update" name="member_transfer.update" onChange={e => formik.setFieldValue('member_transfer.update', e.checked)} checked={formik.values.member_transfer.update} />
                        <label htmlFor="update" className="ml-2">Update</label>
                    </div>
                    <div className="field mb-4 col-2">
                    </div>
                    {/* purchase */}
                    <div className="field mb-4 col-4">
                        <label htmlFor="finance_purchase">Finance-Purchase</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="finance_purchase.view" name="finance_purchase.view" onChange={e => formik.setFieldValue('finance_purchase.view', e.checked)} checked={formik.values.finance_purchase.view} />
                        <label htmlFor="view" className="ml-2">View</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="finance_purchase.create" name="finance_purchase.create" onChange={e => formik.setFieldValue('finance_purchase.create', e.checked)} checked={formik.values.finance_purchase.create} />
                        <label htmlFor="create" className="ml-2">Create</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="finance_purchase.update" name="finance_purchase.update" onChange={e => formik.setFieldValue('finance_purchase.update', e.checked)} checked={formik.values.finance_purchase.update} />
                        <label htmlFor="update" className="ml-2">Update</label>
                    </div>
                    <div className="field mb-4 col-2">
                    </div>
                    {/* fcheckin */}
                    <div className="field mb-4 col-4">
                        <label htmlFor="finance_checkin">Finance-CheckIn</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="finance_checkin.view" name="finance_checkin.view" onChange={e => formik.setFieldValue('finance_checkin.view', e.checked)} checked={formik.values.finance_checkin.view} />
                        <label htmlFor="view" className="ml-2">View</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="finance_checkin.create" name="finance_checkin.create" onChange={e => formik.setFieldValue('finance_checkin.create', e.checked)} checked={formik.values.finance_checkin.create} />
                        <label htmlFor="create" className="ml-2">Create</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="finance_checkin.update" name="finance_checkin.update" onChange={e => formik.setFieldValue('finance_checkin.update', e.checked)} checked={formik.values.finance_checkin.update} />
                        <label htmlFor="update" className="ml-2">Update</label>
                    </div>
                    <div className="field mb-4 col-2">
                    </div>
                    {/* attendance */}
                    <div className="field mb-4 col-4">
                        <label htmlFor="finance_attendance">Finance-Attendance</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="finance_attendance.view" name="finance_attendance.view" onChange={e => formik.setFieldValue('finance_attendance.view', e.checked)} checked={formik.values.finance_attendance.view} />
                        <label htmlFor="view" className="ml-2">View</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="finance_attendance.create" name="finance_attendance.create" onChange={e => formik.setFieldValue('finance_attendance.create', e.checked)} checked={formik.values.finance_attendance.create} />
                        <label htmlFor="create" className="ml-2">Create</label>
                    </div>
                    <div className="field mb-4 col-2 flex">
                        <Checkbox inputId="finance_attendance.update" name="finance_attendance.update" onChange={e => formik.setFieldValue('finance_attendance.update', e.checked)} checked={formik.values.finance_attendance.update} />
                        <label htmlFor="update" className="ml-2">Update</label>
                    </div>

                    <div className="field mb-4 col-12 md:col-3">
                        <label htmlFor="status_active">Active/InActive</label>
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
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
                        {formik.values.status_active}
                    </div>

                    <div className="field mb-4 col-2">
                    </div>
                    <div className="field mb-4 col-3">
                        <Button type="submit" label="Update" />
                    </div>
                    <div className="field mb-4 col-3">
                        <Button type="button"
                            label="Back"
                            className="p-button-secondary"
                            onClick={() => router.push("/role/summary")} ></Button>
                    </div>
                </form>
            </BlockUI>
        </div>
    );
}
export default RoleEdit;
