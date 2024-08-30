'use client';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from "react";
import API from '@/anran/service/api';
import { BlockUI } from 'primereact/blockui';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { useFormik } from 'formik';
import { confirmDialog } from 'primereact/confirmdialog';
import { InputNumber } from "primereact/inputnumber";
import React, { useRef } from "react";
import { Toast } from 'primereact/toast';
import { useRouter } from "next/navigation";
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';


function CreatePackage() {

    const toast = useRef<Toast>(null);
    const router = useRouter();
    const [blocked, setBlocked] = useState(false);
    const [ingredients, setIngredients] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [value, setValue] = useState(1);
    const [memberlst, setMemberlst] = useState<any[]>([]);
    const [Packagelst, setPackagelst] = useState<any[]>([]);
    const [branch, setBranch] = useState<any[]>([]);
    const [object, setObject] = useState<any[]>([]);
    const paymenttype = ['Visa', 'Master', 'MyDebit', 'eWallet', 'Online Transfer', 'Curlec'];

    useEffect(() => {
        API.get('branch').then(function (response: any) {
            setBranch(response.data);
        }).catch(function (error) {
            console.log(error);
        });

        API.get('members').then(function (response: any) {
            setMemberlst(response.data);
        }).catch(function (error) {
            console.log(error);
        });

        API.get('package').then(function (response: any) {
            setPackagelst(response.data);
        }).catch(function (error) {
            console.log(error);
        });

    }, []);


    const avaliableFloor = async (e: any) => {
        if (e) {
            setObject([]);
            setIngredients([]);
            memberform.setFieldValue('member_package', '');
            await API.get('package/packagesByBranch/' + e._id).then(function (response: any) {
                setPackagelst(response.data);
            }).catch(function (error) {
                console.log(error);
            });
        }
    };

    const memberform = useFormik({
        initialValues: {
            member: '',
            member_package: '',
            branch: '',
            paymenttype: '',
            invoicenumber: ''
        },
        validate: (data) => {
            let errors: any = {};
            if (!data.member) {
                errors.member = 'Member From is required.';
            }
            if (!data.member_package) {
                errors.member_package = 'Package Plan is required.';
            }
            // if (!data.invoicenumber) {
            //     errors.invoicenumber = 'Invoice Number is required.';
            // }
            if (!data.paymenttype) {
                errors.paymenttype = 'Payment Type is required.';
            }
            if (!data.branch) {
                errors.branch = 'Branch is required.';
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
                    object.forEach((event: any) => {
                        event.member = data.member
                        event.price = event.price * event.quantity;
                        event.times = event.times * event.quantity;
                        event.balance = event.times;
                        event.balance = event.times;
                        event.branch = data.branch;
                    });
                    API.post('memberpackage', object).then(function (response) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'info', summary: 'Status', detail: 'Members Package Created Successfully!!!', life: 3000 });
                        }
                        router.push("/paymentlist");
                    }).catch(function (error) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'error', summary: 'Status', detail: 'Members Package Not able to create', life: 3000 });
                        }
                    });
                    setBlocked(false);
                },
            });
        }

    });

    const onIngredientsChange = (e: any) => {
        if (!memberform.values.member) {
            if (toast && toast.current) {
                toast.current.show({ severity: 'error', summary: 'Status', detail: 'Select Members and choose Package', life: 3000 });
            }
        } else {
            let _ingredients = [...ingredients];
            if (e.checked) {
                memberform.setFieldValue('member_package', e.value);
                _ingredients.push(e.value);
            } else {
                const index = _ingredients.indexOf(e.value);
                if (index !== -1) {
                    _ingredients.splice(index, 1);
                    memberform.setFieldValue('member_package', _ingredients);
                }
            }
            setIngredients(_ingredients);
            const updatedObject = _ingredients.map(event => {
                // Find the existing quantity if the package is already in the object array
                const existingItem = object.find(obj => obj.packageid === event._id);
                const quantity = existingItem ? existingItem.quantity : 1;
                return {
                    member: memberform.values.member,
                    packageid: event._id,
                    package: event.package_name,
                    times: event.noof_times,
                    quantity: quantity,
                    price: event.price,
                    priceqty: event.priceqty,
                    balance: event.noof_times,
                    paymenttype: memberform.values.paymenttype,
                    //invoicenumber: memberform.values.invoicenumber
                };
            });
            setObject(updatedObject);
            updateTotal(updatedObject);
        }
    }

    const updateTotal = (items: any[]) => {
        const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(totalPrice);
    };

    const onQuantityChange = (e: any, item: any) => {
        const updatedObject = object.map((obj: any) => {
            if (obj.packageid === item.packageid) {
                return { ...obj, quantity: e.value, price: item.price };
            }
            return obj;
        });
        setObject(updatedObject);
        updateTotal(updatedObject);
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




    return (
        <div className="card">
            <ConfirmDialog />
            <Toast ref={toast} />
            <BlockUI blocked={blocked}></BlockUI>
            <form onSubmit={memberform.handleSubmit} className="col-12 p-fluid formgrid grid">
                <ConfirmDialog />
                <Toast ref={toast} />
                <BlockUI blocked={blocked}></BlockUI>

                <div className="field mb-4 col-12">
                    <span className="p-float-label">
                        <Dropdown
                            inputId="member"
                            name="member"
                            value={memberform.values.member}
                            options={memberlst}
                            optionLabel='member_name'
                            placeholder="Select a Member"
                            onChange={(e) => {
                                memberform.setFieldValue('member', e.value);
                            }}
                        />
                        <label htmlFor="member">Select Member</label>
                    </span>
                    {getFormErrorMessage('member')}
                </div>

                <div className="field mb-4 col-12">
                    <span className="p-float-label">
                        <Dropdown
                            inputId="branch"
                            name="branch"
                            value={memberform.values.branch}
                            options={branch}
                            optionLabel='branch_name'
                            placeholder="Select a Branch"
                            onChange={(e) => {
                                memberform.setFieldValue('branch', e.value);
                                avaliableFloor(e.value)
                            }}
                        />
                        <label htmlFor="member">Select Branch</label>
                    </span>
                    {getFormErrorMessage('branch')}
                </div>
                <div className="field mb-4 col-12">
                    <span className="p-float-label">
                        <Dropdown
                            inputId="paymenttype"
                            name="paymenttype"
                            value={memberform.values.paymenttype}
                            options={paymenttype}
                            placeholder="Select a Type"
                            onChange={(e) => {
                                memberform.setFieldValue('paymenttype', e.value);
                            }}
                        />
                        <label htmlFor="paymenttype">Payment Mode</label>
                    </span>
                    {getFormErrorMessage('paymenttype')}
                </div>



                <div className="field mb-4 col-12">
                    <div>  Package Plan</div>
                    <span >
                        {Packagelst.map((btn, i) => {
                            return (
                                <div key={i} className="flex align-items-center mr-3">
                                    <Checkbox
                                        {...btn}
                                        onChange={onIngredientsChange}
                                        checked={ingredients.includes(btn)}
                                        value={btn}
                                    />
                                    <label htmlFor={btn._id} className="ml-1">
                                        {btn.package_name}
                                    </label>
                                </div>
                            );
                        })}

                    </span>
                    {getFormErrorMessage('member_package')}
                </div>
                <div className="col-12 lg:col-12">
                    {object.map((btn, i) => {
                        return (
                            <div key={i} >
                                <ul className="list-none p-0 m-0">
                                    <li className="flex flex-column md:flex-row py-6 border-top-1 border-bottom-1 surface-border md:align-items-center">

                                        <div className="flex-auto ">
                                            <div className="flex flex-wrap align-items-start sm:align-items-center sm:flex-row sm:justify-content-between surface-border pb-2">
                                                <div className="w-full sm:w-6 flex flex-column">
                                                    <span className="text-900 text-xl font-medium mb-3">{btn.package}</span>
                                                    <span className="text-700"> Times {btn.times}</span>
                                                </div>
                                                <div className="w-full sm:w-6 flex align-items-start justify-content-between mt-3 sm:mt-0">
                                                    <div>
                                                        <span className="text-900 text-xl font-medium mb-3">
                                                            <InputNumber min={1} value={btn.quantity} onValueChange={(e) => onQuantityChange(e, btn)} showButtons buttonLayout="vertical" style={{ width: '4rem' }}
                                                                decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-column sm:align-items-end">
                                                        <span className="text-900 text-xl font-medium mb-2 sm:mb-3">RM {btn.price * btn.quantity}</span>

                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </li>
                                </ul>
                            </div>
                        );
                    })}
                    <div className="flex">
                        <div className="w-12rem hidden md:block"></div>
                        <ul className="list-none py-0 pr-0 pl-0 md:pl-5 mt-6 mx-0 mb-0 flex-auto">
                            <li className="flex justify-content-between border-top-1 surface-border mb-4 pt-4">
                                <span className="text-xl text-900 font-bold text-3xl">Total</span>
                                <span className="text-xl text-900 font-bold text-3xl">RM {total}</span>
                            </li>
                            <li className="flex justify-content-end">
                                <br />
                            </li>
                        </ul>
                    </div>
                </div>


                <div className="field mb-4 col-12">
                    <Button type="submit" label="Save" icon="pi pi-check"/>
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
    );
}
export default CreatePackage;
