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
import { SelectButton } from 'primereact/selectbutton';

function AttendanceCreate() {
    const toast = useRef<Toast>(null);
    const router = useRouter();
    const [blocked, setBlocked] = useState(false);
    const options = ['Present', 'Absent'];

    useEffect(() => {

    }, []);

    const formik = useFormik({
        initialValues: {
            att_type: null,
            username: null,
        },
        validate: (data) => {
            let errors: any = {};
            if (!data.att_type) {
                errors.att_type = 'Type is required.';
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
                    data.username = localStorage.getItem('username');
                    API.post('attendance', data).then(function (response) {
                        if (response && response.data.status) {
                            formik.resetForm();
                            router.push("/attendance/summary");
                            if (toast && toast.current) {
                                toast.current.show({ severity: 'info', summary: 'Status', detail: 'Attendance Successfully!!!', life: 3000 });
                            }
                        } else {
                            if (toast && toast.current) {
                                toast.current.show({ severity: 'error', summary: 'Status', detail: 'Attendance User not exists!!!', life: 3000 });
                            }
                        }
                    }).catch(function (error) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'error', summary: 'Status', detail: 'Attendance Not able to Log', life: 3000 });
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
                Attendance
            </span>
            <ConfirmDialog />
            <Toast ref={toast} />
            <BlockUI blocked={blocked}>
                <div className="grid">
                    <div className="col-12 lg:col-12">
                        <div className="grid formgrid p-fluid">
                            <form onSubmit={formik.handleSubmit} className="field mb-4 col-6">
                                <div className="field mb-4 col-12">
                                    <span className="p-float-label">
                                        <SelectButton
                                            id="att_type"
                                            name="att_type"
                                            value={formik.values.att_type}
                                            options={options}
                                            onChange={(e) => {
                                                formik.setFieldValue('att_type', e.value);
                                            }}
                                            className={classNames({ 'p-invalid': isFormFieldValid('att_type') })}
                                        />
                                    </span>
                                    {getFormErrorMessage('att_type')}
                                </div>
                                <div className="field mb-4 col-6">
                                    <Button type="submit" label="Log Attendance" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </BlockUI>
        </div>
    );
}
export default AttendanceCreate;
