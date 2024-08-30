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
import { TooltipItem } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Dropdown } from 'primereact/dropdown';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
const { PDFDocument, rgb } = require('pdf-lib');



ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);




export default function FinanceReport() {

    const toast = useRef<Toast>(null);
    const [blocked, setBlocked] = useState(false);
    const [actionType, setActionType] = useState(null); // State to track the action type
    const [reportData, setReportData] = useState([]);
    const [branch, setBranch] = useState<Branch[]>([]);
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

    const usageformik = useFormik({
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
                const response = await API.post('financereport/generate-Usagereport', values, {
                    params: { action: actionType, fileType: fileType },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    responseType: responseType,
                });
                if (actionType === 'view') {
                    generateChartDataUsage(response.data);
                    setReportData(response.data); // Set report data for viewing
                    toast.current?.show({ severity: 'info', summary: 'Status', detail: 'Report Loaded Successfully!!', life: 3000 });
                } else if (actionType === 'download') {
                    if (fileType !== 'pdf') {
                        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'Usagereport.xlsx';
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
                        link.download = 'Usagereport.pdf';
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

    

    const handleActionusage = async (type: any) => {
        setActionType(type);
       // usageformik.handleSubmit();
    };



    const aggregateDataByBranch = (data: any) => {
        return data.reduce((acc: any, item: any) => {
            const branch = item.checkInBranchName;
            if (!acc[branch]) {
                acc[branch] = 0;
            }
            acc[branch] += item.creditUsed;
            return acc;
        }, {});
    };

    const generateChartDataUsage = (data: any[]) => {

        const aggregatedData = aggregateDataByBranch(data);
        const labels = Object.keys(aggregatedData);
        const values = Object.values(aggregatedData);

        setChartDataUsage({
            labels,
            datasets: [
                {
                    label: 'Total Count by Branch',
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)', // Light color for the bars
                    borderColor: 'rgba(75, 192, 192, 1)', // Darker color for the border
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(75, 192, 192, 0.4)', // Darker color on hover
                    hoverBorderColor: 'rgba(75, 192, 192, 1)', // Darker border on hover
                    borderRadius: 4, // Rounded corners for bars
                },
            ],
        });
    };



    const handleChange = (e: any) => {
        const newValue = e.value;
        usageformik.setFieldValue('branches', newValue);
    };



    const handleFileTypeChange = (event: any) => {
        setFileType(event.target.value);
    };

    return (
        <div className="p-d-flex p-flex-column p-ai-center">
            <h1>Generate Report</h1>
            <Toast ref={toast} />.
            <BlockUI blocked={blocked}></BlockUI>


            <br />
            <Panel header="Usage Report">
                <div className="grid">
                    <div className="col-12">
                        <form onSubmit={usageformik.handleSubmit} className="p-fluid">
                            <div className="grid formgrid p-fluid">
                                <div className="field mb-2 col-6 md:col-2">
                                    <label htmlFor="fromDate">From Date</label>
                                    <Calendar
                                        id="fromDate"
                                        name="fromDate"
                                        value={usageformik.values.fromDate}
                                        onChange={(e) => usageformik.setFieldValue('fromDate', e.value)}
                                        showIcon
                                        maxDate={new Date()}
                                        dateFormat="yy-mm-dd"
                                        className={usageformik.errors.fromDate && usageformik.touched.fromDate ? 'p-invalid' : ''}
                                    />
                                    {usageformik.errors.fromDate && usageformik.touched.fromDate && (
                                        <small className="p-error">{usageformik.errors.fromDate}</small>
                                    )}
                                </div>
                                <div className="field mb-2 col-6 md:col-2">
                                    <label htmlFor="toDate">To Date</label>
                                    <Calendar
                                        id="toDate"
                                        name="toDate"
                                        minDate={usageformik.values.fromDate || new Date()}
                                        maxDate={new Date()}
                                        value={usageformik.values.toDate}
                                        onChange={(e) => usageformik.setFieldValue('toDate', e.value)}
                                        showIcon
                                        dateFormat="yy-mm-dd"
                                        className={usageformik.errors.toDate && usageformik.touched.toDate ? 'p-invalid' : ''}
                                    />
                                    {usageformik.errors.toDate && usageformik.touched.toDate && (
                                        <small className="p-error">{usageformik.errors.toDate}</small>
                                    )}
                                </div>

                                <div className="field mb-2 col-6 md:col-2">
                                    <label htmlFor="branches">Branches</label>
                                    <MultiSelect
                                        inputId="preferredbranch"
                                        name="preferredbranch"
                                        value={usageformik.values.branches}
                                        options={branch}
                                        optionLabel="branch_name"
                                        placeholder="Select Branch"
                                        onChange={handleChange}
                                    />

                                    {usageformik.errors.branches && usageformik.touched.branches && (
                                        <small className="p-error">{usageformik.errors.branches}</small>
                                    )}
                                </div>

                                <div className="field mb-2 col-6 md:col-2">
                                    <label htmlFor="branches">view</label>
                                    <Button
                                        label="View"
                                        icon="pi pi-eye"
                                        className="p-button-primary"
                                        onClick={() => handleActionusage('view')}
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
                                    <label htmlFor="branches">Download</label>
                                    <Button
                                        label="Download"
                                        icon="pi pi-file-excel"
                                        className="p-button-success"
                                        onClick={() => handleActionusage('download')}

                                    />
                                </div>


                            </div>
                        </form>
                        <div style={{ marginTop: '50px' }}></div>
                        {/* Display chart if reportData exists */}
                        {chartDataUsage && (
                            <div className="chart-container">
                                <Bar data={chartDataUsage} />
                            </div>
                        )}
                        <div style={{ marginTop: '50px' }}></div>

                        {reportData && reportData.length > 0 && (
                            <DataTable value={reportData} paginator rows={10} className="p-datatable-gridlines ">
                                <Column style={{ minWidth: "12rem" }} field="checkInDateTime" header="Check In Date" />
                                <Column style={{ minWidth: "12rem" }} field="checkOutDateTime" header="Check Out Date" />
                                <Column style={{ minWidth: "12rem" }} field="packageCode" header="Package Code" />
                                <Column style={{ minWidth: "12rem" }} field="packageName" header="Package Name" />
                                <Column style={{ minWidth: "12rem" }} field="homeBranchCode" header="Home Branch Code" />
                                <Column style={{ minWidth: "12rem" }} field="homeBranchName" header="Home Branch Name" />
                                <Column style={{ minWidth: "12rem" }} field="checkInBranchCode" header="Check In Branch Code" />
                                <Column style={{ minWidth: "12rem" }} field="checkInBranchName" header="Check In Branch Name" />
                                <Column style={{ minWidth: "12rem" }} field="memberPhone" header="Member Phone" />
                                <Column style={{ minWidth: "12rem" }} field="memberName" header="Member Name" />
                                <Column style={{ minWidth: "12rem" }} field="creditUsed" header="Credit Used" />
                                <Column style={{ minWidth: "12rem" }} field="percentageOwnBranch" header="Percentage Own Branch" />
                                <Column style={{ minWidth: "12rem" }} field="priceOwnBranch" header="Price Own Branch" />
                                <Column style={{ minWidth: "12rem" }} field="priceCheckInBranch" header="Price Check In Branch" />
                                <Column style={{ minWidth: "12rem" }} field="purchaseDateTime" header="Purchase Date" />
                                <Column style={{ minWidth: "12rem" }} field="usageMode" header="Usage Mode" />
                                <Column style={{ minWidth: "12rem" }} field="checkInMode" header="Check In Mode" />
                            </DataTable>
                        )}

                    </div>
                </div>

            </Panel>


        </div>
    );



}


