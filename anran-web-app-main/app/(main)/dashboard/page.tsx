"use client";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useRef, useState } from "react";
import API from '@/anran/service/api';
import Moment from 'react-moment';
import { Tag } from 'primereact/tag';
import { MultiSelect } from 'primereact/multiselect';
import type { Branch } from "@/types";

export default function ECommerce() {
    const [model, setModel] = useState('Cus');
    const [Staff, setStaff] = useState<[]>([]);
    const [membercount, setMembercount] = useState<[]>([]);
    const [packages, setPackages] = useState<[]>([]);
    const [branch, setBranch] = useState<Branch[]>([]);
    const [selectbranch, setSelectbranch] = useState<Branch[]>([]);


    const [loading, setLoading] = useState(false);
    const [totalRecordsmem, setTotalRecordsmem] = useState(0);
    const [datamem, setDatamem] = useState<any[]>([]);
    const dt = useRef(null);
    const [lazyStatemem, setlazyStatemem] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
    });
    const [totalRecordsstaff, setTotalRecordsstaff] = useState(0);
    const [datastaff, setDatastaff] = useState<any[]>([]);
    const [lazyStatestaff, setlazyStatestaff] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,

    });

    const [pitotalRecords, setPitotalRecords] = useState(0);
    const [pidata, setPidata] = useState<any[]>([]);
    const [pilazyState, setPilazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
    });


    const loadLazyDatamem = () => {
        const q = {
            first: lazyStatemem.first,
            rows: lazyStatemem.rows,
            branch: selectbranch.map(b => b.branch_name)
        }
    
        API.post('members/findallDash', q).then(function (response: any) {
            setDatamem(response.data.data);
            setTotalRecordsmem(response.data.totalRecords);
        }).catch(function (error) {
            console.log(error);
        });
        setLoading(false);
    };

    const onPage = (event: any) => {
        setlazyStatemem(event);
    };


 

    const loadPiLazyData = () => {
        setLoading(true);
        const q = {
            id: null,
            first: pilazyState.first,
            rows: pilazyState.rows,
            branch: selectbranch.map(b => b.branch_name)
        }
        API.post('memberpackage/findAllDash', q).then(function (response: any) {
            setPidata(response.data.data);
            setPitotalRecords(response.data.totalRecords);
        }).catch(function (error) {
            console.log(error);
        }).finally(() => {
            setLoading(false);
        });
    };

    const onPipage = (event: any) => {
        setPilazyState(event);
    };


    const loadLazyDatastaff = () => {
        setLoading(true);
        const q = {
            first: lazyStatestaff.first,
            rows: lazyStatestaff.rows,
            branch: selectbranch.map(b => b.branch_name)
        }
        API.post('staff/findallDash', q).then(function (response: any) {
            setDatastaff(response.data.data);
            setTotalRecordsstaff(response.data.totalRecords);
        }).catch(function (error) {
            console.log(error);
        }).finally(() => {
            setLoading(false);
        });
    };

    const onPagestaff = (event: any) => {
        setlazyStatestaff(event);
    };



    const dateBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Date</span>
                <Moment format="DD/MM/YYYY">
                    {formatDate(d.member_date)}
                </Moment>
                {!d.fullregister && (<Tag value="Partial Register"></Tag>)}

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



    const onclickdt = async (mod: any, newBranch: Branch[]) => {
        setModel(mod);
        if (mod === 'Cus') {
            await loadLazyDatamem();
        } else if (mod === 'Staff') {
            await loadLazyDatastaff();
        } else if (mod === 'Package') {
            await loadPiLazyData();
        }
    };



    useEffect(() => {
        API.get('members').then(function (response: any) {
            setMembercount(response.data.length)
        }).catch(function (error) {
            console.log(error);
        });
        API.get('memberpackage').then(function (response: any) {
            setPackages(response.data.length);
        }).catch(function (error) {
            console.log(error);
        });
        API.get('staff').then(function (response: any) {
            setStaff(response.data.length);
        }).catch(function (error) {
            console.log(error);
        });
        API.get('branch').then(function (response: any) {
            setBranch(response.data);
        }).catch(function (error) {
            console.log(error);
        });
        //setSelectbranch(branch);
       onclickdt(model,branch);
    }, [lazyStatemem, lazyStatestaff, pilazyState,selectbranch]);



   
    const nameBodyTemplatestaff = (d: any) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {d.name}
            </>
        );
    };


    const mobileBodyTemplatestaff = (d: any) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {d.mobilenumber}
            </>
        );
    };

    const genderBodyTemplatestaff = (d: any) => {
        return (
            <>
                <span className="p-column-title">Gender</span>
                {d.gender}
            </>
        );
    };

    const joingDateBodyTemplatestaff = (d: any) => {
        return (
            <>
                <span className="p-column-title">Joing Date</span>
                <Moment format="DD/MM/YYYY">
                    {d.joingdate}
                </Moment>
            </>
        );
    };

    const roleBodyTemplatestaff = (d: any) => {
        return (
            <>
                <span className="p-column-title">Role</span>
                {d.roles.role_name}
            </>
        );
    };

    const branchNameBodyTemplatestaff = (d: any) => {
        return (
            <>
                <span className="p-column-title">Branch Name</span>
                {d.branch.branch_name}
            </>
        );
    };

    const pidateBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Date</span>
                <Moment format="DD/MM/YYYY">
                    {d.package_date}
                </Moment>

            </>
        );
    };


    const pimembername = (d: any) => {
        return (
            <>
                <span className="p-column-title">Member Name</span>
                {d.member.member_name}
            </>
        );

    };


    const handleChange = (e: any) => {
        const newValue = e.value;
        setSelectbranch(newValue);
        onclickdt(model, newValue);
    };

    return (
        <div className="grid">
            <div className="col-12 md:col-6 xl:col-3">
                <div className="card h-full relative overflow-hidden" onClick={() => onclickdt("Cus",selectbranch)}>
                    <svg
                        id="visual"
                        viewBox="0 0 900 600"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        version="1.1"
                        className="absolute left-0 top-0 h-full w-full z-1"
                        preserveAspectRatio="none"
                    >
                        <rect
                            x="0"
                            y="0"
                            width="900"
                            height="600"
                            fill="var(--primary-600)"
                        ></rect>
                        <path
                            d="M0 400L30 386.5C60 373 120 346 180 334.8C240 323.7 300 328.3 360 345.2C420 362 480 391 540 392C600 393 660 366 720 355.2C780 344.3 840 349.7 870 352.3L900 355L900 601L870 601C840 601 780 601 720 601C660 601 600 601 540 601C480 601 420 601 360 601C300 601 240 601 180 601C120 601 60 601 30 601L0 601Z"
                            fill="var(--primary-500)"
                            strokeLinecap="round"
                            strokeLinejoin="miter"
                        ></path>
                    </svg>
                    <div className="z-2 relative text-white">
                        <div className="text-xl font-semibold mb-3">
                            Member Registered
                        </div>
                        <div className="text-xl font-semibold mb-3">
                            {membercount}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 md:col-6 xl:col-3">
                <div className="card h-full relative overflow-hidden" onClick={() => onclickdt("Staff",selectbranch)}>
                    <svg
                        id="visual"
                        viewBox="0 0 900 600"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        version="1.1"
                        className="absolute left-0 top-0 h-full w-full z-1"
                        preserveAspectRatio="none"
                    >
                        <rect
                            x="0"
                            y="0"
                            width="900"
                            height="600"
                            fill="#221119"
                        ></rect>
                        <path
                            d="M0 400L30 386.5C60 373 120 346 180 334.8C240 323.7 300 328.3 360 345.2C420 362 480 391 540 392C600 393 660 366 720 355.2C780 344.3 840 349.7 870 352.3L900 355L900 601L870 601C840 601 780 601 720 601C660 601 600 601 540 601C480 601 420 601 360 601C300 601 240 601 180 601C120 601 60 601 30 601L0 601Z"
                            fill="var(--primary-500)"
                            strokeLinecap="round"
                            strokeLinejoin="miter"
                        ></path>
                    </svg>
                    <div className="z-2 relative text-white">
                        <div className="text-xl font-semibold mb-3">
                            Number of Staff
                        </div>
                        <div className="text-xl font-semibold mb-3">
                            {Staff}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 md:col-6 xl:col-3">
                <div className="card h-full relative overflow-hidden" onClick={() => onclickdt("Package",selectbranch)}>
                    <svg
                        id="visual"
                        viewBox="0 0 900 600"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        version="1.1"
                        className="absolute left-0 top-0 h-full w-full z-1"
                        preserveAspectRatio="none"
                    >
                        <rect
                            x="0"
                            y="0"
                            width="900"
                            height="600"
                            fill="#031020"
                        ></rect>
                        <path
                            d="M0 400L30 386.5C60 373 120 346 180 334.8C240 323.7 300 328.3 360 345.2C420 362 480 391 540 392C600 393 660 366 720 355.2C780 344.3 840 349.7 870 352.3L900 355L900 601L870 601C840 601 780 601 720 601C660 601 600 601 540 601C480 601 420 601 360 601C300 601 240 601 180 601C120 601 60 601 30 601L0 601Z"
                            fill="var(--primary-500)"
                            strokeLinecap="round"
                            strokeLinejoin="miter"
                        ></path>
                    </svg>
                    <div className="z-2 relative text-white">
                        <div className="text-xl font-semibold mb-3">
                            Package Registered
                        </div>
                        <div className="text-xl font-semibold mb-3">
                            {packages}
                        </div>
                    </div>
                </div>
            </div>


            <div className="col-12 md:col-6 xl:col-3">
                <div className="card h-full relative overflow-hidden" onClick={() => onclickdt("Duty",selectbranch)}>
                    <svg
                        id="visual"
                        viewBox="0 0 900 600"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        version="1.1"
                        className="absolute left-0 top-0 h-full w-full z-1"
                        preserveAspectRatio="none"
                    >
                        <rect
                            x="0"
                            y="0"
                            width="900"
                            height="600"
                            fill="#895657"
                        ></rect>
                        <path
                            d="M0 400L30 386.5C60 373 120 346 180 334.8C240 323.7 300 328.3 360 345.2C420 362 480 391 540 392C600 393 660 366 720 355.2C780 344.3 840 349.7 870 352.3L900 355L900 601L870 601C840 601 780 601 720 601C660 601 600 601 540 601C480 601 420 601 360 601C300 601 240 601 180 601C120 601 60 601 30 601L0 601Z"
                            fill="var(--primary-500)"
                            strokeLinecap="round"
                            strokeLinejoin="miter"
                        ></path>
                    </svg>
                    <div className="z-2 relative text-white">
                        <div className="text-xl font-semibold mb-3">
                            Current Duty Staff
                        </div>
                        <div className="text-xl font-semibold mb-3">
                            0
                        </div>
                    </div>
                </div>
            </div>


            <div className="field mb-4 col-12">
            <span>
                <MultiSelect
                    inputId="preferredbranch"
                    name="preferredbranch"
                    value={selectbranch}
                    options={branch}
                    optionLabel="branch_name"
                    placeholder="Select Branch"
                    onChange={handleChange}
                />
            </span>
        </div>


            {model === 'Cus' && <>
                < div className="col-12 lg:col-12" >
                    <div className="card">

                        <DataTable
                            ref={dt}
                            value={datamem}
                            lazy dataKey="_id" paginator
                            first={lazyStatemem.first} rows={10}
                            totalRecords={totalRecordsmem} onPage={onPage}
                            loading={loading}
                        >
                            <Column
                                field="member_date"
                                header="Date"
                                body={dateBodyTemplate}
                                headerClassName="white-space-nowrap"

                            ></Column>
                            <Column

                                field="name"
                                header="Name"

                                body={branchNameBodyTemplate}
                                headerClassName="white-space-nowrap"

                            ></Column>

                            <Column

                                field="Mobile"
                                header="Mobile No"

                                body={mobilenoBodyTemplate}
                                headerClassName="white-space-nowrap"
                            ></Column>

                            <Column

                                field="email"
                                header="E-mail"

                                headerClassName="white-space-nowrap"

                            ></Column>

                            <Column

                                field="gender"
                                header="Gender"

                                body={genderBodyTemplate}
                                headerClassName="white-space-nowrap"

                            ></Column>

                            <Column

                                field="branch"
                                header="Preferred branch"

                                body={preferredbranchBodyTemplate}
                                headerClassName="white-space-nowrap"

                            ></Column>

                        </DataTable>
                    </div> </div>

            </>}


            {(model === 'Staff') && <>
                < div className="col-12 lg:col-12" >
                    <div className="card">

                        <DataTable
                            ref={dt}
                            value={datastaff}
                            lazy dataKey="_id" paginator
                            first={lazyStatestaff.first} rows={10}
                            totalRecords={totalRecordsstaff} onPage={onPagestaff}
                            loading={loading}
                        >
                            <Column
                                field="name"
                                header="Name"

                                body={nameBodyTemplatestaff}
                                headerClassName="white-space-nowrap"
                                style={{ width: "20%" }}
                            ></Column>
                            <Column
                                field="gender"
                                header="Gender"

                                body={genderBodyTemplatestaff}
                                headerClassName="white-space-nowrap"
                                style={{ width: "15%" }}
                            ></Column>
                            <Column
                                field="role_detail"
                                header="Role"

                                body={roleBodyTemplatestaff}
                                headerClassName="white-space-nowrap"
                                style={{ width: "15%" }}
                            ></Column>
                            <Column
                                field="branch"
                                header="Branch"

                                body={branchNameBodyTemplatestaff}
                                headerClassName="white-space-nowrap"
                                style={{ width: "30%" }}
                            ></Column>


                            <Column
                                field="branch"
                                header="Mobile No"

                                body={mobileBodyTemplatestaff}
                                headerClassName="white-space-nowrap"
                                style={{ width: "30%" }}
                            ></Column>

                        </DataTable>
                    </div>
                </div>
            </>}


            {
                model === 'Package' && <>
                    < div className="col-12 lg:col-12" >
                        <div className="grid">
                            <div className="col-12 lg:col-12" >
                                <div className="card">

                                    <DataTable
                                        ref={dt}
                                        value={pidata}

                                        lazy dataKey="_id" paginator
                                        first={pilazyState.first} rows={10}
                                        totalRecords={pitotalRecords} onPage={onPipage}
                                        loading={loading}
                                        emptyMessage="Not found.">
                                        <Column
                                            field="package_date"
                                            header="Date"
                                            body={pidateBodyTemplate}

                                            headerStyle={{ minWidth: "12rem" }}
                                        ></Column>


                                        <Column
                                            field="package"
                                            header="Package Name"
                                            style={{ minWidth: "12rem" }}
                                        />

                                        <Column
                                            field="member"
                                            header="Member Name"
                                            body={pimembername}
                                            style={{ minWidth: "12rem" }}
                                        />

                                        <Column
                                            field="times"
                                            header="Times"
                                            style={{ minWidth: "12rem" }}
                                        />

                                        <Column
                                            field="price"
                                            header="price"
                                            style={{ minWidth: "12rem" }}
                                        />


                                    </DataTable>
                                </div>
                            </div>
                        </div >
                    </div>
                </>
            }

        </div >

    );
}
