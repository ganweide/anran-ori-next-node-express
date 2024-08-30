"use client";
import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { Calendar } from 'primereact/calendar';
import axios from 'axios';
import { MultiSelect } from 'primereact/multiselect';
import { Panel } from 'primereact/panel';
import { BlockUI } from 'primereact/blockui';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { useFormik } from 'formik';
import API from '@/anran/service/api';


export default function ECommerce() {

    const toast = useRef<Toast>(null);
    const [blocked, setBlocked] = useState(false);

    const packageformik = useFormik({
        initialValues: {
            fromDate: null,
            toDate: null
        },
        validate: (data) => {
            let errors: any = {};
            if (!data.fromDate) {
                errors.fromDate = 'From Date is required.';
            }
            if (!data.toDate) {
                errors.toDate = 'To Date is required';
            }
            if (data.fromDate && data.toDate) {
                if (data.fromDate >= data.toDate) {
                    errors.toDate = 'period to must be greater than period from';
                }
            }
            return errors;
        },

        onSubmit: async (values) => {
            try {
                setBlocked(true);
                const response = await API.post('attendance/generate-attendence', values, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    responseType: 'blob',  // Ensure response is treated as a blob
                });

                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Attendencereport.xlsx`;
                a.click();
                window.URL.revokeObjectURL(url);
                setBlocked(false);
            } catch (error) {
                console.error('Error generating report:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to generate report', life: 3000 });
            }
        },
    });


    return (


    <div className="p-d-flex p-flex-column p-ai-center">
            <h1>Attendence Report</h1>
            <Toast ref={toast} />.
            <BlockUI blocked={blocked}></BlockUI>
            <Panel header="Attendence Report">
                <div className="grid">
                    <div className="col-12">
                        <form onSubmit={packageformik.handleSubmit} className="p-fluid">
                            <div className="grid formgrid p-fluid">
                                <div className="field mb-3 col-6 md:col-3">
                                    <label htmlFor="fromDate">From Date</label>
                                    <Calendar
                                        id="fromDate"
                                        name="fromDate"
                                        value={packageformik.values.fromDate}
                                        onChange={(e) => packageformik.setFieldValue('fromDate', e.value)}
                                        showIcon
                                        maxDate={new Date()}
                                        dateFormat="yy-mm-dd"
                                        className={packageformik.errors.fromDate && packageformik.touched.fromDate ? 'p-invalid' : ''} />
                                    {packageformik.errors.fromDate && packageformik.touched.fromDate && (
                                        <small className="p-error">{packageformik.errors.fromDate}</small>
                                    )}
                                </div>
                                <div className="field mb-3 col-6 md:col-3">
                                    <label htmlFor="toDate">To Date</label>
                                    <Calendar
                                        id="toDate"
                                        minDate={packageformik.values.fromDate || new Date()}
                                        maxDate={new Date()}
                                        name="toDate"
                                        value={packageformik.values.toDate}
                                        onChange={(e) => packageformik.setFieldValue('toDate', e.value)}
                                        showIcon
                                        dateFormat="yy-mm-dd"
                                        className={packageformik.errors.toDate && packageformik.touched.toDate ? 'p-invalid' : ''} />
                                    {packageformik.errors.toDate && packageformik.touched.toDate && (
                                        <small className="p-error">{packageformik.errors.toDate}</small>
                                    )}
                                </div>

                              
                                <div className="field mb-3 col-6 md:col-3">
                                    <label htmlFor="toDate">Download XL</label>
                                    <Button label="Generate Report" icon="pi pi-file-excel" className="p-button-success" type="submit" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

            </Panel>
        </div>

    );
}
