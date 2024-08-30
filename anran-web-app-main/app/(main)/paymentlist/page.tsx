"use client";
import React, { useEffect, useState, useRef } from "react";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Button } from "primereact/button";
import API from '@/anran/service/api';
import { useRouter } from "next/navigation";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import Moment from 'react-moment';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Tag } from 'primereact/tag';

const Customer = () => {
    let networkTimeout: any = null;
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const dt = useRef(null);
    const [pitotalRecords, setPitotalRecords] = useState(0);
    const [pidata, setPidata] = useState<any[]>([]);
    const [pilazyState, setPilazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: 'package_date',
        sortOrder: null,
        filters: {
            package_date: { value: null, matchMode: FilterMatchMode.DATE_IS },
            package: { value: null, matchMode: FilterMatchMode.CONTAINS },
            member: { value: null, matchMode: FilterMatchMode.CONTAINS },
        }
    });

    const loadPiLazyData = () => {
        setLoading(true);
        if (networkTimeout) {
            clearTimeout(networkTimeout);
        }
        //imitate delay of a backend call
        networkTimeout = setTimeout(() => {
            const q = {
                id: null,
                first: pilazyState.first,
                rows: pilazyState.rows,
                filters: pilazyState.filters,
                sortField: pilazyState.sortField,
                sortOrder: pilazyState.sortOrder
            }
            API.post('memberpackage/findAll', q).then(function (response: any) {
                setPidata(response.data.data);
                setPitotalRecords(response.data.totalRecords);
            }).catch(function (error) {
                console.log(error);
            }).finally(() => {
                setLoading(false);
            });
        }, Math.random() * 1000 + 250);
    };

    const onPage = (event: any) => {
        setPilazyState(prevState => ({
            ...prevState,
            first: event.first,
            rows: event.rows,
            filters: prevState.filters,
            sortField: prevState.sortField,
            sortOrder: prevState.sortOrder
        }));
    };

    const onFilter = (event: any) => {
        setPilazyState(prevState => ({ ...prevState, first: 0, filters: event.filters }));
    };

    const onSort = (event: any) => {
        setPilazyState(prevState => ({
            ...prevState,
            sortField: event.sortField || undefined,
            sortOrder: event.sortOrder
        }));
    };


    useEffect(() => {
        loadPiLazyData();
    }, [pilazyState]);



    const handleDownload = async (id: any) => {
        try {
            const response = await API.get('receipt/generate-receipt/' + id, {
                responseType: 'arraybuffer'
            });
            const pdfDoc = await PDFDocument.load(response.data);
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'invoice.pdf';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the receipt:', error);
        }
    };

    const dateBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Date</span>
                <Moment format="DD/MM/YYYY">
                    {d.package_date}
                </Moment>

            </>
        );
    };


    const membername = (d: any) => {
        return (
            <>
                <span className="p-column-title">Member Name</span>
                {d.member.member_name}
            </>
        );

    };

    const branchName = (d: any) => {
        const branchName = d.branch?.branch_name ?? 'N/A';
        return (
            <>
                <span className="p-column-title">Branch Name</span>
                {branchName}
            </>
        );
    };




    const price = (d: any) => {
        return (
            <>
                <span className="p-column-title">Price(RM)</span>
                {'RM ' + d.price}
            </>
        );

    };

    const packageHeader = () => {
        return (
            <div>
                <div className="flex flex-wrap gap-2 align-items-center justify-content-between">

                    <Button
                        type="button"
                        icon="pi pi-user-plus"
                        label="Add New"
                        className="w-full sm:w-auto flex-order-0 sm:flex-order-1"
                        outlined
                        onClick={() => router.push("/members/createPackage")}
                    />
                </div>
            </div>
        );
    };

    const packagecre = packageHeader();


    return (
        <div className="grid">
            <div className="col-12 lg:col-12" >
                <div className="card">
                    <div className="flex flex-column md:flex-row md:align-items-start md:justify-content-between mb-3">
                        <div className="text-900 text-xl font-semibold mb-3 md:mb-0">
                            Member Package Details
                        </div>
                    </div>
                    <DataTable
                        ref={dt}
                        value={pidata}
                        header={packagecre}
                        lazy filterDisplay="row" dataKey="_id" paginator
                        first={pilazyState.first} rows={10}
                        totalRecords={pitotalRecords} onPage={onPage}
                        onFilter={onFilter}
                        onSort={onSort}
                        sortField={pilazyState.sortField}
                        sortOrder={pilazyState.sortOrder}
                        loading={loading}
                        emptyMessage="Not found.">
                        <Column
                            field="package_date"
                            header="Date"
                            filter
                            sortable
                            filterField="package_date"
                            filterPlaceholder="Filter by date"
                            showFilterMenu={false}
                            showClearButton={false}
                            body={dateBodyTemplate}
                            headerClassName="white-space-nowrap"
                        />



                        <Column
                            field="invoicenumber"
                            header="Invoice No"
                            filter
                            sortable
                            filterPlaceholder="Search by mo"
                            style={{ minWidth: "12rem" }}
                            showFilterMenu={false}
                            showClearButton={false}
                        />

                        <Column
                            field="purchasetype"
                            header="Purchase Type"
                            filter
                            sortable
                            filterPlaceholder="Search by mo"
                            style={{ minWidth: "12rem" }}
                            showFilterMenu={false}
                            showClearButton={false}
                        />

                        <Column
                            field="package"
                            header="Package Name"
                            filter
                            sortable
                            filterPlaceholder="Search by name"
                            style={{ minWidth: "12rem" }}
                            showFilterMenu={false}
                            showClearButton={false}
                        />
                        <Column
                            field="member"
                            header="Member Name"
                            body={membername}
                            filter
                            sortable
                            filterPlaceholder="Search by name"
                            style={{ minWidth: "12rem" }}
                            showFilterMenu={false}
                            showClearButton={false}
                        />
                        <Column
                            field="branch"
                            header="Branch Name"
                            body={branchName}
                            filter
                            sortable
                            filterPlaceholder="Search by name"
                            style={{ minWidth: "12rem" }}
                            showFilterMenu={false}
                            showClearButton={false}
                        />
                        <Column
                            field="quantity"
                            header="Quantity"
                            style={{ minWidth: "10rem" }}
                        />
                        <Column
                            field="times"
                            header="Times"
                            style={{ minWidth: "10rem" }}
                        />

                        <Column
                            field="price"
                            header="Price"
                            body={price}
                            style={{ minWidth: "10rem" }}
                        />
                        <Column
                            body={(rowData) => (
                                <Button
                                    label="Invoice"
                                    icon="pi pi-download"
                                    onClick={() => handleDownload(rowData._id)}
                                />
                            )}
                            header="Actions"
                        />
                    </DataTable>
                </div>
            </div>
        </div >
    );
}

export default Customer;
