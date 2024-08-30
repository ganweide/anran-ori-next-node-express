"use client";
import { useRouter } from "next/navigation";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from 'primereact/toast';
import API from '@/anran/service/api';
import Moment from 'react-moment';
import { Calendar } from "primereact/calendar";

function StaffSummary() {
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [data, setData] = useState<any[]>([]);
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            att_type: { value: null, matchMode: FilterMatchMode.CONTAINS },
            att_date: { value: null, matchMode: FilterMatchMode.CONTAINS },
            staff: { value: null, matchMode: FilterMatchMode.CONTAINS },
        }
    });
    const router = useRouter();
    const dt = useRef(null);
    const toast = useRef(null);
    let networkTimeout: any = null;

    useEffect(() => {
        loadLazyData();
    }, [lazyState]);

    const loadLazyData = () => {
        setLoading(true);
        if (networkTimeout) {
            clearTimeout(networkTimeout);
        }
        //imitate delay of a backend call
        networkTimeout = setTimeout(() => {
            const q = {
                first: lazyState.first,
                rows: lazyState.rows,
                filters: lazyState.filters
            }
            API.post('attendance/findall', q).then(function (response: any) {
                setData(response.data.data);
                setTotalRecords(response.data.totalRecords);
            }).catch(function (error) {
                console.log(error);
            }).finally(() => {
                setLoading(false);
            });
        }, Math.random() * 1000 + 250);
    };

    const onPage = (event: any) => {
        setlazyState(event);
    };

    const onFilter = (event: any) => {
        event['first'] = 0;
        setlazyState(event);
    };

    const renderHeader = () => {
        return (
            <div>
                <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                    <Button
                        type="button"
                        icon="pi pi-print"
                        label="Report"
                        className="w-full sm:w-auto flex-order-0 sm:flex-order-1"
                        outlined
                        onClick={() => router.push("/staff/attendence")}
                    />
                    <Button
                        type="button"
                        icon="pi pi-user-plus"
                        label="Log"
                        className="w-full sm:w-auto flex-order-0 sm:flex-order-1"
                        outlined
                        onClick={() => router.push("/attendance/create")}
                    />
                </div>
            </div>
        );
    };

    const typeBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Present/Absent</span>
                {d.att_type}
            </>
        );
    };

    const dateBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Date</span>
                <Moment format="DD/MM/YYYY">
                    {d.att_date}
                </Moment>
            </>
        );
    };


    const staffBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Staff</span>
                {d.staff.username}
            </>
        );
    };

    const header = renderHeader();


    const dateFilterTemplate = (option: any) => {
        return (
            <Calendar placeholder="Select Date" value={option.value} onChange={(e) => option.filterApplyCallback(e.value)} />
        );
    };


    return (
        <div className="card">
            <Toast ref={toast} />
            <DataTable
                ref={dt}
                value={data}
                header={header}
                lazy filterDisplay="row" dataKey="_id" paginator
                first={lazyState.first} rows={10}
                totalRecords={totalRecords} onPage={onPage}
                onFilter={onFilter}
                loading={loading}
            >
                <Column
                    field="att_date"
                    header="Date"
                    body={dateBodyTemplate}
                    headerClassName="white-space-nowrap"
                    style={{ width: "25%" }}
                ></Column>
                <Column
                    field="staff"
                    header="Staff"
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    body={staffBodyTemplate}
                    headerClassName="white-space-nowrap"
                    style={{ width: "25%" }}
                ></Column>
                <Column
                    field="att_type"
                    header="Present/Absent"
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    body={typeBodyTemplate}
                    headerClassName="white-space-nowrap"
                    style={{ width: "25%" }}
                ></Column>
            </DataTable>
        </div>
    );
}

export default StaffSummary;
