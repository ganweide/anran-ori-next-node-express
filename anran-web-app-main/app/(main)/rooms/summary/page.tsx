"use client";
import type { Demo } from "@/types";
import { useRouter } from "next/navigation";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from 'primereact/toast';
import API from '@/anran/service/api';
import { Roles } from "@/anran/service/roles";
import { InputNumber } from "primereact/inputnumber";

function RoomsSummary() {
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
        if (!(userRole && userRole.length > 0 && userRole.includes(Roles.admin_room_view))) {
            router.push("/accessdenied");
        }
        if ((userRole && userRole.length > 0 && userRole.includes(Roles.admin_room_create))) {
            setCreate(true);
        }
        if ((userRole && userRole.length > 0 && userRole.includes(Roles.admin_room_update))) {
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
            API.post('rooms/findall', q).then(function (response: any) {
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
                    <span >
                    </span>
                    {create ? <Button
                        type="button"
                        icon="pi pi-user-plus"
                        label="Add New"
                        className="w-full sm:w-auto flex-order-0 sm:flex-order-1"
                        outlined
                        onClick={() => router.push("/rooms/create")}
                    /> : ''}
                </div>
            </div>
        );
    };

    const noofPersonsBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">No Of Persons</span>
                {d.noof_persons}
            </>
        );
    };

    const floorBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Floor</span>
                {d.floor && d.floor.floor_no && d.floor.floor_no}
            </>
        );
    };

    const genderBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Gender</span>
                {d.room_gender}
            </>
        );
    };



    const roomBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Room No</span>
                {d.room_no}
            </>
        );
    };

    const branchNameBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Branch Name</span>
                {d.branch.branch_name}
            </>
        );
    };

    const header = renderHeader();

    const editData = (d: any) => {
        router.push("/rooms/edit/" + d._id);
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

    const isPositiveInteger = (val: any) => {
        let str = String(val);
        str = str.trim();
        if (!str) {
            return false;
        }
        str = str.replace(/^0+/, '') || '0';
        let n = Math.floor(Number(str));
        return n !== Infinity && String(n) === str && n >= 0;
    };

    const onCellEditComplete = (e: any) => {
        let { rowData, newValue, field, originalEvent: event } = e;
        if (isPositiveInteger(newValue)) {
            rowData[field] = newValue;
            API.put('rooms/' + rowData._id, rowData).then(function (response) {
                if (toast && toast.current) {
                    toast.current.show({ severity: 'info', summary: 'Status', detail: 'Rooms Updated Successfully!!!', life: 3000 });
                }
            });
        } else {
            event.preventDefault();
        }
    };

    const cellEditor = (options: any) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} locale="en-US" onKeyDown={(e) => e.stopPropagation()} />;
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <DataTable
                ref={dt}
                editMode="cell"
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
                    field="branch"
                    header="Branch"
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    body={branchNameBodyTemplate}
                    headerClassName="white-space-nowrap"
                    style={{ width: "20%" }}
                ></Column>
                <Column
                    field="floor"
                    header="Floor"
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    body={floorBodyTemplate}
                    headerClassName="white-space-nowrap"
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    field="room_no"
                    header="Room No"
                    filter
                    sortable
                    filterField="room_no"
                    showFilterMenu={false}
                    showClearButton={false}
                    body={roomBodyTemplate}
                    headerClassName="white-space-nowrap"
                    style={{ width: "20%" }}
                ></Column>
                <Column
                    field="noof_persons"
                    header="No of Persons"
                    filter
                    sortable
                    filterField="noof_persons"
                    showFilterMenu={false}
                    showClearButton={false}
                    body={noofPersonsBodyTemplate}
                    headerClassName="white-space-nowrap"
                    style={{ width: "20%" }}
                ></Column>

                <Column
                    field="room_gender"
                    header="Gender"
                    filter
                    sortable
                    filterField="room_gender"
                    filterPlaceholder="Gender"
                    showFilterMenu={false}
                    showClearButton={false}
                    body={genderBodyTemplate}
                    headerClassName="white-space-nowrap"
                    style={{ width: "20%" }}
                ></Column>
                <Column
                    field="sortorder"
                    header="Order"
                    filter
                    sortable
                    editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}
                    filterField="sortorder"
                    filterPlaceholder="Filter by Order"
                    showFilterMenu={false}
                    showClearButton={false}
                    headerClassName="white-space-nowrap"
                    style={{ width: "50%" }}
                ></Column>
                <Column
                    field="status_active"
                    key="status_active"
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

export default RoomsSummary;
