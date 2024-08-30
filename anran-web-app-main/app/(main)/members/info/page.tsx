"use client";
import type { Demo } from "@/types";
import { useRouter } from "next/navigation";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from 'primereact/toast';
import Moment from 'react-moment';
import API from '@/anran/service/api';
import { Tag } from 'primereact/tag';

function MembersInfo() {
    let networkTimeout: any = null;
    const router = useRouter();
    const dt = useRef(null);
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [data, setData] = useState<any[]>([]);
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: undefined,
        sortOrder: null,
        filters: {
            member_date: { value: null, matchMode: FilterMatchMode.DATE_IS },
            name: { value: null, matchMode: FilterMatchMode.CONTAINS },
            Mobile: { value: null, matchMode: FilterMatchMode.CONTAINS },
            email: { value: null, matchMode: FilterMatchMode.CONTAINS },
            gender: { value: null, matchMode: FilterMatchMode.CONTAINS },
            branch: { value: null, matchMode: FilterMatchMode.CONTAINS },
        }
    });

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
                filters: lazyState.filters,
                sortField: lazyState.sortField || undefined,
                sortOrder: lazyState.sortOrder
            }
            API.post('members/findall', q).then(function (response: any) {
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
        setlazyState(prevState => ({
            ...prevState,
            first: event.first,
            rows: event.rows,
            filters: prevState.filters,
            sortField: prevState.sortField,
            sortOrder: prevState.sortOrder
        }));
    };

    const onFilter = (event: any) => {
        setlazyState(prevState => ({ ...prevState, first: 0, filters: event.filters }));

    };

    const onSort = (event: any) => {
        setlazyState(prevState => ({
            ...prevState,
            sortField: event.sortField || undefined,
            sortOrder: event.sortOrder
        }));
    };

    const clearFilters = () => {
        setlazyState(prevState => ({
            ...prevState,
            filters: {
                member_date: { value: null, matchMode: FilterMatchMode.DATE_IS },
                name: { value: null, matchMode: FilterMatchMode.CONTAINS },
                gender: { value: null, matchMode: FilterMatchMode.CONTAINS },
                Mobile: { value: null, matchMode: FilterMatchMode.CONTAINS },
                email: { value: null, matchMode: FilterMatchMode.CONTAINS },
                branch: { value: null, matchMode: FilterMatchMode.CONTAINS }
            },
            first: 0  // Reset pagination to the first page
        }));
    };


    const renderHeader = () => {
        return (
            <div>
                <div className="flex flex-wrap gap-2 align-items-center justify-content-between">

                    <Button
                        type="button"
                        icon="pi pi-user-plus"
                        label="Add New"
                        className="w-full sm:w-auto flex-order-0 sm:flex-order-1"
                        outlined
                        onClick={() => router.push("/members/create")}
                    />
                    {/* <Button type="button" icon="pi pi-filter-slash"  className="w-full sm:w-auto flex-order-0 sm:flex-order-1" label="Clear" outlined onClick={clearFilters} /> */}
                </div>
            </div>
        );
    };



    const nameBodyTemplate = (d: any) => {

        return (
            <>
                <span className="p-column-title">Date</span>
                <Moment format="DD/MM/YYYY">
                    {formatDate(d.member_date)}
                </Moment><br />
                {!d.fullregister && (<Tag value="Partial Register"></Tag>)}


            </>
        );
    };

    const packagedate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Date</span>
                {d.package_date?
                <Moment format="DD/MM/YYYY">
                    {d.package_date && formatDate(d.package_date)}
                </Moment>:''}
            </>
        );
    };

    const checkindate = (d: any) => {

        return (
            <>
                <span className="p-column-title">Date</span>
                {d.checkin_date?
                <Moment format="DD/MM/YYYY">
                    {d.checkin_date && formatDate(d.checkin_date)}
                </Moment>:''
    }
            </>
        );
    };

    const branchNameBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {d.member_name}
            </>
        );
    };

    const mobilenoBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Mobile No</span>
                {d.mobileNumber}
            </>
        );
    };

    const genderBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Gender</span>
                {d.gender}
            </>
        );
    };

    const preferredbranchBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Preferred branch</span>
                {d.preferredbranch && d.preferredbranch.branch_name}
            </>
        );
    };


    const formatDate = (value: Date) => {
        return new Date(value).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });


    };


    const header = renderHeader();

    const editData = (d: any) => {
        router.push("/members/edit/" + d._id);
    };

    const activityData = (d: any) => {
        router.push("/members/summary/" + d._id);
    };

    const actionBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editData(rowData)} />
                <Button icon="pi pi-list" rounded outlined className="mr-2" onClick={() => activityData(rowData)} />
            </React.Fragment>
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
                onSort={onSort}
                sortField={lazyState.sortField}
                sortOrder={lazyState.sortOrder}
                loading={loading}
            >
                <Column
                    field="member_date"
                    header="Date"
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    body={nameBodyTemplate}
                    headerClassName="white-space-nowrap"
                    sortable


                ></Column>
                <Column
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    field="name"
                    header="Name"
                    sortable
                    body={branchNameBodyTemplate}
                    headerClassName="white-space-nowrap"

                ></Column>

                <Column
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    field="Mobile"
                    header="Mobile No"

                    body={mobilenoBodyTemplate}
                    headerClassName="white-space-nowrap"
                ></Column>

                <Column
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    field="email"
                    header="E-mail"

                    headerClassName="white-space-nowrap"

                ></Column>

                <Column
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    field="gender"
                    header="Gender"

                    body={genderBodyTemplate}
                    headerClassName="white-space-nowrap"

                ></Column>

                <Column
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    field="branch"
                    header="Preferred branch"

                    body={preferredbranchBodyTemplate}
                    headerClassName="white-space-nowrap"

                ></Column>


                <Column
                    field="package_date"
                    header="Last Package date"
                    body={packagedate}
                    headerClassName="white-space-nowrap"
                ></Column>

                <Column
                    field="checkin_date"
                    header="Last Checkin date"
                    body={checkindate}
                    headerClassName="white-space-nowrap"
                ></Column>

                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
            </DataTable>
        </div>
    );
}

export default MembersInfo;
