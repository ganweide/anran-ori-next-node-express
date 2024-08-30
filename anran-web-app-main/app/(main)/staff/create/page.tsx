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
import API from '@/anran/service/api';
import { BlockUI } from 'primereact/blockui';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Password } from 'primereact/password';
import { Roles } from "@/anran/service/roles";
import { InputNumber } from "primereact/inputnumber";

function StaffCreate() {
    const toast = useRef<Toast>(null);
    const router = useRouter();
    const [blocked, setBlocked] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);

    const gender = [
        { name: 'Male', code: 'Male' },
        { name: 'Female', code: 'Female' },
    ];

    const header = <div className="font-bold mb-3">Pick a password</div>;
    const footer = (
        <>
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
            </ul>
        </>
    );

    useEffect(() => {
        const userRole = localStorage.getItem('roles');
        if (!(userRole && userRole.length > 0 && userRole.includes(Roles.admin_staff_update))) {
            router.push("/accessdenied");
        }
        API.get('branch').then(function (response: any) {
            setData(response.data);
        }).catch(function (error) {
            console.log(error);
        });
        API.get('roles').then(function (response: any) {
            setRoles(response.data);
        }).catch(function (error) {
            console.log(error);
        });
    }, []);

    const formik = useFormik({
        initialValues: {
            name: '',
            staff_code: '',
            gender: '',
            roles: null,
            branch: null,
            joingdate: null,
            username: null,
            loginkey: null,
            status_active: true,
            emailaddress: null,
            position_department: null,
            fullname: null,
            nirc: null,
            religion: null,
            mobilenumber: null,
            martialstatus: null,
            currentaddress: null,
            bankname: null,
            bankaccountnumber: null,
            bankepfno: null,
            banksocsono: null,
            bankincometaxno: null,
            emergency_contactname: null,
            emergency_relation: null,
            emergency_contact: null
        },
        validate: (data) => {
            let errors: any = {};
            if (!data.name) {
                errors.name = 'Name is required.';
            }
            if (!data.staff_code) {
                errors.staff_code = 'Staff Code is required.';
            }
            if (!data.gender) {
                errors.gender = 'Gender is required.';
            }
            if (!data.roles) {
                errors.roles = 'Role is required.';
            }
            if (!data.branch) {
                errors.branch = 'Branch is required.';
            }
            if (!data.joingdate) {
                errors.joingdate = 'Joing Date is required.';
            }
            if (!data.username) {
                errors.username = 'Username is required.';
            }
            if (!data.loginkey) {
                errors.loginkey = 'Password is required.';
            }
            if (!data.status_active) {
                errors.status_active = 'Active/InActive is required.';
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
                    const subobj = {
                        name: data.name,
                        staff_code: data.staff_code,
                        gender: data.gender.name,
                        roles: data.roles,
                        branch: data.branch,
                        joingdate: data.joingdate,
                        username: data.username,
                        loginkey: data.loginkey,
                        status_active: data.status_active,
                        emailaddress: data.emailaddress,
                        position_department: data.position_department,
                        fullname: data.fullname,
                        nirc: data.nirc,
                        religion: data.religion,
                        mobilenumber: data.mobilenumber,
                        martialstatus: data.martialstatus,
                        currentaddress: data.currentaddress,
                        bankname: data.bankname,
                        bankaccountnumber: data.bankaccountnumber,
                        bankepfno: data.bankepfno,
                        banksocsono: data.banksocsono,
                        bankincometaxno: data.bankincometaxno,
                        emergency_contactname: data.emergency_contactname,
                        emergency_relation: data.emergency_relation,
                        emergency_contact: data.emergency_contact
                    }
                    API.post('staff', subobj).then(function (response) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'info', summary: 'Status', detail: 'Staff Created Successfully!!!', life: 3000 });
                        }
                        formik.resetForm();
                        router.push("/staff/summary");
                    }).catch(function (error) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'error', summary: 'Status', detail: 'Staff Not able to create', life: 3000 });
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
                Create Staff
            </span>
            <ConfirmDialog />
            <Toast ref={toast} />
            <BlockUI blocked={blocked}>
                <form onSubmit={formik.handleSubmit} className="col-12 p-fluid formgrid grid">
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputText
                                id="name"
                                name="name"
                                value={formik.values.name}
                                onChange={(e) => {
                                    formik.setFieldValue('name', e.target.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldValid('name') })}
                            />
                            <label htmlFor="name">Name</label>
                        </span>
                        {getFormErrorMessage('name')}
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputText
                                id="staff_code"
                                name="staff_code"
                                value={formik.values.staff_code}
                                onChange={(e) => {
                                    formik.setFieldValue('staff_code', e.target.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldValid('staff_code') })}
                            />
                            <label htmlFor="staff_code">Staff Code</label>
                        </span>
                        {getFormErrorMessage('staff_code')}
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
                            <Dropdown
                                id="gender"
                                filter
                                name="gender"
                                value={formik.values.gender}
                                options={gender} optionLabel="name"
                                onChange={(e) => {
                                    formik.setFieldValue('gender', e.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldValid('gender') })}
                            />
                            <label htmlFor="gender">Gender</label>
                        </span>
                        {getFormErrorMessage('gender')}
                    </div>

                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <Dropdown
                                id="roles"
                                filter
                                name="roles"
                                value={formik.values.roles}
                                options={roles} optionLabel="role_name"
                                onChange={(e) => {
                                    formik.setFieldValue('roles', e.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldValid('roles') })}
                            />
                            <label htmlFor="roles">Role</label>
                        </span>
                        {getFormErrorMessage('roles')}
                    </div>

                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <Calendar
                                dateFormat="dd/mm/yy"
                                showIcon
                                id="joingdate"
                                name="joingdate"
                                value={formik.values.joingdate}
                                onChange={(e) => {
                                    formik.setFieldValue('joingdate', e.target.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldValid('joingdate') })}
                            />
                            <label htmlFor="joingdate">Joing Date</label>
                        </span>
                        {getFormErrorMessage('joingdate')}
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
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
                            <label htmlFor="username">User Name</label>
                        </span>
                        {getFormErrorMessage('username')}
                    </div>

                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <Password
                                header={header} footer={footer}
                                id="loginkey"
                                name="loginkey"
                                value={formik.values.loginkey}
                                onChange={(e) => {
                                    formik.setFieldValue('loginkey', e.target.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldValid('loginkey') })}
                            />
                            <label htmlFor="loginkey">Password</label>
                        </span>
                        {getFormErrorMessage('loginkey')}
                    </div>

                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputText
                                id="emailaddress"
                                name="emailaddress"
                                type="email"
                                value={formik.values.emailaddress}
                                onChange={(e) => {
                                    formik.setFieldValue('emailaddress', e.target.value);
                                }}
                            />
                            <label htmlFor="emailaddress">Email</label>
                        </span>
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputText
                                id="position_department"
                                name="position_department"
                                value={formik.values.position_department}
                                onChange={(e) => {
                                    formik.setFieldValue('position_department', e.target.value);
                                }}
                            />
                            <label htmlFor="position_department">Position</label>
                        </span>
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputText
                                id="fullname"
                                name="fullname"
                                value={formik.values.fullname}
                                onChange={(e) => {
                                    formik.setFieldValue('fullname', e.target.value);
                                }}
                            />
                            <label htmlFor="fullname">Full Name</label>
                        </span>
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputNumber
                                id="nirc"
                                name="nirc"
                                value={formik.values.nirc}
                                onValueChange={(e) => {
                                    formik.setFieldValue('nirc', e.target.value);
                                }}
                                useGrouping={false}
                            />
                            <label htmlFor="nirc">NIRC</label>
                        </span>
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputText
                                id="religion"
                                name="religion"
                                value={formik.values.religion}
                                onChange={(e) => {
                                    formik.setFieldValue('religion', e.target.value);
                                }}
                            />
                            <label htmlFor="religion">Religion</label>
                        </span>
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputNumber
                                id="mobilenumber"
                                name="mobilenumber"
                                value={formik.values.mobilenumber}
                                onValueChange={(e) => {
                                    formik.setFieldValue('mobilenumber', e.target.value);
                                }}
                                useGrouping={false}
                            />
                            <label htmlFor="mobilenumber">Mobile Number</label>
                        </span>
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputText
                                id="martialstatus"
                                name="martialstatus"
                                value={formik.values.martialstatus}
                                onChange={(e) => {
                                    formik.setFieldValue('martialstatus', e.target.value);
                                }}
                            />
                            <label htmlFor="martialstatus">Martial Status</label>
                        </span>
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputText
                                id="currentaddress"
                                name="currentaddress"
                                value={formik.values.currentaddress}
                                onChange={(e) => {
                                    formik.setFieldValue('currentaddress', e.target.value);
                                }}
                            />
                            <label htmlFor="currentaddress">Current Address</label>
                        </span>
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputText
                                id="bankname"
                                name="bankname"
                                value={formik.values.bankname}
                                onChange={(e) => {
                                    formik.setFieldValue('bankname', e.target.value);
                                }}
                            />
                            <label htmlFor="bankname">Bank Name</label>
                        </span>
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputNumber
                                id="bankaccountnumber"
                                name="bankaccountnumber"
                                value={formik.values.bankaccountnumber}
                                onValueChange={(e) => {
                                    formik.setFieldValue('bankaccountnumber', e.target.value);
                                }}
                                useGrouping={false}
                            />
                            <label htmlFor="bankaccountnumber">Account No</label>
                        </span>
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputNumber
                                id="bankepfno"
                                name="bankepfno"
                                value={formik.values.bankepfno}
                                onValueChange={(e) => {
                                    formik.setFieldValue('bankepfno', e.target.value);
                                }}
                                useGrouping={false}
                            />
                            <label htmlFor="bankepfno">EPFO No</label>
                        </span>
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputNumber
                                id="banksocsono"
                                name="banksocsono"
                                value={formik.values.banksocsono}
                                onValueChange={(e) => {
                                    formik.setFieldValue('banksocsono', e.target.value);
                                }}
                                useGrouping={false}
                            />
                            <label htmlFor="banksocsono">SOCS No</label>
                        </span>
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputText
                                id="bankincometaxno"
                                name="bankincometaxno"
                                value={formik.values.bankincometaxno}
                                onChange={(e) => {
                                    formik.setFieldValue('bankincometaxno', e.target.value);
                                }}
                            />
                            <label htmlFor="bankincometaxno">IncomeTax No</label>
                        </span>
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputText
                                id="emergency_contactname"
                                name="emergency_contactname"
                                value={formik.values.emergency_contactname}
                                onChange={(e) => {
                                    formik.setFieldValue('emergency_contactname', e.target.value);
                                }}
                            />
                            <label htmlFor="emergency_contactname">Emergency Contact Name</label>
                        </span>
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputText
                                id="emergency_relation"
                                name="emergency_relation"
                                value={formik.values.emergency_relation}
                                onChange={(e) => {
                                    formik.setFieldValue('emergency_relation', e.target.value);
                                }}
                            />
                            <label htmlFor="emergency_relation">Emergency Relation</label>
                        </span>
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <span className="p-float-label">
                            <InputText
                                id="emergency_contact"
                                name="emergency_contact"
                                value={formik.values.emergency_contact}
                                onChange={(e) => {
                                    formik.setFieldValue('emergency_contact', e.target.value);
                                }}
                            />
                            <label htmlFor="emergency_contact">Emergency Contact</label>
                        </span>
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <label htmlFor="status_active">Active/InActive</label>
                    </div>
                    <div className="field mb-4 col-12 md:col-6">
                        <InputSwitch
                            id="loginkey"
                            name="loginkey"
                            checked={formik.values.status_active}
                            value={formik.values.status_active}
                            onChange={(e) => {
                                formik.setFieldValue('status_active', e.value);
                            }}
                            className={classNames({ 'p-invalid': isFormFieldValid('status_active') })}
                        />

                        {getFormErrorMessage('status_active')}
                    </div>
                    <div className="field mb-4 col-12 md:col-3">
                        <Button type="submit" label="Save" />
                    </div>
                    <div className="field mb-4 col-3">
                        <Button type="button"
                            label="Back"
                            className="p-button-secondary"
                            onClick={() => router.push("/staff/summary")} ></Button>
                    </div>
                </form>

            </BlockUI>
        </div>
    );
}
export default StaffCreate;
