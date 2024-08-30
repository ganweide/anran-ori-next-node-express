"use client";
import React, { useEffect, useState, useRef } from "react";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Button } from "primereact/button";
import API from '@/anran/service/api';
import { useRouter } from "next/navigation";
import Moment from 'react-moment';
import { Toast } from 'primereact/toast'
import { FilterMatchMode } from "primereact/api";
import { dateAsString, stringasUTC } from '@/anran/service/dateutils';

const Customer = () => {
    const toast = useRef<Toast>(null);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const dt = useRef(null);
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [totalRecords, setTotalRecords] = useState(0);

    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: 'start',
        sortOrder: null,
        filters: {
            member: { value: null, matchMode: FilterMatchMode.CONTAINS },
            package: { value: null, matchMode: FilterMatchMode.CONTAINS },
            checkin_date: { value: null, matchMode: FilterMatchMode.CONTAINS },
        }
    });
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
                filters: lazyState.filters,
                sortField: lazyState.sortField,
                sortOrder: lazyState.sortOrder
            }
            API.post('booking/findall', q).then(function (response: any) {
                const bookings = response.data.data.map((booking: any) => {
                    return {
                        ...booking,
                        start: booking.start ? stringasUTC(booking.start) : null,
                        end: booking.end ? stringasUTC(booking.end) : null,
                        checkin_date: booking.checkin_date ? stringasUTC(booking.checkin_date) : null
                    };
                });
                setData(bookings);
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

    const dateBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Booking Date</span>
                <Moment format="DD/MM/YYYY">
                    {formatDate(d.start)}
                </Moment>

            </>
        );
    };




    const checkdateBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Check Date</span>
                {d.checkin_date ? (
                    <Moment format="DD/MM/YYYY">
                        {formatDate(d.checkin_date)}
                    </Moment>
                ) : (
                    ''
                )}
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

    const membername = (d: any) => {
        return (
            <>
                <span className="p-column-title">Member Name</span>
                {d.member.member_name}
            </>
        );

    };




    const roomname = (d: any) => {
        return (
            <>
                <span className="p-column-title">Room Name</span>
                {d.room.room_no}
            </>
        );
    };

    const brancename = (d: any) => {
        return (
            <>
                <span className="p-column-title">Room Name</span>
                {d.branch.branch_name}
            </>
        );
    };

    const floorname = (d: any) => {
        return (
            <>
                <span className="p-column-title">Room Name</span>
                {d.floor ? d.floor.floor_no : ''}
            </>
        );
    };





    const bookingTime = (d: any) => {
        return (
            <>
                <span className="p-column-title">Time</span>
                <Moment format="HH:mm">
                    {d.start}
                </Moment>
                -
                <Moment format="HH:mm">
                    {d.end}
                </Moment>
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

    const statusBodyTemplate = (rowData: any) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                {rowData.bookingstatus}
            </>
        );
    }

    const packagecre = packageHeader();

    const actionBodyTemplate = (rowData: any) => {
        if (rowData.bookingstatus === 'Booked') {
            return (
                <React.Fragment>
                    <Button icon="pi pi-check" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                    <Button icon="pi pi-times" className="p-button-rounded p-button-danger mr-2" onClick={() => cancelBooking(rowData)} />
                </React.Fragment>
            );
        }
    }

    const editProduct = (book: any) => {
        API.get('booking/' + book._id).then(function (response: any) {
            response.bookingstatus = 'CheckIn';
            response.checkin_date = new Date();
            API.get('memberpackage/findid/' + book.package).then(function (pack: any) {
                pack.data.balance = pack.data.balance - book.pax;
                pack.data.used = pack.data.used + book.pax;
                API.put('memberpackage/' + book.package, pack.data).then(function (response) {
                }).catch(function (error) {
                    console.log(error);
                });
            }).catch(function (error) {
                console.log(error);
            });


            API.put('booking/' + book._id, response).then(function (response) {
                if (toast && toast.current) {
                    loadLazyData();
                    toast.current.show({ severity: 'info', summary: 'Status', detail: 'CheckIn Updated Successfully!!!', life: 3000 });
                }
            }).catch(function (error) {
                if (toast && toast.current) {
                    toast.current.show({ severity: 'error', summary: 'Status', detail: 'CheckIn Not able to Update', life: 3000 });
                }
            });
        }).catch(function (error) {
            console.log(error);
        });

    }


    const cancelBooking = async (book: any) => {
        let id = book._id
        await API.post('booking/cancel', { id }).then(function (response: any) {
            if (toast && toast.current) {
                loadLazyData();
                toast.current.show({ severity: 'info', summary: 'Status', detail: 'CheckIn Updated Successfully!!!', life: 3000 });
            }
        }).catch(function (error) {
            if (toast && toast.current) {
                toast.current.show({ severity: 'error', summary: 'Status', detail: 'CheckIn Not able to Update', life: 3000 });
            }
        });
    }



    return (
        <div className="grid">
            <div className="col-12 lg:col-12" >
                <div className="card">
                    <Toast ref={toast} />
                    <div className="flex flex-column md:flex-row md:align-items-start md:justify-content-between mb-3">
                        <div className="text-900 text-xl font-semibold mb-3 md:mb-0">
                            Member Booked and Checking Details
                        </div>

                    </div>
                    <DataTable
                        ref={dt}
                        value={data}
                        lazy filterDisplay="row" dataKey="_id" paginator
                        first={lazyState.first} rows={10}
                        totalRecords={totalRecords} onPage={onPage}
                        onFilter={onFilter}
                        onSort={onSort}
                        sortField={lazyState.sortField}
                        sortOrder={lazyState.sortOrder}
                        loading={loading}>

                        <Column
                            field="start"
                            header="Booking Date"
                            filter
                            sortable
                            filterField="start"
                            filterPlaceholder="Filter by date"
                            showFilterMenu={false}
                            showClearButton={false}
                            body={dateBodyTemplate}
                            headerClassName="white-space-nowrap"
                        />

                        <Column
                            field="transaction_no"
                            header="Transaction No"
                            filter
                            sortable
                            showFilterMenu={false}
                            showClearButton={false}
                            filterPlaceholder="Search by name"
                            style={{ minWidth: "14rem" }}
                        />



                        <Column
                            field="package_name"
                            header="Package Name"
                            filter
                            sortable
                            showFilterMenu={false}
                            showClearButton={false}
                            filterPlaceholder="Search by name"
                            style={{ minWidth: "10rem" }}
                        />

                        <Column
                            filter
                            sortable
                            showFilterMenu={false}
                            showClearButton={false}
                            field="member_name"
                            header="Member Name"
                            body={membername}
                            style={{ minWidth: "10rem" }}
                        />

                        <Column
                            filter
                            sortable
                            showFilterMenu={false}
                            showClearButton={false}
                            field="branch"
                            body={brancename}
                            header="Branch"
                            style={{ minWidth: "10rem" }}
                        />

                        <Column
                            filter
                            sortable
                            showFilterMenu={false}
                            showClearButton={false}
                            field="floor"
                            body={floorname}
                            header="Floor"
                            style={{ minWidth: "10rem" }}
                        />

                        <Column
                            field="room"
                            body={roomname}
                            header="Room"
                            style={{ minWidth: "6rem" }}
                        />

                        <Column
                            field="price"
                            header="Time"
                            body={bookingTime}
                            style={{ minWidth: "10rem" }}
                        />

                        <Column
                            field="pax"
                            header="Pax"
                            style={{ minWidth: "5rem" }}
                        />

                        <Column
                            filter
                            sortable
                            showFilterMenu={false}
                            showClearButton={false}
                            field="bookingstatus"
                            header="Status"
                            body={statusBodyTemplate}
                            style={{ minWidth: "10rem" }}

                        ></Column>


                        <Column
                            field="checkin_date"
                            header="CheckIn Date"
                            filter
                            filterField="checkin_date"
                            showFilterMenu={false}
                            showClearButton={false}
                            body={checkdateBodyTemplate}
                            headerClassName="white-space-nowrap"
                        />

                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>

                    </DataTable>
                </div>
            </div>
        </div >
    );
}

export default Customer;
