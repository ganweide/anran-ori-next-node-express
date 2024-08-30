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
import { Roles } from "@/anran/service/roles";


function MessagesSummary() {
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
        if (!(userRole && userRole.length > 0 && userRole.includes(Roles.admin_message_view))) {
            router.push("/accessdenied");
        }
        if ((userRole && userRole.length > 0 && userRole.includes(Roles.admin_message_create))) {
            setCreate(true);
        }
        if ((userRole && userRole.length > 0 && userRole.includes(Roles.admin_message_delete))) {
            setUpdate(true);
        }
        loadLazyData();
    }, [lazyState]);

    const showImage = (d: any) => {
        return (
            <>
                <span className="p-column-title">Viewer</span>
                <Image src={d.image_url} alt={d.image_data_url} width="50" preview height="50" />
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


    const htmlBodyTemplate = (d: any) => {
        return <div dangerouslySetInnerHTML={{ __html: d.msg }} />;
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
                        onClick={() => router.push("/messages/create")}
                    /> : ''}
                </div>
            </div>
        );
    };

    const nameBodyTemplate = (d: any) => {
        return <div dangerouslySetInnerHTML={{ __html: d.msg }} />;
        // const sanitizedHtmlContent = DOMPurify.sanitize(d.msg);
        // <div dangerouslySetInnerHTML={{ __html:purify.sanitize(d.msg, { sanitize: true }) }} />

    };

    const typeBodyTemplate = (d: any) => {
        return <div dangerouslySetInnerHTML={{ __html: d.msg_type }} />;
    };

    const header = renderHeader();

    const deleteData = (d: any) => {
        router.push("/messages/edit/" + d._id);
    };

    const actionBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => deleteData(rowData)} />
            </React.Fragment>
        );
    };

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
            API.post('messages/findall', q).then(function (response: any) {
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
                    field="msg"
                    filter
                    sortable
                    filterField="msg"
                    filterPlaceholder="Filter by Message"
                    showFilterMenu={false}
                    showClearButton={false}
                    header="Message"
                    body={nameBodyTemplate}
                    headerClassName="white-space-nowrap"
                    style={{ width: "50%" }}
                ></Column>
                <Column
                    field="msg_type"
                    header="Type"
                    filter
                    sortable
                    filterField="msg_type"
                    filterPlaceholder="Filter by Type"
                    showFilterMenu={false}
                    showClearButton={false}
                    body={typeBodyTemplate}
                    headerClassName="white-space-nowrap"
                    style={{ width: "50%" }}
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

export default MessagesSummary;
