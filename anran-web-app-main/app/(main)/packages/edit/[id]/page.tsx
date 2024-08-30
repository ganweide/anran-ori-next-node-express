"use client";
import React, { useRef } from "react";
import { useFormik } from 'formik';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from '@/anran/service/api';
import { BlockUI } from 'primereact/blockui';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload, FileUploadUploadEvent } from 'primereact/fileupload';
import { ToggleButton } from 'primereact/togglebutton';
import { Calendar } from 'primereact/calendar';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { Image } from 'primereact/image';
import { Checkbox } from 'primereact/checkbox';
import { Roles } from "@/anran/service/roles";
import { InputSwitch } from "primereact/inputswitch";
import { Dropdown } from "primereact/dropdown";

function PackageEdit({ params }: { params: { id: string } }) {
    const toast = useRef<Toast>(null);
    const router = useRouter();
    const [blocked, setBlocked] = useState(false);
    const { id } = params;
    const fileRef = useRef<FileUpload>(null);
    const [data, setData] = useState<any[]>([]);
    const category = ['Single Steam', 'Voucher', 'Normal', 'Promotion'];

    useEffect(() => {
        const userRole = localStorage.getItem('roles');
        if (!(userRole && userRole.length > 0 && userRole.includes(Roles.admin_package_update))) {
            router.push("/accessdenied");
        }
        API.get('branch').then(function (response: any) {
            setData(response.data);
        }).catch(function (error) {
            console.log(error);
        });
        API.get('package/' + id).then(function (response: any) {
            formik.setFieldValue('sortorder', response.data.sortorder, false);
            formik.setFieldValue('status_active', response.data.status_active, false);
            formik.setFieldValue('unlimitedyear', response.data.unlimitedyear, false);
            formik.setFieldValue('package_name', response.data.package_name, false);
            formik.setFieldValue('price', response.data.price, false);
            formik.setFieldValue('noof_times', response.data.noof_times, false);
            formik.setFieldValue('promo_noof_times', response.data.promo_noof_times, false);
            formik.setFieldValue('package_image_url', response.data.package_image_url, false);
            formik.setFieldValue('package_image', response.data.package_image, false);
            formik.setFieldValue('transferable', response.data.transferable, false);
            formik.setFieldValue('individual_package', response.data.individual_package, false);
            formik.setFieldValue('promotion_period_from', new Date(response.data.promotion_period_from), false);
            formik.setFieldValue('promotion_period_to', new Date(response.data.promotion_period_to), false);
            formik.setFieldValue('branch', response.data.branch, false);
            formik.setFieldValue('percentage_ownbranch', response.data.percentage_ownbranch, false);
            formik.setFieldValue('price_ownbranch', response.data.price_ownbranch, false);
            formik.setFieldValue('all_branch', response.data.all_branch, false);
            if (response.data.package_category)
                formik.setFieldValue('package_category', response.data.package_category, false);
            formik.setFieldValue('price_checkinbranch', response.data.price_checkinbranch, false);
            if (response.data.promotion)
                formik.setFieldValue('promotion', response.data.promotion, false);
        }).catch(function (error) {
            console.log(error);
        });
    }, []);

    const formik = useFormik({
        initialValues: {
            package_name: '',
            price: null,
            noof_times: null,
            promo_noof_times: null,
            package_image_url: null,
            package_image: null,
            transferable: false,
            individual_package: true,
            promotion_period_from: null,
            promotion_period_to: null,
            branch: [],
            percentage_ownbranch: null,
            price_ownbranch: null,
            price_checkinbranch: null,
            all_branch: false,
            sortorder: 1,
            status_active: true,
            unlimitedyear: false,
            package_category: null,
            promotion: false,
        },
        validate: (data) => {
            let errors: any = {};
            if (!data.package_name) {
                errors.package_name = 'Package Name is required.';
            }
            if (!data.price) {
                errors.price = 'Price is required.';
            }
            if (!data.noof_times && data.unlimitedyear === false) {
                errors.noof_times = 'No of Times is required.';
            }
            if (!data.package_category) {
                errors.package_category = 'Package Category is required.';
            }
            if (!data.transferable) {
                errors.transferable = 'Transferable is required.';
            }
            if (!data.individual_package) {
                errors.individual_package = 'Package Type is required.';
            }
            if (data.promotion && data.promotion === true) {
                errors.promotion_period_from = 'Promotion period required';
                errors.promotion_period_to = 'Promotion period required';
                errors.promo_noof_times = 'No of Times is required.';
            }
            if (data.promotion_period_from && data.promotion_period_to) {
                if (data.promotion_period_from >= data.promotion_period_to) {
                    errors.promotion_period_to = 'Promotion period to must be greater than promotion period from';
                }
            }
            if (!data.sortorder) {
                errors.sortorder = 'Sort Order is required.';
            }
            if (data.all_branch === false && (!data.branch || data.branch.length === 0)) {
                errors.branch = 'Branch is required.';
            }
            return errors;
        },
        onSubmit: (data: any) => {
            confirmDialog({
                message: 'Are you sure you want to Update?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept() {
                    setBlocked(true);
                    if (data.unlimitedyear === true) {
                        data.noof_times = 0;
                    }
                    API.put('package/' + id, data).then(function (response) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'info', summary: 'Status', detail: 'Package Update Successfully!!!', life: 3000 });
                        }
                        formik.resetForm();
                        router.push("/packages/summary");
                    }).catch(function (error) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'error', summary: 'Status', detail: 'Package Not able to Update', life: 3000 });
                        }
                    });
                    setBlocked(false);
                },
            });
        }
    });

    const isFormFieldValid = (name: string) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name: string) => {
        if (isFormFieldValid(name) && formik.errors) {
            let err: any = formik.errors;
            return <small className="p-error">{err[name]}</small>;
        } else {
            return "";
        }
    };

    const onUpload = (event: FileUploadUploadEvent) => {
        if (event.xhr.status === 200 && event.files) {
            formik.setFieldValue('package_image', event.files[0].name);
            formik.setFieldValue('package_image_url', event.xhr.response);
        } else {
            if (toast && toast.current) {
                toast.current.show({ severity: 'error', summary: 'Status', detail: 'File not able to Upload.', life: 3000 });
            }
        }
    }

    return (
        <div className="card">
            <span className="text-900 text-xl font-bold mb-4 block">
                Edit Package
            </span>
            <ConfirmDialog />
            <Toast ref={toast} />
            <BlockUI blocked={blocked}>
                <form onSubmit={formik.handleSubmit}>
                    <div className="surface-0 p-4 shadow-2 border-round col-12 p-fluid formgrid grid">
                        <div className="field mb-4 col-12 md:col-12 text-xl font-medium text-600 mb-3">Package Setup</div>
                        <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <InputText
                                    id="package_name"
                                    name="package_name"
                                    value={formik.values.package_name}
                                    onChange={(e) => {
                                        formik.setFieldValue('package_name', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldValid('package_name') })}
                                />
                                <label htmlFor="package_name">Package Name</label>
                            </span>
                            {getFormErrorMessage('package_name')}
                        </div>
                        <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <InputNumber
                                    id="price"
                                    name="price"
                                    value={formik.values.price}
                                    useGrouping={false}
                                    onChange={(e) => {
                                        formik.setFieldValue('price', e.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldValid('price') })}
                                />
                                <label htmlFor="price">Price(RM)</label>
                            </span>
                            {getFormErrorMessage('price')}
                        </div>
                        <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <Dropdown
                                    inputId="package_category"
                                    name="package_category"
                                    value={formik.values.package_category}
                                    options={category}
                                    placeholder="Select a Category"
                                    onChange={(e) => {
                                        formik.setFieldValue('package_category', e.value);
                                    }}
                                />
                                <label htmlFor="package_category">Category</label>
                            </span>
                            {getFormErrorMessage('package_category')}
                        </div>
                        <div className="field mb-4 col-12 md:col-2">
                            <span>
                                <Checkbox inputId="unlimitedyear" name="unlimitedyear" onChange={e => formik.setFieldValue('unlimitedyear', e.checked)} checked={formik.values.unlimitedyear} />
                                <label htmlFor="unlimitedyear">Unlimited</label>
                            </span>
                            {getFormErrorMessage('unlimitedyear')}
                        </div>
                        {!formik.values.unlimitedyear ?
                            <div className="field mb-4 col-12 md:col-4">
                                <span className="p-float-label">
                                    <InputNumber
                                        id="noof_times"
                                        name="noof_times"
                                        value={formik.values.noof_times}
                                        useGrouping={false}
                                        onChange={(e) => {
                                            formik.setFieldValue('noof_times', e.value);
                                        }}
                                        className={classNames({ 'p-invalid': isFormFieldValid('noof_times') })}
                                    />
                                    <label htmlFor="noof_times">No Of Times</label>
                                </span>
                                {getFormErrorMessage('noof_times')}
                            </div> :
                            <div className="field mb-4 col-12 md:col-4"></div>
                        }
                        <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <ToggleButton id="transferable"
                                    name="transferable" className={classNames({ 'p-invalid': isFormFieldValid('transferable') })} checked={formik.values.transferable} onChange={(e) => formik.setFieldValue('transferable', e.value)} />
                                <label htmlFor="transferable">Transferable</label>
                            </span>
                            {getFormErrorMessage('transferable')}
                        </div>
                        <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <ToggleButton id="individual_package"
                                    name="individual_package" className={classNames({ 'p-invalid': isFormFieldValid('individual_package') })} checked={formik.values.individual_package} onChange={(e) => formik.setFieldValue('individual_package', e.value)} />
                                <label htmlFor="individual_package">Individual Package</label>
                            </span>
                            {getFormErrorMessage('individual_package')}
                        </div>
                    </div>
                    <div className="surface-0 p-4 shadow-2 border-round col-12 p-fluid formgrid grid">
                        <div className="field mb-4 col-12 md:col-12 text-xl font-medium text-600 mb-3">Promotion</div>
                        <div className="field mb-4 col-12 md:col-2">
                            <span>
                                <Checkbox inputId="promotion" name="promotion" onChange={e => formik.setFieldValue('promotion', e.checked)} checked={formik.values.promotion} />
                                <label htmlFor="promotion">Promotion</label>
                            </span>
                            {getFormErrorMessage('promotion')}
                        </div>
                        {formik.values.promotion ?
                            <div className="field mb-4 col-12 md:col-3">
                                <span className="p-float-label">
                                    <InputNumber
                                        id="promo_noof_times"
                                        name="promo_noof_times"
                                        value={formik.values.promo_noof_times}
                                        useGrouping={false}
                                        onChange={(e) => {
                                            formik.setFieldValue('promo_noof_times', e.value);
                                        }}
                                        className={classNames({ 'p-invalid': isFormFieldValid('promo_noof_times') })}
                                    />
                                    <label htmlFor="promo_noof_times">Promo Times</label>
                                </span>
                                {getFormErrorMessage('promo_noof_times')}
                            </div> : <div className="field mb-4 col-12 md:col-3"></div>
                        }
                        {formik.values.promotion ? <div className="field mb-4 col-12 md:col-3">
                            <span className="p-float-label">
                                <Calendar
                                    showIcon
                                    dateFormat="dd/mm/yy"
                                    id="promotion_period_from"
                                    name="promotion_period_from"
                                    value={formik.values.promotion_period_from}
                                    onChange={(e) => {
                                        formik.setFieldValue('promotion_period_from', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldValid('promotion_period_from') })}
                                />
                                <label htmlFor="promotion_period_from">Promotion Period From</label>
                            </span>
                            {getFormErrorMessage('promotion_period_from')}
                        </div> : <div className="field mb-4 col-12 md:col-3"></div>
                        }
                        {formik.values.promotion ? <div className="field mb-4 col-12 md:col-3">
                            <span className="p-float-label">
                                <Calendar
                                    showIcon
                                    minDate={formik.values.promotion_period_from}
                                    dateFormat="dd/mm/yy"
                                    id="promotion_period_to"
                                    name="promotion_period_to"
                                    value={formik.values.promotion_period_to}
                                    onChange={(e) => {
                                        formik.setFieldValue('promotion_period_to', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldValid('promotion_period_to') })}
                                />
                                <label htmlFor="promotion_period_to">Promotion Period To</label>
                            </span>
                            {getFormErrorMessage('promotion_period_to')}
                        </div> : <div className="field mb-4 col-12 md:col-3"></div>
                        }
                    </div>
                    <div className="surface-0 p-4 shadow-2 border-round col-12 p-fluid formgrid grid">
                        <div className="field mb-4 col-12 md:col-12 text-xl font-medium text-600 mb-3">Branches</div>
                        <div className="field mb-4 col-12 md:col-2">
                            <span>
                                <Checkbox inputId="all_branch" name="all_branch" onChange={e => formik.setFieldValue('all_branch', e.checked)} checked={formik.values.all_branch} />
                                <label htmlFor="all_branch">All Branch</label>
                            </span>
                            {getFormErrorMessage('all_branch')}
                        </div>
                        {!formik.values.all_branch ?
                            <div className="field mb-4 col-12 md:col-4">
                                <span className="p-float-label">
                                    <MultiSelect id="branch"
                                        name="branch" value={formik.values.branch} onChange={(e: MultiSelectChangeEvent) => formik.setFieldValue('branch', e.value)} options={data} optionLabel="branch_name"
                                        placeholder="Select Branch" className="w-full md:w-15rem" />
                                    <label htmlFor="branch">Branch</label>
                                </span>
                                {getFormErrorMessage('branch')}
                            </div> : <div className="field mb-4 col-12 md:col-4"></div>}
                    </div>
                    <div className="surface-0 p-4 shadow-2 border-round col-12 p-fluid formgrid grid">
                        <div className="field mb-4 col-12 md:col-12 text-xl font-medium text-600 mb-3">Package Image</div>
                        <div className="field mb-4 col-12 md:col-3">
                            <Image src={formik.values.package_image_url} width="50" preview height="50" />
                        </div>
                        <div className="field mb-4 col-12 md:col-3">
                            <FileUpload url={process.env.NEXT_PUBLIC_API_FILEUPLOAD} id="package_image_url" onUpload={onUpload} ref={fileRef} mode="basic" name="file" accept="image/*" />
                        </div>
                    </div>
                    <div className="surface-0 p-4 shadow-2 border-round col-12 p-fluid formgrid grid">
                        <div className="field mb-4 col-12 md:col-12 text-xl font-medium text-600 mb-3">Financial Info</div>
                        <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <InputNumber
                                    id="percentage_ownbranch"
                                    name="percentage_ownbranch"
                                    value={formik.values.percentage_ownbranch}
                                    useGrouping={false}
                                    onChange={(e) => {
                                        formik.setFieldValue('percentage_ownbranch', e.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldValid('percentage_ownbranch') })}
                                />
                                <label htmlFor="percentage_ownbranch">PercentageOwnBranch</label>
                            </span>
                            {getFormErrorMessage('percentage_ownbranch')}
                        </div>
                    </div>
                    <div className="surface-0 p-4 shadow-2 border-round col-12 p-fluid formgrid grid">
                        <div className="field mb-4 col-12 md:col-12 text-xl font-medium text-600 mb-3">Others</div>
                        <div className="field mb-4 col-12 md:col-6">
                            <span className="p-float-label">
                                <InputText
                                    id="sortorder"
                                    name="sortorder"
                                    value={formik.values.sortorder}
                                    onChange={(e) => {
                                        formik.setFieldValue('sortorder', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldValid('sortorder') })}
                                />
                                <label htmlFor="sortorder">Sort Order</label>
                            </span>
                            {getFormErrorMessage('sortorder')}
                        </div>
                        <div className="field mb-4 col-12 md:col-2">  <label htmlFor="status_active">Active/InActive</label></div>
                        <div className="field mb-4 col-12 md:col-4">
                            <InputSwitch
                                id="status_active"
                                name="status_active"
                                checked={formik.values.status_active}
                                value={formik.values.status_active}
                                onChange={(e) => {
                                    formik.setFieldValue('status_active', e.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldValid('status_active') })}
                            />
                            {getFormErrorMessage('status_active')}
                        </div>
                    </div>
                    <div className="surface-0 p-4 shadow-2 border-round col-12 p-fluid formgrid grid">
                        <div className="field mb-4 col-3">
                            <Button type="submit" label="Update" />
                        </div>
                        <div className="field mb-4 col-3">
                            <Button type="button"
                                label="Back"
                                className="p-button-secondary"
                                onClick={() => router.push("/packages/summary")} ></Button>
                        </div>
                    </div>
                </form>
            </BlockUI>
        </div>
    );
}
export default PackageEdit;
