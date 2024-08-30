"use client";
import type { Demo } from "@/types";
import React, { useEffect, useState, useRef } from "react";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Button } from "primereact/button";
import API from '@/anran/service/api';
import { useRouter } from "next/navigation";
import { Dialog } from "primereact/dialog";
import { useFormik } from 'formik';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { BlockUI } from 'primereact/blockui';
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from 'primereact/inputnumber';
import { FilterMatchMode, FilterOperator } from "primereact/api";
import Moment from 'react-moment';

const Customer = () => {
    let networkTimeout: any = null;
    const [showDialog, setShowDialog] = useState(false);
    const toast = useRef<Toast>(null);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const dt = useRef(null);
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [blocked, setBlocked] = useState(false);
    const [view, setView] = useState("");
    const [editid, setEditid] = useState("");
    const [Package, setPackage] = useState<any[]>([]);
    const [member, setMember] = useState<any[]>([]);
    const [membertolst, setMembertolst] = useState<any[]>([]);


    const memberform = useFormik({
        initialValues: {
            memberfrom: '',
            memberto: '',
            memberpackage: '',
            points: '',

        },
        validate: (data) => {
            let errors: any = {};
            if (!data.memberfrom) {
                errors.memberfrom = 'Member From is required.';
            }
            if (!data.memberto) {
                errors.memberto = 'Member To is required.';
            }
            if (!data.memberpackage) {
                errors.memberpackage = 'Package Plan is required.';
            }
            if (!data.points) {
                errors.time = 'time is required.';
            }
            return errors;
        },
        onSubmit: (data: any) => {
            confirmDialog({
                message: 'Are you sure you want to save?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept() {
                    setBlocked(true);
                    if (view === 'edit') {
                        API.put('transfer/' + editid, data).then(function (response) {
                            if (toast && toast.current) {
                                toast.current.show({ severity: 'info', summary: 'Status', detail: 'Transfer Edited Successfully!!!', life: 3000 });
                            }
                            memberform.resetForm();
                            setShowDialog(false);
                        }).catch(function (error) {
                            if (toast && toast.current) {
                                toast.current.show({ severity: 'error', summary: 'Status', detail: 'Transfer Not able to create', life: 3000 });
                            }
                        });
                    } else {
                        API.post('transfer', data).then(function (response) {
                            let dt = {
                                member: data.memberto,
                                packageid: data.memberpackage.packageid,
                                package: data.memberpackage.package,
                                times: data.points,
                                quantity: 1,
                                price: data.memberpackage.price,
                                balance: data.points,
                                purchasetype: 'Transfer',
                                transferfrom: data.memberpackage,
                                branch: data.memberpackage.branch,
                                invoicenumber: '',
                                paymenttype: '',
                                transferedtimes: 0,

                            };

                            data.memberpackage.transferedtimes = data.points
                            data.memberpackage.balance = data.memberpackage.balance - data.points
                            API.put('memberpackage/' + data.memberpackage._id, data.memberpackage).then(function (response) {

                            })
                            API.post('memberpackage/createpackage', dt).then(function (response) {
                                if (toast && toast.current) {
                                    toast.current.show({ severity: 'info', summary: 'Status', detail: 'Transfer Successfully!!!', life: 3000 });
                                }
                            })
                            memberform.resetForm();
                            router.push("/members/transfercredits");
                            setShowDialog(false);
                        }).catch(function (error) {
                            if (toast && toast.current) {
                                toast.current.show({ severity: 'error', summary: 'Status', detail: 'Transfer Not able to create', life: 3000 });
                            }
                        });
                    }
                    setBlocked(false);
                },
            });
        }
    });


    const addnew = () => {
        setView("display");
        setShowDialog(true);
        memberform.resetForm();
    }

    const [tctotalRecords, setTctotalRecords] = useState(0);
    const [tcdata, setTcdata] = useState<any[]>([]);
    const [tclazyState, setTclazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: 'transfer_date',
        sortOrder: null,
        filters: {
            member_date: { value: null, matchMode: FilterMatchMode.DATE_IS },
        }
    });

    const loadTcLazyData = () => {
        setLoading(true);
        if (networkTimeout) {
            clearTimeout(networkTimeout);
        }
        //imitate delay of a backend call
        networkTimeout = setTimeout(() => {
            const q = {
                id: null,
                first: tclazyState.first,
                rows: tclazyState.rows,
                filters: tclazyState.filters,
                sortField: tclazyState.sortField,
                sortOrder: tclazyState.sortOrder
            }
            API.post('transfer/findall', q).then(function (response: any) {
                setTcdata(response.data.data);
                setTctotalRecords(response.data.totalRecords);
            }).catch(function (error) {
                console.log(error);
            }).finally(() => {
                setLoading(false);
            });
        }, Math.random() * 1000 + 250);
    };

    const onTcpage = (event: any) => {
        setTclazyState(prevState => ({
            ...prevState,
            first: event.first,
            rows: event.rows,
            filters: prevState.filters,
            sortField: prevState.sortField,
            sortOrder: prevState.sortOrder
        }));

    };

    const onTcfilter = (event: any) => {
        setTclazyState(prevState => ({ ...prevState, first: 0, filters: event.filters }));
    };

    const onSort = (event: any) => {
        setTclazyState(prevState => ({
            ...prevState,
            sortField: event.sortField || undefined,
            sortOrder: event.sortOrder
        }));
    };

    useEffect(() => {
        getMemberlst();
        loadTcLazyData();
    }, [tclazyState]);


    const getMemberlst = async () => {
        try {
            const response = await API.get('members');
            const members = response.data || [];
            const updatedMembers = members.map((member: any) => ({
                ...member,
                combinedLabel: `${member.member_name} (${member.mobileNumber})`
            }));

            setMember(updatedMembers);
        } catch (error) {
            console.error("Error fetching members:", error);
        }

    }


    const avaliablepackage = (e: any) => {
        if (e._id) {
            API.get('members').then(function (response: any) {
                const updatedMembers = response.data.map((member: any) => ({
                    ...member,
                    combinedLabel: `${member.member_name} (${member.mobileNumber})`
                }));
                setMembertolst(updatedMembers);
            }).catch(function (error) {
                console.log(error);
            });
            memberform.setFieldValue('memberto', null);
            API.get('memberpackage/avail/' + e._id).then(function (response: any) {
                setPackage(response.data);
                setMembertolst(prevMembertolst => {
                    const updatedMembertolst = prevMembertolst
                        .filter(item => item._id !== e._id)
                        .map((member: any) => ({
                            ...member,
                            combinedLabel: `${member.member_name} (${member.mobileNumber})`
                        })); // Ensure combinedLabel is included after filtering
                    return updatedMembertolst;
                });
            }).catch(function (error) {
                console.log(error);
            });
        }
    };

    const [balance, setBalance] = useState(0);
    const setmaximim = (e: any) => {
        if (e._id) {
            setBalance(e.balance);
        }
    };



    const dateBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Date</span>
                <Moment format="DD/MM/YYYY">
                    {d.transfer_date}
                </Moment>
            </>
        );
    };



    const memberfrom = (d: any) => {
        return (
            <>
                <span className="p-column-title">Member Name</span>
                {d.memberfrom.member_name}
            </>
        );
    };

    const memberTo = (d: any) => {
        return (
            <>
                <span className="p-column-title">Member Name</span>
                {d.memberto.member_name}
            </>
        );
    };

    const packagename = (d: any) => {
        return (
            <>
                <span className="p-column-title">Package Name</span>
                {d.memberpackage.package}
            </>
        );
    };



    const optionTemplate = (option: any) => {
        return (
            <div className="flex align-items-center">
                <div>{option.package} - Balance Times {option.balance}</div>
            </div>
        );
    };


    const getFormErrorMessage = (name: string) => {
        if (isFormFieldValid(name) && memberform.errors) {
            let err: any = memberform.errors;
            return <small className="p-error">{err[name]}</small>;
        } else {
            return "";
        }
    };

    const isFormFieldValid = (name: string) => !!(memberform.touched[name] && memberform.errors[name]);



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
                        onClick={addnew}
                    />
                </div>
            </div>
        );
    };

    const packagecre = packageHeader();

    const actionBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => editTransfer(rowData)}
                />

            </React.Fragment>
        );
    };




    const editTransfer = (product: any) => {
        getMemberlst();
        setEditid(product._id);
        memberform.setFieldValue('memberfrom', product.memberfrom, false);
        avaliablepackage(product.memberfrom)
        memberform.setFieldValue('memberto', product.memberto, false);
        memberform.setFieldValue('memberpackage', product.memberpackage, false);
        memberform.setFieldValue('points', product.points, false);
        setShowDialog(true);
        setView('edit')

    };


    return (
        <div className="grid">
            <div className="col-12 lg:col-12" >
                <div className="card">
                    <div className="flex flex-column md:flex-row md:align-items-start md:justify-content-between mb-3">
                        <div className="text-900 text-xl font-semibold mb-3 md:mb-0">
                            Transfer Package Details
                        </div>

                    </div>
                    <DataTable
                        ref={dt}
                        value={tcdata}
                        header={packagecre}
                        lazy filterDisplay="row" dataKey="_id" paginator
                        first={tclazyState.first} rows={10}
                        totalRecords={tctotalRecords} onPage={onTcpage}
                        onFilter={onTcfilter}
                        onSort={onSort}
                        sortField={tclazyState.sortField}
                        sortOrder={tclazyState.sortOrder}
                        loading={loading}
                        emptyMessage="Not found.">



                        <Column
                            field="transfer_date"
                            header="Date"
                            filter
                            sortable
                            filterField="transfer_date"
                            filterPlaceholder="Filter by date"
                            showFilterMenu={false}
                            showClearButton={false}
                            body={dateBodyTemplate}
                            headerClassName="white-space-nowrap"
                        />

                        <Column
                            field="transaction_no"
                            header="Transaction No "
                            filter
                            sortable
                            filterPlaceholder="Search"
                            style={{ minWidth: "12rem" }}
                            showFilterMenu={false}
                            showClearButton={false}
                        />

                        <Column
                            field="memberfrom"
                            header="Transfer From"
                            body={memberfrom}
                            filter
                            sortable
                            filterPlaceholder="Search"
                            style={{ minWidth: "12rem" }}
                            showFilterMenu={false}
                            showClearButton={false}
                        />

                        <Column
                            field="member"
                            header="Transfer To"
                            body={memberTo}
                            filter
                            sortable
                            filterPlaceholder="Search"
                            style={{ minWidth: "12rem" }}
                            showFilterMenu={false}
                            showClearButton={false}
                        />

                        <Column
                            field="Package"
                            header="Package "
                            body={packagename}
                            filter
                            sortable
                            filterPlaceholder="Search by Package"
                            style={{ minWidth: "12rem" }}
                            showFilterMenu={false}
                            showClearButton={false}
                        />



                        <Column
                            field="points"
                            header="Points"
                            style={{ minWidth: "12rem" }}
                        />

                        {/* <Column
                            body={actionBodyTemplate}
                            exportable={false}
                            style={{ minWidth: "8rem" }}
                        ></Column> */}




                    </DataTable>



                    <Dialog
                        visible={showDialog}
                        style={{ width: "36rem" }}
                        modal
                        headerClassName="text-900 font-semibold text-xl"
                        header='Transfer Session'
                        breakpoints={{ "960px": "75vw", "640px": "90vw" }}
                        closable
                        onHide={() => setShowDialog(false)}>

                        <form onSubmit={memberform.handleSubmit} className="field mb-12 col-12">
                            <ConfirmDialog />
                            <Toast ref={toast} />
                            <BlockUI blocked={blocked}></BlockUI>
                            <div className="grid p-fluid formgrid">
                                <div className="field mb-6 col-12">
                                    <span className="p-float-label">
                                        <Dropdown
                                            inputId="member"
                                            name="member"
                                            value={memberform.values.memberfrom}
                                            options={member}
                                            filter
                                            optionLabel="combinedLabel"
                                            filterPlaceholder="Search Mobile No"
                                            placeholder="Select a Member"
                                            onChange={(e) => {
                                                memberform.setFieldValue('memberfrom', e.value);
                                                avaliablepackage(e.value);
                                            }}
                                            itemTemplate={(option) => (
                                                <div>
                                                    {option.member_name} ({option.mobileNumber})
                                                </div>
                                            )}
                                        />
                                        <label htmlFor="member">Transfer From</label>
                                    </span>
                                    {getFormErrorMessage('memberfrom')}
                                </div>


                                <div className="field mb-6 col-12">
                                    <span className="p-float-label">
                                        <Dropdown
                                            inputId="member_package"
                                            name="member_package"
                                            value={memberform.values.memberpackage}
                                            options={Package}
                                            optionLabel='package'
                                            itemTemplate={optionTemplate}
                                            placeholder="Select a Package"
                                            onChange={(e) => {
                                                memberform.setFieldValue('memberpackage', e.value);
                                                setmaximim(e.value);
                                            }}
                                            emptyMessage='No Package Avaliavle for Selected Member'

                                        />
                                        <label htmlFor="package">Select Packages</label>
                                    </span>
                                    {getFormErrorMessage('memberpackage')}
                                </div>

                                <div className="field mb-6 col-12">
                                    <span className="p-float-label">
                                        <Dropdown
                                            inputId="memberto"
                                            name="memberto"
                                            value={memberform.values.memberto}
                                            options={membertolst}
                                            optionLabel='combinedLabel'
                                            placeholder="Select a Member"
                                            filter // Enable filtering
                                            filterPlaceholder="Search Mobile No"
                                            onChange={(e) => {
                                                memberform.setFieldValue('memberto', e.value);
                                            }}
                                            itemTemplate={(option) => (
                                                <div>
                                                    {option.member_name} ({option.mobileNumber})
                                                </div>
                                            )}
                                        />
                                        <label htmlFor="memberto">Transfer To</label>
                                    </span>
                                    {getFormErrorMessage('memberto')}
                                </div>



                                <div className="field mb-6 col-12">
                                    <span className="p-float-label">
                                        <InputNumber id="name" name="name" value={memberform.values.points}
                                            onValueChange={(e) => { memberform.setFieldValue('points', e.value); }}
                                            min={1} max={balance} />

                                        <label htmlFor="name">Transfer Session</label>
                                    </span>
                                    {getFormErrorMessage('points')}
                                </div>


                            </div>
                            <div className="col-12">
                                <Button type="submit" label="Save" icon="pi pi-check" />
                            </div>
                        </form>

                    </Dialog>

                </div>
            </div>
        </div >
    );
}

export default Customer;
