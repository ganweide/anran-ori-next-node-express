"use client";
import type { Demo } from "@/types";
import { useRouter } from "next/navigation";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from 'primereact/toast';
import API from '@/anran/service/api';
import { Roles } from "@/anran/service/roles";

function BranchSummary() {
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [data, setData] = useState<any[]>([]);
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: 'sortorder',
        sortOrder: null,
        filters: {}
    });

    const router = useRouter();

    const dt = useRef(null);
    const toast = useRef<Toast>(null);
    let networkTimeout: any = null;
    const [create, setCreate] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);

    useEffect(() => {
        const userRole = localStorage.getItem('roles');
        if (!(userRole && userRole.length > 0 && userRole.includes(Roles.admin_package_view))) {
            router.push("/accessdenied");
        }
        if ((userRole && userRole.length > 0 && userRole.includes(Roles.admin_package_create))) {
            setCreate(true);
        }
        if ((userRole && userRole.length > 0 && userRole.includes(Roles.admin_package_update))) {
            setUpdate(true);
        }
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
                sortField: lazyState.sortField,
                sortOrder: lazyState.sortOrder
            }
            API.post('package/findall', q).then(function (response: any) {
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

    const onSort = (event: any) => {
        setlazyState(prevState => ({
            ...prevState,
            sortField: event.sortField || undefined,
            sortOrder: event.sortOrder
        }));
    };

    const onFilter = (event: any) => {
        setlazyState(prevState => ({ ...prevState, first: 0, filters: event.filters }));
    };


    const renderHeader = () => {
        return (
            <div>
                <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                    <span></span>
                    {create ? <Button
                        type="button"
                        icon="pi pi-user-plus"
                        label="Add New"
                        className="w-full sm:w-auto flex-order-0 sm:flex-order-1"
                        outlined
                        onClick={() => router.push("/packages/create")}
                    /> : ''}
                </div>
            </div>
        );
    };

    const nameBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Package Name</span>
                {d.package_name}
            </>
        );
    };

    const nooftimeBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">No of Times</span>
                {d.unlimitedyear === true ? 'Unlimited' : d.noof_times}
            </>
        );
    };

    const priceBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {'RM' + d.price}
            </>
        );
    };

    const header = renderHeader();

    const editData = (d: any) => {
        router.push("/packages/edit/" + d._id);
    };


    const statusBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                {d.status_active ? 'Show' : 'Hide'}
            </>
        );
    };


    const actionBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editData(rowData)} />
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
                sortOrder={lazyState.sortOrder}
                sortField={lazyState.sortField}
                loading={loading}
            >
                <Column
                    field="package_name"
                    header="Package Name"
                    filter
                    sortable
                    filterField="package_name"
                    filterPlaceholder="Filter by Name"
                    showFilterMenu={false}
                    showClearButton={false}
                    body={nameBodyTemplate}
                    headerClassName="white-space-nowrap"
                    style={{ width: "30%" }}
                ></Column>
                <Column
                    field="price"
                    header="Price"
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    body={priceBodyTemplate}
                    headerClassName="white-space-nowrap"
                    style={{ width: "30%" }}
                ></Column>
                <Column
                    field="noof_times"
                    header="No Of Times"
                    showFilterMenu={false}
                    showClearButton={false}
                    body={nooftimeBodyTemplate}
                    headerClassName="white-space-nowrap"
                    style={{ width: "30%" }}
                ></Column>
                <Column
                    field="sortorder"
                    header="Order"
                    filter
                    sortable
                    filterField="sortorder"
                    filterPlaceholder="Filter by Order"
                    showFilterMenu={false}
                    showClearButton={false}
                    headerClassName="white-space-nowrap"
                    style={{ width: "50%" }}
                ></Column>
                <Column
                    field="status_active"
                    header="Status"
                    filter
                    sortable
                    filterField="status_active"
                    filterPlaceholder="Filter by Status"
                    showFilterMenu={false}
                    showClearButton={false}
                    body={statusBodyTemplate}
                    headerClassName="white-space-nowrap"
                    style={{ width: "50%" }}
                ></Column>
                <Column hidden={!update} body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
            </DataTable>
        </div>
    );
}

export default BranchSummary;
