"use client";
import React, { useRef } from "react";
import { Toast } from 'primereact/toast';
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from 'primereact/calendar';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { Divider } from 'primereact/divider';
import { useFormik } from 'formik';
import API from '@/anran/service/api';
import { classNames } from 'primereact/utils';
import { confirmDialog } from 'primereact/confirmdialog';
import { InputNumber } from "primereact/inputnumber";
import type { Branch } from "@/types";
import { BlockUI } from 'primereact/blockui';
import { ConfirmDialog } from 'primereact/confirmdialog';


function ProfileCreate() {

    const toast = useRef<Toast>(null);
    const router = useRouter();
    const [blocked, setBlocked] = useState(false);
    const [brancename, setBrancename] = useState('');
    const [branch, setBranch] = useState<Branch[]>([]);
    const [Package, setPackage] = useState<any[]>([]);
    const [ingredients, setIngredients] = useState<any[]>([]);
    const [checked, setChecked] = useState<any[]>([]);



    const gender = ['Male', 'Female', 'Transgender'];
    const aboutus = ['Family', 'Friend', 'Facebook', 'Advertisement', 'Others, please specify', 'Anran Outlet']
    const suffered = ['Recent Operation', 'Severe Heart Disease', 'Severe Circulatory Problems', 'Cardiac Pacemaker', 'Cancer/Cancer Treatment (Chemo/Targeted Therapy)', 'Severe High Blood Pressure', 'Skin Disease', 'Viral Infection', 'Fever', 'Recent Scars', 'Pregnancy', 'During Period', 'None of the Above']



    const memberform = useFormik({
        initialValues: {
            member_date: '',
            member_name: '',
            status: 'Existing Member',
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
            aboutus: '',
            medicalhistory: '',
            suffered: '',
            healthrelatedissue: false,
            emergencyName: '',
            emergencymobile: '',
            emergencyrelationship: '',
            agree: false
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
            if (!data.status && data.status === 'Existing Member') {
                if (!data.existingmobileno) {
                    errors.existingmobileno = 'Existing Members Mobile Number is required.';
                }
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
                errors.postcode = 'Postcode is required.';
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
            if (!data.healthrelatedissue) {
                errors.healthrelatedissue = 'You must agree to the terms and conditions';
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
                    API.post('Members', data).then(function (response) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'info', summary: 'Status', detail: 'Members Created Successfully!!!', life: 3000 });
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

    useEffect(() => {
        API.get('branch').then(function (response: any) {
            setBranch(response.data);
        }).catch(function (error) {
            console.log(error);
        });
        API.get('package').then(function (response: any) {
            setPackage(response.data);
        }).catch(function (error) {
            console.log(error);
        });

        if (memberform.values.dob) {
            const age = calculateAge(memberform.values.dob);
            memberform.setFieldValue('age', age);
        } else {
            memberform.setFieldValue('age', 0);
        }

    }, [memberform.values.dob]);



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

    const isFormFieldValid = (name: string) => !!(memberform.touched[name] && memberform.errors[name]);

    const getFormErrorMessage = (name: string) => {
        if (isFormFieldValid(name) && memberform.errors) {
            let err: any = memberform.errors;
            return <small className="p-error">{err[name]}</small>;
        } else {
            return "";
        }
    };


    const onGenderChange = (e: any) => {
        let selected = [...checked];
        if (e.checked) {
            selected.push(e.value);
        } else {
            selected = selected.filter(val => val !== e.value);
        }
        setChecked(selected);
        memberform.setFieldValue('suffered', selected, false);
    }

    const calculateAge = (dob: Date | string) => {
        const birthDate = typeof dob === 'string' ? new Date(dob) : dob;
        if (isNaN(birthDate.getTime())) {
            alert('Invalid Date');
            return 0;
        }
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="card">
            <span className="text-900 text-xl font-bold mb-4 block">
                Create Members
            </span>
            <ConfirmDialog />
            <Toast ref={toast} />
            <BlockUI blocked={blocked}></BlockUI>
            <form onSubmit={memberform.handleSubmit} className="col-12 p-fluid formgrid grid" autoComplete="off">
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





                < div className="field mb-4 col-12">
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
                        <label htmlFor="member_name">Member Name 现有会员姓名</label>
                    </span>
                    {getFormErrorMessage('member_name')}
                </div>






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
                    {/* {getFormErrorMessage('chinesename')} */}
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
                        <InputNumber
                            id="age"
                            name="age"
                            disabled
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
                            useGrouping={false}
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


                <div className="field mb-4 col-12" >
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
                    <span className="p-float-label">
                        <Dropdown
                            inputId="aboutus"
                            name="aboutus"
                            value={memberform.values.aboutus}
                            options={aboutus}
                            placeholder="Select a aboutus"
                            onChange={(e) => {
                                memberform.setFieldValue('aboutus', e.value);
                            }}
                        />
                        <label htmlFor="aboutus">How did you hear about us</label>
                    </span>
                    {getFormErrorMessage('aboutus')}
                </div>










                <div className="field mb-4 col-12">
                    <Divider />
                    <label
                        htmlFor="bio"
                        className="font-medium text-900"
                    >
                        B】MEDICAL HISTORY
                    </label>
                    <Divider />
                </div>


                <div className="field mb-4 col-12">
                    <span className="p-float-label">
                        <InputTextarea
                            id="medicalhistory"
                            name="medicalhistory"
                            rows={5}
                            autoResize
                            value={memberform.values.medicalhistory}
                            onChange={(e) => {
                                memberform.setFieldValue('medicalhistory', e.target.value);
                            }}
                            className={classNames({ 'p-invalid': isFormFieldValid('medicalhistory') })}
                        />
                        <label htmlFor="medicalhistory"> Medical History</label>
                    </span>
                    {getFormErrorMessage('medicalhistory')}
                </div>


                <div className="field mb-4 col-12">
                    <div>Do you have or have you suffered from any of the following</div>
                    <span >
                        {
                            suffered.map((suffered, index) => (
                                <div key={index} className="field-checkbox">
                                    <Checkbox
                                        inputId={suffered}
                                        value={suffered}
                                        checked={checked.includes(suffered)}
                                        onChange={onGenderChange}
                                    />
                                    <label htmlFor={suffered}>{suffered}</label>
                                </div>
                            ))}
                        {getFormErrorMessage('suffered')}
                    </span></div>

                <Divider />
                <div className="field mb-4 col-12">
                    <div className="flex align-items-center">
                        <Checkbox inputId="healthrelatedissue" name="healthrelatedissue" onChange={e => memberform.setFieldValue('healthrelatedissue', e.checked)} checked={memberform.values.healthrelatedissue} />
                        &nbsp; &nbsp; &nbsp;<label htmlFor="medicalhistory">I understand above mentioned precautions and give consent that i do not have
                            any health related issue</label>
                    </div>
                    {getFormErrorMessage('healthrelatedissue')}
                </div>

                <div className="field mb-4 col-12">
                    <Divider />
                    <label
                        htmlFor="bio"
                        className="font-medium text-900"
                    >
                        C】EMERGENCY CONTACT
                    </label>

                    <label
                        htmlFor="bio"
                        className="font-medium text-900">
                        An emergency contact is someone you designate to be contacted in an emergency or crisis.
                        This individual should be someone you trust, knowledgeable about your details, medical
                        conditions, and preferences, and can be a reliable source of support during difficult
                        situations.
                    </label>
                    <Divider />
                </div>


                <div className="field mb-4 col-12">
                    <span className="p-float-label">
                        <InputText
                            id="emergencyName"
                            name="emergencyName"
                            value={memberform.values.emergencyName}
                            onChange={(e) => {
                                memberform.setFieldValue('emergencyName', e.target.value);
                            }}
                            className={classNames({ 'p-invalid': isFormFieldValid('emergencyName') })}
                        />
                        <label htmlFor="emergencyName">Name</label>
                    </span>
                    {getFormErrorMessage('emergencyName')}
                </div>

                <div className="field mb-4 col-12">
                    <span className="p-float-label">
                        <InputText
                            id="emergencymobile"
                            name="emergencymobile"
                            value={memberform.values.emergencymobile}
                            onChange={(e) => {
                                memberform.setFieldValue('emergencymobile', e.target.value);
                            }}
                            className={classNames({ 'p-invalid': isFormFieldValid('emergencymobile') })}
                        />
                        <label htmlFor="emergencymobile">Landline/Mobile Number</label>
                    </span>
                    {getFormErrorMessage('emergencymobile')}
                </div>

                <div className="field mb-4 col-12">
                    <span className="p-float-label">
                        <InputText
                            id="emergencyrelationship"
                            name="emergencyrelationship"
                            value={memberform.values.emergencyrelationship}
                            onChange={(e) => {
                                memberform.setFieldValue('emergencyrelationship', e.target.value);
                            }}
                            className={classNames({ 'p-invalid': isFormFieldValid('emergencyrelationship') })}
                        />
                        <label htmlFor="emergencyrelationship">Relationship</label>
                    </span>
                    {getFormErrorMessage('emergencyrelationship')}
                </div>


                <div className="col-12">
                    <Button type="submit" label="Save" />
                </div>

            </form>

        </div >
    );
}

export default ProfileCreate;
