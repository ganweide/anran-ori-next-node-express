"use client";
import type { Demo } from "@/types";
import { useRouter } from "next/navigation";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useEffect, useRef, useState } from "react";
import { BlockUI } from 'primereact/blockui';
import { TabView, TabPanel } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { confirmDialog } from 'primereact/confirmdialog';
import { Calendar } from 'primereact/calendar';
import { RadioButton } from 'primereact/radiobutton';
import { Divider } from 'primereact/divider';
import API from '@/anran/service/api';
import type { Branch } from "@/types";
import { useFormik } from 'formik';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import Moment from 'react-moment';


function List({ params }: { params: { id: string } }) {

    const { id } = params;
    let networkTimeout: any = null;
    const [Package, setPackage] = useState<any[]>([]);
    const [branch, setBranch] = useState<Branch[]>([]);
    const [ingredients, setIngredients] = useState<any[]>([]);
    const [blocked, setBlocked] = useState(false);
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const dt = useRef(null);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [pitotalRecords, setPitotalRecords] = useState(0);
    const [bktotalRecords, setBktotalRecords] = useState(0);
    const [pidata, setPidata] = useState<any[]>([]);
    const [bkdata, setBkdata] = useState<any[]>([]);

    const [bklazyState, setBklazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: 'booking_date',
        sortOrder: null,
        filters: {
            member_date: { value: null, matchMode: FilterMatchMode.DATE_IS },
        }
    });

    const [pilazyState, setPilazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: 'package_date',
        sortOrder: null,
        filters: {
            member_date: { value: null, matchMode: FilterMatchMode.DATE_IS },
        }
    });

    const [tctotalRecords, setTctotalRecords] = useState(0);
    const [tcdata, setTcdata] = useState<any[]>([]);
    const [tclazyState, setTclazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            member_date: { value: null, matchMode: FilterMatchMode.DATE_IS },
        }
    });

    const loadPiLazyData = () => {
        setLoading(true);
        if (networkTimeout) {
            clearTimeout(networkTimeout);
        }
        //imitate delay of a backend call
        networkTimeout = setTimeout(async () => {
            const q = {
                id: id,
                first: pilazyState.first,
                rows: pilazyState.rows,
                filters: pilazyState.filters,
                sortField: pilazyState.sortField,
                sortOrder: pilazyState.sortOrder
            }
            await API.post('memberpackage/findAll', q).then(function (response: any) {
                setPidata(response.data.data);
                setPitotalRecords(response.data.totalRecords);
            }).catch(function (error) {
                console.log(error);
            }).finally(() => {
                setLoading(false);
            });
        }, Math.random() * 1000 + 250);
    };

    const loadTcLazyData = () => {
        setLoading(true);
        if (networkTimeout) {
            clearTimeout(networkTimeout);
        }
        //imitate delay of a backend call
        networkTimeout = setTimeout(() => {
            const q = {
                id: id,
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


    const onPipage = (event: any) => {
        setPilazyState(prevState => ({
            ...prevState,
            first: event.first,
            rows: event.rows,
            filters: prevState.filters,
            sortField: prevState.sortField,
            sortOrder: prevState.sortOrder
        }));
    };

    const onPifilter = (event: any) => {
        event['first'] = 0;
        setPilazyState(event);
    };


    const onPiSort = (event: any) => {
        setPilazyState(prevState => ({
            ...prevState,
            sortField: event.sortField || undefined,
            sortOrder: event.sortOrder
        }));
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
        event['first'] = 0;
        setTclazyState(event);
    };

    const bkloadLazyData = () => {
        setLoading(true);
        if (networkTimeout) {
            clearTimeout(networkTimeout);
        }
        //imitate delay of a backend call
        networkTimeout = setTimeout(() => {
            const q = {
                id: id,
                first: bklazyState.first,
                rows: bklazyState.rows,
                filters: bklazyState.filters,
                sortField: bklazyState.sortField,
                sortOrder: bklazyState.sortOrder
            }
            API.post('booking/findall', q).then(function (response: any) {
                setBkdata(response.data.data);
                setBktotalRecords(response.data.totalRecords);
            }).catch(function (error) {
                console.log(error);
            }).finally(() => {
                setLoading(false);
            });
        }, Math.random() * 1000 + 250);
    };

    const onBkPage = (event: any) => {
        setBklazyState(prevState => ({
            ...prevState,
            first: event.first,
            rows: event.rows,
            filters: prevState.filters,
            sortField: prevState.sortField,
            sortOrder: prevState.sortOrder
        }));
    };

    const onBkFilter = (event: any) => {
        setBklazyState(prevState => ({ ...prevState, first: 0, filters: event.filters }));

    };

    const onBkSort = (event: any) => {
        setBklazyState(prevState => ({
            ...prevState,
            sortField: event.sortField || undefined,
            sortOrder: event.sortOrder
        }));
    };



    const gender = ['Male', 'Female', 'Transgender'];

    const radioBtns = [
        {
            value: 'New Member',
            inputId: 'f1'
        },
        {
            value: 'Existing Member',
            inputId: 'f2'
        },
    ];

    const paymentMethod = [
        {
            value: 'Debit/Credit Card (One-off) 银行/信用卡 (一次性)',
            inputId: 'f1'
        },
        {
            value: 'Debit/Credit Card (Installment) 银行/信用卡 (分期付款)',
            inputId: 'f2'
        },
    ];




    useEffect(() => {
        API.get('package').then(function (response: any) {
            setPackage(response.data);
        }).catch(function (error) {
            console.log(error);
        });
        API.get('branch').then(function (response: any) {
            setBranch(response.data);
        }).catch(function (error) {
            console.log(error);
        });

        API.get('Members/' + id).then(function (response: any) {
            memberform.setFieldValue('member_date', new Date(response.data.member_date), false);
            memberform.setFieldValue('member_name', response.data.member_name, false);
            memberform.setFieldValue('status', response.data.status, false);
            memberform.setFieldValue('existingmobileno', response.data.existingmobileno, false);
            memberform.setFieldValue('preferredbranch', response.data.preferredbranch, false);
            memberform.setFieldValue('packageplan', response.data.packageplan, true);
            memberform.setFieldValue('paymentmethod', response.data.paymentmethod, false);
            memberform.setFieldValue('legalFullname', response.data.legalFullname, false);
            memberform.setFieldValue('preferredname', response.data.preferredname, false);
            memberform.setFieldValue('chinesename', response.data.chinesename, false);
            memberform.setFieldValue('passport', response.data.passport, false);
            memberform.setFieldValue('age', response.data.age, false);
            memberform.setFieldValue('gender', response.data.gender, false);
            memberform.setFieldValue('dob', new Date(response.data.dob), false);
            memberform.setFieldValue('address', response.data.address, false);
            memberform.setFieldValue('city', response.data.city, false);
            memberform.setFieldValue('postcode', response.data.postcode, false);
            memberform.setFieldValue('states', response.data.states, false);
            memberform.setFieldValue('mobileNumber', response.data.mobileNumber, false);
            memberform.setFieldValue('email', response.data.email, false);
            if (activeTabIndex === 1) {
                loadPiLazyData();
            } else if (activeTabIndex === 2) {
                loadTcLazyData();
            } else if (activeTabIndex === 3) {
                bkloadLazyData();
            }
        }).catch(function (error) {
            console.log(error);
        });
        setLoading(false);
    }, [pilazyState, tclazyState, bklazyState,activeTabIndex]);


    const handleTabChange = (event: any) => {
        setActiveTabIndex(event.index);
        if (event.index === 1) {
            loadPiLazyData();
        } else if (event.index === 2) {
            loadTcLazyData();
        } else if (event.index === 3) {
            bkloadLazyData();
        }
    };

    const memberform = useFormik({
        initialValues: {
            member_date: '',
            member_name: '',
            status: '',
            existingmobileno: '',
            preferredbranch: '',
            paymentmethod: '',
            legalFullname: '',
            preferredname: '',
            chinesename: '',
            passport: '',
            age: null,
            gender: '',
            dob: '',
            address: '',
            city: '',
            postcode: '',
            states: '',
            mobileNumber: '',
            email: '',
        },
        validate: (data) => {
            let errors: any = {};
            if (!data.member_date) {
                errors.member_date = 'Member date is required.';
            }
            if (!data.member_name) {
                errors.member_name = 'Member Name is required.';
            }
            if (!data.status) {
                errors.status = 'Member Status is required.';
            }
            if (!data.existingmobileno) {
                errors.existingmobileno = 'Existing Members Mobile Number is required.';
            }
            if (!data.preferredbranch) {
                errors.preferredbranch = 'Preferred Branch is required.';
            }

            if (!data.paymentmethod) {
                errors.paymentmethod = 'Payment Method is required.';
            }
            if (!data.legalFullname) {
                errors.legalFullname = 'Legal Full Name is required.';
            }
            if (!data.preferredname) {
                errors.preferredname = 'Preferred Name is required.';
            }
            if (!data.chinesename) {
                errors.chinesename = 'Chinese Name is required.';
            }
            if (!data.passport) {
                errors.passport = 'NRIC/Passport No is required.';
            }
            if (!data.age) {
                errors.age = 'Age is required.';
            }
            if (!data.gender) {
                errors.gender = 'Gender is required.';
            }
            if (!data.dob) {
                errors.dob = 'Date of Birth is required.';
            }
            if (!data.address) {
                errors.address = 'Address is required.';
            }
            if (!data.city) {
                errors.city = 'City is required.';
            }
            if (!data.postcode) {
                errors.postcode = 'postcode is required.';
            }
            if (!data.states) {
                errors.states = 'States is required.';
            }
            if (!data.mobileNumber) {
                errors.mobileNumber = 'Mobile Number is required.';
            }

            if (!data.email) {
                errors.email = 'email is required.';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
                errors.email = 'Invalid email address';
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
                    API.put('Members/' + id, data).then(function (response) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'info', summary: 'Status', detail: 'Members Updated Successfully!!!', life: 3000 });
                        }
                        memberform.resetForm();
                        router.push("/members/info");
                    }).catch(function (error) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'error', summary: 'Status', detail: 'Members Not able to create', life: 3000 });
                        }
                    });
                    setBlocked(false);
                },
            });
        }
    });


    const isFormFieldValid = (name: string) => !!(memberform.touched[name] && memberform.errors[name]);

    const getFormErrorMessage = (name: string) => {
        if (isFormFieldValid(name) && memberform.errors) {
            let err: any = memberform.errors;
            return <small className="p-error">{err[name]}</small>;
        } else {
            return "";
        }
    };

    const onIngredientsChange = (e: any) => {
        alert(e.value)
        let _ingredients = [...ingredients];

        if (e.checked)
            _ingredients.push(e.value);
        else
            _ingredients.splice(_ingredients.indexOf(e.value), 1);

        setIngredients(_ingredients);
        memberform.setFieldValue('packageplan', _ingredients, false);
        //alert(memberform.values.packageplan)
    }




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
                </div>
            </div>
        );
    };

    const nameBodyTemplate = (customer: Demo.Customer) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {customer.name}
            </>
        );
    };

    const descriptionBodyTemplate = (customer: Demo.Customer) => {
        return (
            <>
                <span className="p-column-title">Description</span>
                {customer.company}
            </>
        );
    };

    const amountBodyTemplate = (customer: Demo.Customer) => {
        return (
            <>
                <span className="p-column-title">Amount</span>
                {customer.balance}
            </>
        );
    };

    const header = renderHeader();

    const editProduct = (product: Demo.Customer) => {
        router.push("/members/create");
    };

    const showMessage = (ref: any) => {
        ref.current.show({ severity: 'success', summary: 'Successful', detail: 'Deleted', life: 3000 });
    };

    const actionBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={(e) => showMessage(toast)} />
            </React.Fragment>
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

    const searchBodyTemplate = () => {
        return (

            <React.Fragment>
                <Button
                    type="button"
                    icon="pi pi-search"
                    outlined
                    rounded
                ></Button>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" />
                <Button icon="pi pi-trash" rounded outlined severity="danger" />
            </React.Fragment>

        );
    };

    const datepackage = (d: any) => {
        return (
            <>
                <span className="p-column-title">Date</span>
                <Moment format="DD/MM/YYYY">
                    {d.package_date}
                </Moment>

            </>
        );
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


    const bkdateBodyTemplate = (d: any) => {
        return (
            <>
                <span className="p-column-title">Date</span>
                <Moment format="DD/MM/YYYY">
                    {formatDate(d.booking_date)}
                </Moment>

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

    const bkmembername = (d: any) => {
        return (
            <>
                <span className="p-column-title">Member Name</span>
                {d.member.member_name}
            </>
        );

    };




    const bkroomname = (d: any) => {
        return (
            <>
                <span className="p-column-title">Room Name</span>
                {d.room.room_no}
            </>
        );
    };

    const bkbrancename = (d: any) => {
        return (
            <>
                <span className="p-column-title">Room Name</span>
                {d.branch.branch_name}
            </>
        );
    };

    const bkfloorname = (d: any) => {
        return (
            <>
                <span className="p-column-title">Room Name</span>
                {d.floor ? d.floor.floor_no : ''}
            </>
        );
    };

    const bkstatusBodyTemplate = (rowData: any) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                {rowData.bookingstatus}
            </>
        );
    }



    const bkbookingTime = (d: any) => {
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



    return (
        <div className="card">
            <TabView onTabChange={handleTabChange} activeIndex={activeTabIndex}>
                <TabPanel header="Details" leftIcon="pi pi-list mr-2">
                    <div className="card">
                        <span className="text-900 text-xl font-bold mb-4 block">
                            Edit Members
                        </span>
                        <ConfirmDialog />
                        <Toast ref={toast} />
                        <BlockUI blocked={blocked}></BlockUI>
                        <div className="grid">
                            <div className="col-12 lg:col-12">
                                <div className="grid formgrid p-fluid">
                                    <form onSubmit={memberform.handleSubmit} className="field mb-4 col-6">
                                        <div className="field mb-4 col-12">
                                            <span className="p-float-label">
                                                <Calendar showIcon
                                                    dateFormat="dd/mm/yy"
                                                    id="member_date"
                                                    name="member_date"
                                                    value={memberform.values.member_date}
                                                    onChange={(e) => {
                                                        memberform.setFieldValue('member_date', e.target.value);
                                                    }}
                                                    className={classNames({ 'p-invalid': isFormFieldValid('member_date') })}
                                                />
                                                <label htmlFor="member_date">MEMBER REGISTRATION DATE 会员注册日期</label>
                                            </span>
                                            {getFormErrorMessage('member_date')}
                                        </div>


                                        <div className="field mb-4 col-12">
                                            <div> MEMBERSHIP STATUS 会员状态</div>
                                            <span >
                                                <div className="flex">
                                                    {radioBtns.map((btn, i) => {
                                                        return (
                                                            <div key={i} className="flex align-items-center mr-3">
                                                                <RadioButton
                                                                    {...btn}
                                                                    checked={memberform.values.status === btn.value}
                                                                    onChange={(e) => {
                                                                        memberform.setFieldValue('status', e.value);
                                                                    }}
                                                                />
                                                                <label htmlFor={btn.inputId} className="ml-1">
                                                                    {btn.value}
                                                                </label>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                {getFormErrorMessage('status')}
                                            </span></div>






                                        {memberform.values.status === 'Existing Member' && < div className="field mb-4 col-12">
                                            <span className="p-float-label">
                                                <InputText
                                                    id="member_name"
                                                    name="member_name"
                                                    value={memberform.values.member_name}
                                                    onChange={(e) => {
                                                        memberform.setFieldValue('member_name', e.target.value);
                                                    }}
                                                    className={classNames({ 'p-invalid': isFormFieldValid('member_name') })}
                                                />
                                                <label htmlFor="member_name">Existing Member Name 现有会员姓名</label>
                                            </span>
                                            {getFormErrorMessage('member_name')}
                                        </div>
                                        }


                                        {memberform.values.status === 'Existing Member' && <div className="field mb-4 col-12">
                                            <span className="p-float-label">
                                                <InputNumber
                                                    id="existingmobileno"
                                                    name="existingmobileno"
                                                    value={memberform.values.existingmobileno}
                                                    onValueChange={(e) => {
                                                        memberform.setFieldValue('existingmobileno', e.target.value);
                                                    }}
                                                    useGrouping={false}
                                                    min={0}
                                                    className={classNames({ 'p-invalid': isFormFieldValid('existingmobileno') })}
                                                />
                                                <label htmlFor="existingmobileno">Existing Members&apos; Mobile Number 现有会员手机号</label>
                                            </span>
                                            {getFormErrorMessage('existingmobileno')}
                                        </div>
                                        }







                                        <div className="field mb-4 col-12">
                                            <div> Preferred Branch 首选分店</div>
                                            <span >
                                                <Dropdown
                                                    inputId="preferredbranch"
                                                    name="preferredbranch"
                                                    value={memberform.values.preferredbranch}
                                                    options={branch}
                                                    optionLabel='branch_name'
                                                    placeholder="Select Preferred Branch"
                                                    onChange={(e) => {
                                                        memberform.setFieldValue('preferredbranch', e.value);

                                                    }}
                                                />
                                                {getFormErrorMessage('preferredbranch')}
                                            </span></div>


                                        <div className="field mb-4 col-12">
                                            <div> Payment Method 付款方式</div>
                                            <span >

                                                {paymentMethod.map((btn, i) => {
                                                    return (
                                                        <div key={i} className="flex align-items-center mr-3">
                                                            <RadioButton
                                                                {...btn}
                                                                checked={memberform.values.paymentmethod === btn.value}
                                                                onChange={(e) => {
                                                                    memberform.setFieldValue('paymentmethod', btn.value);
                                                                }}
                                                                value={btn.value}
                                                            />
                                                            <label htmlFor={btn.inputId} className="ml-1">
                                                                {btn.value}
                                                            </label>
                                                        </div>
                                                    );
                                                })}

                                                {getFormErrorMessage('paymentmethod')}
                                            </span></div>






                                        <div className="field mb-4 col-12">
                                            <Divider />
                                            <label
                                                htmlFor="bio"
                                                className="font-medium text-900"
                                            >
                                                A】PERSONAL INFORMATION 个人信息
                                            </label>
                                            <Divider />
                                        </div>


                                        <div className="field mb-4 col-12">
                                            <span className="p-float-label">
                                                <InputText
                                                    id="legalFullname"
                                                    name="legalFullname"
                                                    value={memberform.values.legalFullname}
                                                    onChange={(e) => {
                                                        memberform.setFieldValue('legalFullname', e.target.value);
                                                    }}
                                                    className={classNames({ 'p-invalid': isFormFieldValid('legalFullname') })}
                                                />
                                                <label htmlFor="legalFullname">Legal Full Name 姓名 (as per NRIC/Passport)</label>
                                            </span>
                                            {getFormErrorMessage('legalFullname')}
                                        </div>


                                        <div className="field mb-4 col-12">
                                            <span className="p-float-label">
                                                <InputText
                                                    id="preferredname"
                                                    name="preferredname"
                                                    value={memberform.values.preferredname}
                                                    onChange={(e) => {
                                                        memberform.setFieldValue('preferredname', e.target.value);
                                                    }}
                                                    className={classNames({ 'p-invalid': isFormFieldValid('preferredname') })}
                                                />
                                                <label htmlFor="preferredname">Preferred Name 倾向使用的名字</label>
                                            </span>
                                            {getFormErrorMessage('preferredname')}
                                        </div>


                                        <div className="field mb-4 col-12">
                                            <span className="p-float-label">
                                                <InputText
                                                    id="chinesename"
                                                    name="chinesename"
                                                    value={memberform.values.chinesename}
                                                    onChange={(e) => {
                                                        memberform.setFieldValue('chinesename', e.target.value);
                                                    }}
                                                    className={classNames({ 'p-invalid': isFormFieldValid('chinesename') })}
                                                />
                                                <label htmlFor="chinesename">Chinese Name 中文姓名 (if applicable)</label>
                                            </span>
                                            {getFormErrorMessage('chinesename')}
                                        </div>

                                        <div className="field mb-4 col-12">
                                            <span className="p-float-label">
                                                <InputText
                                                    id="passport"
                                                    name="passport"
                                                    value={memberform.values.passport}
                                                    onChange={(e) => {
                                                        memberform.setFieldValue('passport', e.target.value);
                                                    }}
                                                    className={classNames({ 'p-invalid': isFormFieldValid('passport') })}
                                                />
                                                <label htmlFor="passport">NRIC/Passport No. 身份证/护照号码</label>
                                            </span>
                                            {getFormErrorMessage('passport')}
                                        </div>


                                        <div className="field mb-4 col-12">
                                            <span className="p-float-label">
                                                <InputNumber
                                                    id="age"
                                                    name="age"
                                                    value={memberform.values.age}
                                                    onValueChange={(e) => {
                                                        memberform.setFieldValue('age', e.target.value);
                                                    }}
                                                    className={classNames({ 'p-invalid': isFormFieldValid('age') })}
                                                />
                                                <label htmlFor="age">Age 年龄</label>
                                            </span>
                                            {getFormErrorMessage('age')}
                                        </div>

                                        <div className="field mb-4 col-12">
                                            <span className="p-float-label">
                                                <Dropdown
                                                    inputId="gender"
                                                    name="gender"
                                                    value={memberform.values.gender}
                                                    options={gender}
                                                    placeholder="Select a gender"
                                                    onChange={(e) => {
                                                        memberform.setFieldValue('gender', e.value);
                                                    }}
                                                />
                                                <label htmlFor="gender">Gender 性别</label>
                                            </span>
                                            {getFormErrorMessage('gender')}
                                        </div>

                                        <div className="field mb-4 col-12">
                                            <span className="p-float-label">
                                                <Calendar showIcon
                                                    dateFormat="dd/mm/yy"
                                                    id="dob"
                                                    name="dob"
                                                    value={memberform.values.dob}
                                                    onChange={(e) => {
                                                        memberform.setFieldValue('dob', e.target.value);
                                                    }}
                                                    className={classNames({ 'p-invalid': isFormFieldValid('dob') })}
                                                />
                                                <label htmlFor="dob"> Date of Birth 生日日期</label>
                                            </span>
                                            {getFormErrorMessage('dob')}
                                        </div>

                                        <div className="field mb-4 col-12">
                                            <span className="p-float-label">
                                                <InputTextarea
                                                    id="address"
                                                    name="address"
                                                    rows={5}
                                                    autoResize
                                                    value={memberform.values.address}
                                                    onChange={(e) => {
                                                        memberform.setFieldValue('address', e.target.value);
                                                    }}
                                                    className={classNames({ 'p-invalid': isFormFieldValid('address') })}
                                                />
                                                <label htmlFor="address">Address 地址</label>
                                            </span>
                                            {getFormErrorMessage('address')}
                                        </div>

                                        <div className="field mb-4 col-12">
                                            <span className="p-float-label">
                                                <InputText
                                                    id="city"
                                                    name="city"
                                                    value={memberform.values.city}
                                                    onChange={(e) => {
                                                        memberform.setFieldValue('city', e.target.value);
                                                    }}
                                                    className={classNames({ 'p-invalid': isFormFieldValid('city') })}
                                                />
                                                <label htmlFor="city">  City 城市</label>
                                            </span>
                                            {getFormErrorMessage('city')}
                                        </div>

                                        <div className="field mb-4 col-12">
                                            <span className="p-float-label">
                                                <InputNumber
                                                    id="postcode"
                                                    name="postcode"
                                                    value={memberform.values.postcode}
                                                    onValueChange={(e) => {
                                                        memberform.setFieldValue('postcode', e.target.value);
                                                    }}
                                                    className={classNames({ 'p-invalid': isFormFieldValid('postcode') })}
                                                />
                                                <label htmlFor="postcode">Postcode 邮箱号</label>
                                            </span>
                                            {getFormErrorMessage('postcode')}
                                        </div>


                                        <div className="field mb-4 col-12">
                                            <span className="p-float-label">
                                                <InputText
                                                    id="states"
                                                    name="states"
                                                    value={memberform.values.states}
                                                    onChange={(e) => {
                                                        memberform.setFieldValue('states', e.target.value);
                                                    }}
                                                    className={classNames({ 'p-invalid': isFormFieldValid('states') })}
                                                />
                                                <label htmlFor="states">States 州属</label>
                                            </span>
                                            {getFormErrorMessage('states')}
                                        </div>


                                        <div className="field mb-4 col-12">
                                            <span className="p-float-label">
                                                <InputNumber
                                                    useGrouping={false}
                                                    id="mobileNumber"
                                                    name="mobileNumber"
                                                    value={memberform.values.mobileNumber}
                                                    onValueChange={(e) => {
                                                        memberform.setFieldValue('mobileNumber', e.target.value);
                                                    }}
                                                    className={classNames({ 'p-invalid': isFormFieldValid('mobileNumber') })}
                                                />
                                                <label htmlFor="mobileNumber">Mobile Number 手机号</label>
                                            </span>
                                            {getFormErrorMessage('mobileNumber')}
                                        </div>


                                        <div className="field mb-4 col-12">
                                            <span className="p-float-label">
                                                <InputText
                                                    id="email"
                                                    name="email"
                                                    value={memberform.values.email}
                                                    onChange={(e) => {
                                                        memberform.setFieldValue('email', e.target.value);
                                                    }}
                                                    className={classNames({ 'p-invalid': isFormFieldValid('email') })}
                                                />
                                                <label htmlFor="email">Email Address 邮箱</label>
                                            </span>
                                            {getFormErrorMessage('email')}
                                        </div>


                                        <div className="field mb-4 col-12">
                                            <Button type="submit" label="Save" />
                                            
                                        </div>

                                        <div className="field mb-4 col-12">
                                            <Button
                                                label="Back"
                                                className="p-button-secondary"
                                                onClick={() => router.push("/members/info")}
                                            />
                                        </div>

                                       

                                       
                                      

                                    </form>
                                </div>
                            </div>
                        </div >
                    </div >
                </TabPanel>
                <TabPanel header="Package Info" leftIcon="pi pi-list mr-2">
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
                                    lazy filterDisplay="row" dataKey="_id" paginator
                                    first={pilazyState.first} rows={10}
                                    totalRecords={pitotalRecords} 
                                    onPage={onPipage}
                                    onFilter={onPifilter}
                                    onSort={onPiSort}
                                    sortField={pilazyState.sortField}
                                    sortOrder={pilazyState.sortOrder}
                                    loading={loading}
                                    emptyMessage="Not found.">
                                    <Column
                                        field="package_date"
                                        header="Date"
                                        body={datepackage}
                                        sortable
                                        headerStyle={{ minWidth: "12rem" }}
                                    ></Column>


                                    <Column
                                        field="package"
                                        header="Package Name"
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

                                    <Column
                                        field="balance"
                                        header="Balance"
                                        style={{ minWidth: "12rem" }}
                                    />

                                    <Column
                                        field="used"
                                        header="Used"
                                        style={{ minWidth: "10rem" }}
                                    />

                                    <Column
                                        field="transferedtimes"
                                        header="Transfer"
                                        style={{ minWidth: "10rem" }}
                                    />


                                    <Column
                                        field="balance"
                                        header="Balance"
                                        style={{ minWidth: "10rem" }}
                                    />



                                </DataTable>
                            </div>
                        </div>
                    </div >

                </TabPanel>
                <TabPanel header="Transfer Session" leftIcon="pi pi-calendar mr-2">
                    <div className="grid">
                        <div className="col-12 lg:col-12" >
                            <div className="card">
                                <div className="flex flex-column md:flex-row md:align-items-start md:justify-content-between mb-3">
                                    <div className="text-900 text-xl font-semibold mb-3 md:mb-0">
                                        Transfer Session
                                    </div>

                                </div>
                                <DataTable
                                    ref={dt}
                                    value={tcdata}
                                    lazy filterDisplay="row" dataKey="_id" paginator
                                    first={tclazyState.first} rows={10}
                                    totalRecords={tctotalRecords} onPage={onTcpage}
                                    onFilter={onTcfilter}
                                    loading={loading}
                                    emptyMessage="Not found.">
                                    <Column
                                        field="transfer_date"
                                        header="Date"
                                        body={dateBodyTemplate}
                                        sortable
                                        headerStyle={{ minWidth: "12rem" }}
                                    ></Column>


                                    <Column
                                        field="member"
                                        header="Transfer To"
                                        body={memberTo}

                                        style={{ minWidth: "12rem" }}
                                    />

                                    <Column
                                        field="Package"
                                        header="Package"
                                        body={packagename}

                                        style={{ minWidth: "12rem" }}
                                    />



                                    <Column
                                        field="points"
                                        header="Points"
                                        style={{ minWidth: "12rem" }}
                                    />





                                </DataTable>
                            </div>
                        </div>
                    </div >

                </TabPanel>


                <TabPanel header="Booking Status" leftIcon="pi pi-calendar mr-2">
                    <div className="grid">
                        <div className="col-12 lg:col-12" >
                            <div className="card">
                                <div className="flex flex-column md:flex-row md:align-items-start md:justify-content-between mb-3">
                                    <div className="text-900 text-xl font-semibold mb-3 md:mb-0">
                                        Booking and Checkin Status
                                    </div>
                                </div>
                                <DataTable
                                    ref={dt}
                                    value={bkdata}
                                    lazy filterDisplay="row" dataKey="_id" paginator
                                    first={bklazyState.first} rows={10}
                                    totalRecords={bktotalRecords} onPage={onBkPage}
                                    onFilter={onBkFilter}
                                    onSort={onBkSort}
                                    sortField={bklazyState.sortField}
                                    sortOrder={bklazyState.sortOrder}
                                    loading={loading}>

                                    <Column
                                        field="booking_date"
                                        header="Date"
                                        filter
                                        sortable
                                        filterField="booking_date"
                                        filterPlaceholder="Filter by date"
                                        showFilterMenu={false}
                                        showClearButton={false}
                                        body={bkdateBodyTemplate}
                                        headerClassName="white-space-nowrap"
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
                                        body={bkmembername}
                                        style={{ minWidth: "10rem" }}
                                    />

                                    <Column
                                        filter
                                        sortable
                                        showFilterMenu={false}
                                        showClearButton={false}
                                        field="branch"
                                        body={bkbrancename}
                                        header="Branch"
                                        style={{ minWidth: "10rem" }}
                                    />

                                    <Column
                                        filter
                                        sortable
                                        showFilterMenu={false}
                                        showClearButton={false}
                                        field="floor"
                                        body={bkfloorname}
                                        header="Floor"
                                        style={{ minWidth: "10rem" }}
                                    />

                                    <Column
                                        field="room"
                                        body={bkroomname}
                                        header="Room"
                                        style={{ minWidth: "6rem" }}
                                    />

                                    <Column
                                        field="price"
                                        header="Time"
                                        body={bkbookingTime}
                                        style={{ minWidth: "10rem" }}
                                    />

                                    <Column
                                        filter
                                        sortable
                                        showFilterMenu={false}
                                        showClearButton={false}
                                        field="bookingstatus"
                                        header="Status"
                                        body={bkstatusBodyTemplate}
                                        style={{ minWidth: "10rem" }}

                                    ></Column>


                                </DataTable>
                            </div>
                        </div>
                    </div >

                </TabPanel>

            </TabView>
        </div>
    );
}

export default List;
