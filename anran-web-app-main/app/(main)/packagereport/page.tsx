"use client";
import React, { useState, useEffect, useMemo } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { useFormik } from 'formik';
import { Panel } from 'primereact/panel';
import { BlockUI } from 'primereact/blockui';
import API from '@/anran/service/api';
import { MultiSelect } from 'primereact/multiselect';
import type { Branch } from "@/types";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Bar } from 'react-chartjs-2';
import { Dropdown } from 'primereact/dropdown';
const { PDFDocument, rgb } = require('pdf-lib');
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);



export default function FinanceReport() {

    const toast = useRef<Toast>(null);
    const [blocked, setBlocked] = useState(false);
    const [actionType, setActionType] = useState(null); // State to track the action type
    const [reportData, setReportData] = useState([]);
    const [branch, setBranch] = useState<Branch[]>([]);
    const [chartData, setChartData] = useState<any>(null);
    const [chartDataUsage, setChartDataUsage] = useState<any>(null);
    const [fileType, setFileType] = useState('xlsx');

    const fileTypeOptions = [
        { label: 'Excel', value: 'xlsx' },
        { label: 'PDF', value: 'pdf' }
    ];

    useEffect(() => {
        API.get('branch').then(function (response: any) {
            setBranch(response.data);
        }).catch(function (error) {
            console.log(error);
        });

    }, []);


    const responseType = fileType === 'pdf' ? 'arraybuffer' : (actionType === 'download' ? 'blob' : 'json');
    const packageformik = useFormik({
        initialValues: {
            fromDate: null,
            toDate: null,
            branches: null
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
                const response = await API.post('financereport/generate-Packagereport', values, {
                    params: { action: actionType, fileType: fileType },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    responseType: responseType,
                });

                if (actionType === 'view') {
                    generateChartData(response.data);
                    setReportData(response.data); // Set report data for viewing
                    toast.current?.show({ severity: 'info', summary: 'Status', detail: 'Report Loaded Successfully!!', life: 3000 });
                } else if (actionType === 'download') {
                    if (fileType !== 'pdf') {
                        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'Packagereport.xlsx';
                        a.click();
                        window.URL.revokeObjectURL(url);
                        toast.current?.show({ severity: 'info', summary: 'Status', detail: 'Report Generated Successfully!!!', life: 3000 });
                    } else {
                        const pdfDoc = await PDFDocument.load(response.data);
                        const pdfBytes = await pdfDoc.save();
                        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = 'Packagereport.pdf';
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        window.URL.revokeObjectURL(url);
                    }
                }
                setBlocked(false);

            } catch (error) {
                console.error('Error generating report:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to generate report', life: 3000 });
            }
        },
    });




    const handleAction = async (type: any) => {
        setActionType(type);
        //packageformik.handleSubmit();
    };



    const generateChartData = (data: any[]) => {
        // Example: Generate chart data based on `data`
        const labels = data.map((item: any) => item.PurchaseDateTime);
        const values = data.map((item: any) => item.TotalAmount);

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Total Amount',
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        });
    };




    const handleFileTypeChange = (event: any) => {
        setFileType(event.target.value);
    };




    return (
        <div className="p-d-flex p-flex-column p-ai-center">
            <h1>Generate Report</h1>
            <Toast ref={toast} />.
            <BlockUI blocked={blocked}></BlockUI>
            <Panel header="Package Report">
                <div className="grid">
                    <div className="col-12">



                        <form onSubmit={packageformik.handleSubmit} className="p-fluid">
                            <div className="grid formgrid p-fluid">
                                <div className="field mb-2 col-6 md:col-2">
                                    <label htmlFor="fromDate">From Date</label>
                                    <Calendar
                                        id="fromDate"
                                        name="fromDate"
                                        value={packageformik.values.fromDate}
                                        onChange={(e) => packageformik.setFieldValue('fromDate', e.value)}
                                        showIcon
                                        maxDate={new Date()}
                                        dateFormat="yy-mm-dd"
                                        className={packageformik.errors.fromDate && packageformik.touched.fromDate ? 'p-invalid' : ''}
                                    />
                                    {packageformik.errors.fromDate && packageformik.touched.fromDate && (
                                        <small className="p-error">{packageformik.errors.fromDate}</small>
                                    )}
                                </div>
                                <div className="field mb-2 col-6 md:col-2">
                                    <label htmlFor="toDate">To Date</label>
                                    <Calendar
                                        id="toDate"
                                        name="toDate"
                                        minDate={packageformik.values.fromDate || new Date()}
                                        maxDate={new Date()}
                                        value={packageformik.values.toDate}
                                        onChange={(e) => packageformik.setFieldValue('toDate', e.value)}
                                        showIcon
                                        dateFormat="yy-mm-dd"
                                        className={packageformik.errors.toDate && packageformik.touched.toDate ? 'p-invalid' : ''}
                                    />
                                    {packageformik.errors.toDate && packageformik.touched.toDate && (
                                        <small className="p-error">{packageformik.errors.toDate}</small>
                                    )}
                                </div>

                                <div className="field mb-2 col-6 md:col-2">
                                    <label htmlFor="branches">Branches</label>
                                    <MultiSelect
                                        inputId="preferredbranch"
                                        name="preferredbranch"
                                        value={packageformik.values.branches}
                                        options={branch}
                                        optionLabel="branch_name"
                                        placeholder="Select Branch"
                                        onChange={(e) => packageformik.setFieldValue('branches', e.value)}
                                    />

                                    {packageformik.errors.branches && packageformik.touched.branches && (
                                        <small className="p-error">{packageformik.errors.branches}</small>
                                    )}
                                </div>

                                <div className="field mb-2 col-6 md:col-2">
                                    <label htmlFor="branches">view</label>
                                    <Button
                                        label="View"
                                        icon="pi pi-eye"
                                        className="p-button-primary"
                                        onClick={() => handleAction('view')}
                                    />
                                </div>


                                <div className="field mb-2 col-6 md:col-2">
                                    <label htmlFor="branches">Type</label>
                                    <Dropdown
                                        value={fileType}
                                        options={fileTypeOptions}
                                        onChange={handleFileTypeChange}
                                        optionLabel="label"
                                        placeholder="Select File Type"
                                    />

                                </div>



                                <div className="field mb-2 col-6 md:col-2">
                                    <label htmlFor="branches">XL</label>
                                    <Button
                                        label="Download XL"
                                        icon="pi pi-file-excel"
                                        className="p-button-success"
                                        onClick={() => handleAction('download')}

                                    />
                                </div>
                            </div>
                        </form>

                        <div style={{ marginTop: '50px' }}></div>
                        {/* Display chart if reportData exists */}
                        {chartData && (
                            <div className="chart-container">
                                <Bar data={chartData} />
                            </div>
                        )}
                        <div style={{ marginTop: '50px' }}></div>
                        {reportData && reportData.length > 0 && (
                            <DataTable value={reportData} paginator rows={10}>
                                <Column field="PurchaseDateTime" header="Purchase Date Time" sortable />
                                <Column field="PackageName" header="Package Name" sortable />
                                <Column field="PurchaseQty" header="Purchase Quantity" sortable />
                                <Column field="BranchName" header="Branch Name" sortable />
                                <Column field="MemberPhone" header="Member Phone" sortable />
                                <Column field="MemberName" header="Member Name" sortable />
                                <Column field="Price" header="Price" sortable />
                                <Column field="TotalAmount" header="Total Amount" sortable />
                                <Column field="NetAmount" header="Net Amount" sortable />
                            </DataTable>
                        )}
                    </div>
                </div>

            </Panel>

            <br />



        </div>
    );



}


