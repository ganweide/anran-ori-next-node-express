"use client";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from 'primereact/toast';
import API from '@/anran/service/api';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { BlockUI } from 'primereact/blockui';
import { Image } from 'primereact/image';
import Moment from 'react-moment';
import { Roles } from "@/anran/service/roles";

function BannerSummary() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const router = useRouter();
    const dt = useRef(null);
    const toast = useRef(null);
    const [create, setCreate] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: 'sortorder',
        sortOrder: null,
        filters: {}
    });
    let networkTimeout: any = null;


    useEffect(() => {
        const userRole = localStorage.getItem('roles');
        if (!(userRole && userRole.length > 0 && userRole.includes(Roles.admin_banner_view))) {
            router.push("/accessdenied");
        }
        if ((userRole && userRole.length > 0 && userRole.includes(Roles.admin_banner_create))) {
            setCreate(true);
        }
        if ((userRole && userRole.length > 0 && userRole.includes(Roles.admin_banner_delete))) {
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
            API.post('banner/findall', q).then(function (response: any) {
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
                    <span>
                    </span>
                    {create ? <Button
                        type="button"
                        icon="pi pi-user-plus"
                        label="Add New"
                        className="w-full sm:w-auto flex-order-0 sm:flex-order-1"
                        outlined
                        onClick={() => router.push("/banner/create")}
                    /> : ''}
                </div>
            </div>
        );
    };

    const nameBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {d.image_data_url}
            </>
        );
    };

    const showImage = (d: any) => {
        return (
            <>
                <span className="p-column-title">Viewer</span>
                <Image src={d.image_url} alt={d.image_data_url} width="50" preview height="50" />
            </>
        );
    };

    const header = renderHeader();

    const deleteData = (d: any) => {
        router.push("/banner/edit/" + d._id);
    };

    const actionBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => deleteData(rowData)} />
            </React.Fragment>
        );
    };

    const dateBodyeffective = (d: any) => {
        return (
            <>
                <span className="p-column-title">Date</span>
                {d.startdate ? <Moment format="DD/MM/YYYY">
                    {d.startdate}
                </Moment> : ''}
            </>
        );
    };

    const statusBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                {d.status_active ? 'Show' : 'Hide'}
            </>
        );
    };

    const dateBodyEnd = (d: any) => {
        return (
            <>
                <span className="p-column-title">Date</span>
                {d.enddate ? <Moment format="DD/MM/YYYY">
                    {d.enddate}
                </Moment> : ''}
            </>
        );
    };




    return (
        <div className="card">
            <ConfirmDialog />
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
                    field="image_data_url"
                    header="Name"
                    filter
                    sortable
                    filterField="image_data_url"
                    filterPlaceholder="Filter by Name"
                    showFilterMenu={false}
                    showClearButton={false}
                    body={nameBodyTemplate}
                    headerClassName="white-space-nowrap"
                    style={{ width: "50%" }}
                ></Column>

                <Column
                    field="startdate"
                    header="Effective date"
                    body={dateBodyeffective}
                    headerStyle={{ minWidth: "12rem" }}
                ></Column>

                <Column
                    field="enddate"
                    header="End Date"
                    body={dateBodyEnd}
                    headerStyle={{ minWidth: "12rem" }}
                ></Column>

                <Column
                    field="image_url"
                    header="View"
                    body={showImage}
                    headerClassName="white-space-nowrap"
                    style={{ width: "50%" }}
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

export default BannerSummary;
