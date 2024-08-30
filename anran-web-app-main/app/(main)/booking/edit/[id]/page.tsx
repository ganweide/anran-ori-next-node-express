"use client";

import { Calendar as PRCalendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState, useRef } from "react";
import { useFormik } from 'formik';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { BlockUI } from 'primereact/blockui';
import API from '@/anran/service/api';
import { useRouter } from "next/navigation";
import { InputNumber } from 'primereact/inputnumber';
import { Button } from "primereact/button";
import { dateAsString, stringasUTC } from '@/anran/service/dateutils';

function BookingEdit({ params }: { params: { id: string } }) {

    const { id } = params;
    const toast = useRef<Toast>(null);
    const router = useRouter();
    const [Package, setPackage] = useState<[]>([]);
    const [memberlst, setMemberlst] = useState<[]>([]);
    const [branch, setBranch] = useState<[]>([]);
    const [Floorlst, setFloorlst] = useState<[]>([]);
    const [branchroom, setBranchroom] = useState<[]>([]);
    const [blocked, setBlocked] = useState(false);
    const [booking, setBooking] = useState<[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [view, setView] = useState("");
    const [balance, setBalance] = useState(0);
    const [blockedCounts, setBlockedCounts] = useState({ maleCount: 0, femaleCount: 0 });
    const [availableCounts, setAvailableCounts] = useState({
        maleCount: 0,
        femaleCount: 0,
        bothCount: 0,
    });
    const [balancemale, setBalancemale] = useState(0);
    const [balancefemale, setBalancefemale] = useState(0);


    const currentDate = new Date(); // Set current date as minDate
    const maxDate = new Date(); // Set a future date as maxDate
    maxDate.setDate(currentDate.getDate() + 30); // Example maxDate (30 days from now)




    const memberform = useFormik({
        initialValues: {
            _id: '',
            booking_date: '',
            member: '',
            branch: '',
            floor: '',
            package: '',
            start: '',
            end: '',
            room: '',
            tag: '',
            title: '',
            package_name: '',
            room_no: '',
            pax: '',
            malecount: 0,
            femalecount: 0
        },
        validate: (data) => {
            let errors: any = {};
            if (!data.member) {
                errors.member = 'Member Name is required.';
            }
            if (!data.branch) {
                errors.branch = 'branch is required.';
            }
            if (!data.package) {
                errors.package = 'Package Plan is required.';
            }
            if (!data.floor) {
                errors.floor = 'Floor is required.';
            }
            if (!data.start) {
                errors.start = 'time is required.';
            } else if (data.start && data.branch) {
                const operatingFrom = new Date(data.branch.operating_from_hours);
                const operatingHours = operatingFrom.getUTCHours();
                const operatingMinutes = operatingFrom.getUTCMinutes();
                const startDate = new Date(data.start);
                const startHours = startDate.getHours();
                const startMinutes = startDate.getMinutes();
                const isOperatingFromGreaterThanStart = (operatingHours > startHours) ||
                    (operatingHours === startHours && operatingMinutes > startMinutes);
                if (isOperatingFromGreaterThanStart) {
                    errors.start = 'Operating hours should be greater than the start time.';
                }
            }
            if (data.end && data.branch) {
                const operatingTo = new Date(data.branch.operating_to_hours);
                const endDate = new Date(data.end);
                const operatingHours = operatingTo.getUTCHours();
                const operatingMinutes = operatingTo.getUTCMinutes();
                const endHours = endDate.getHours();
                const endMinutes = endDate.getMinutes();
                const isOperatingToLessThanEnd = (operatingHours < endHours) ||
                    (operatingHours === endHours && operatingMinutes < endMinutes);
                if (isOperatingToLessThanEnd) {
                    errors.end = 'Operating hours should be less than the end time.';
                }
            }
            if (!data.room) {
                errors.room = 'Room is required.';
            }
            if (!data.pax && balance < data.pax) {
                errors.pax = `Pax should be Less than ${balance}`;
            }
            if (!data.malecount && availableCounts.maleCount > 0) {
                errors.malecount = 'malecount is required.';
            }
            if (!data.femalecount && availableCounts.femaleCount > 0) {
                errors.femalecount = 'femalecount is required.';
            }

            let total;

            if (availableCounts.bothCount > 0) {
                total = availableCounts.bothCount - blockedCounts.maleCount - blockedCounts.femaleCount;

                if (
                    (data.malecount || data.malecount === 0) &&
                    (data.femalecount || data.femalecount === 0) &&
                    total < (data.malecount + data.femalecount)
                ) {
                    errors.femalecount = `Female count should be less than ${total}`;
                    errors.malecount = `Male count should be less than ${total}`;
                }
            } else if (availableCounts.maleCount > 0) {
                total = availableCounts.maleCount - blockedCounts.maleCount;

                if ((data.malecount || data.malecount === 0) && total < data.malecount) {
                    errors.malecount = `Male count should be less than ${total}`;
                }
            } else if (availableCounts.femaleCount > 0) {
                total = availableCounts.femaleCount - blockedCounts.femaleCount;

                if ((data.femalecount || data.femalecount === 0) && total < data.femalecount) {
                    errors.femalecount = `Female count should be less than ${total}`;
                }
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
                    data.title = data.member.member_name;
                    data.package_name = data.package.package;
                    data.room_no = data.room.room_no;
                    data.start = dateAsString(data.start)
                    data.end = dateAsString(data.end)
                    API.put('booking/' + data._id, data).then(function (response) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'info', summary: 'Status', detail: 'Booking Updated Successfully!!!', life: 3000 });
                        }
                        memberform.resetForm();
                        router.push("/booking");
                    }).catch(function (error) {
                        if (toast && toast.current) {
                            toast.current.show({ severity: 'error', summary: 'Status', detail: 'Booking Not able to create', life: 3000 });
                        }
                    });
                    setBlocked(false);
                },
            });
        }
    });

    useEffect(() => {
        console.log(id);

        const fetchData = async () => {
            try {
                if (id) {
                    const response = await API.get('booking/' + id);
                    const bookingDetails = response.data;
                    const { start, end, title } = response.data;
                    // Reset the form and set new values
                    // const memberResponse = await API.get('Members/bookmember/' + response.data.member._id);
                    const floorResponse = await API.get('floors/' + response.data.floor._id);
                    const roomResponse = await API.get('rooms/' + response.data.room._id);

                    memberform.setValues({
                        title: title,
                        booking_date: bookingDetails.booking_date || '',
                        member: response.data.member || '',
                        package_name: bookingDetails.package_name || '',
                        branch: bookingDetails.branch || '',
                        floor: floorResponse.data || '',
                        package: bookingDetails.package || '',
                        room: roomResponse.data || '',
                        tag: bookingDetails.tag || '',

                        room_no: bookingDetails.room_no || '',
                        start: stringasUTC(bookingDetails.start),
                        end: stringasUTC(bookingDetails.end),
                        pax: bookingDetails.pax || '',
                        malecount: bookingDetails.malecount || '',
                        femalecount: bookingDetails.femalecount || '',
                    });
                    await avaliablepackage(response.data.member);
                    await avaliableFloor(response.data.branch);
                    await avaliableRoom(response.data.floor);
                    gendercount();
                    onSelectRoom(roomResponse.data);
                }
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData();
        getMemberAndBook();
        gendercount();
    }, [memberform.values.room, memberform.values.start, memberform.values.end]);



    const getMemberAndBook = async () => {
        const response = await API.get('members');
        console.log(response)
        const members = response.data || [];
        const updatedMembers = members.map((member: any) => ({
            ...member,
            combinedLabel: `${member.member_name} (${member.mobileNumber})`
        }));
        setMemberlst(updatedMembers);
        API.get('branch').then(function (response: any) {
            setBranch(response.data);
        }).catch(function (error) {
            console.log(error);
        });


    }


    const getFormErrorMessage = (name: string) => {
        if (isFormFieldValid(name) && memberform.errors) {
            let err: any = memberform.errors;
            return <small className="p-error">{err[name]}</small>;
        } else {
            return "";
        }
    };

    const avaliablepackage = async (e: any) => {
        if (e) {
            await API.get('memberpackage/avail/' + e._id).then(function (response: any) {
                setPackage(response.data);
            }).catch(function (error) {
                console.log(error);
            });
        }
    };

    const avaliableBranch = async (e: any) => {
        if (e) {
            try {
                if (e.packageid?.unlimitedyear && e.branch) {
                    setBranch(e.branch);
                } else {
                    API.get('branch').then(function (response: any) {
                        setBranch(response.data);
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            } catch (error) {
                console.error('Error fetching branch data:', error);
            }
        }
    };


    const avaliableFloor = async (e: any) => {
        if (e) {
            setBalance(e.balance);
            await API.get('floors/branchfloor/' + e._id).then(function (response: any) {
                setFloorlst(response.data);
            }).catch(function (error) {
                console.log(error);
            });
        }
    };



    const avaliableRoom = async (e: any) => {
        if (e) {
            await API.get('rooms/floorroom/' + e._id).then(function (response: any) {
                setBranchroom(response.data);
            }).catch(function (error) {
                console.log(error);
            });
        }
    };

    const gendercount = async () => {
        if (memberform.values.room && memberform.values.start) {
            let roomId = memberform.values.room._id;
            let start = memberform.values.start;
            let end = memberform.values.end;
            await API.post('booking/check-booking-count', { roomId, start, end }).then(function (response: any) {
                setBlockedCounts(response.data);
            }).catch(function (error) {
                console.log(error);
            });
        }
    };

    const onSelectRoom = async (e: any) => {
        let maleCount = 0;
        let femaleCount = 0;
        let bothCount = 0;
        if (e) {
            if (e.room_gender === 'Male') {
                maleCount = e.noof_persons
            } else if (e.room_gender === 'Female') {
                femaleCount = e.noof_persons
            } else if (e.room_gender === 'Both') {
                bothCount = e.noof_persons
            }
        }
        setAvailableCounts({ maleCount, femaleCount, bothCount });
    }


    const isFormFieldValid = (name: string) => !!(memberform.touched[name] && memberform.errors[name]);

    const optionTemplate = (option: any) => {
        return (
            <div className="flex align-items-center">
                <div>{option.package} - Balance Times {option.balance}</div>
            </div>
        );
    };


    return (
        <div className="card">
            <span className="text-900 text-xl font-bold mb-4 block">
                Booking Edit
            </span>
            <ConfirmDialog />
            <Toast ref={toast} />
            <BlockUI blocked={blocked}>

                <form onSubmit={memberform.handleSubmit} className="field mb-12 col-12">
                    <ConfirmDialog />
                    <Toast ref={toast} />
                    <BlockUI blocked={blocked}></BlockUI>
                    <div className="grid p-fluid formgrid">
                        <div className="field mb-6 col-12">
                            <span className="p-float-label">
                                {memberform.values.member.member_name} - {memberform.values.member.mobileNumber}
                            </span>
                            {getFormErrorMessage('member')}

                            {memberform.values.member && (
                                <small className="p-success">Gender: {memberform.values.member.gender} </small>
                            )}
                        </div>

                        <div className="field mb-6 col-12">
                            <span className="p-float-label">
                                <Dropdown
                                    inputId="package"
                                    name="package"
                                    value={memberform.values.package}
                                    options={Package}
                                    optionLabel='package'
                                    itemTemplate={optionTemplate}
                                    placeholder="Select a Member"
                                    onChange={(e) => {
                                        memberform.setFieldValue('package', e.value);
                                        avaliableFloor(e.value)
                                        avaliableBranch(e.value)
                                    }}
                                    emptyMessage='No Package Avaliavle for Selected Member'

                                />
                                <label htmlFor="package">Select Packages</label>
                            </span>
                            {getFormErrorMessage('package')}
                        </div>


                        <div className="field mb-6 col-12">
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


                        <div className="field mb-6 col-12">
                            <span className="p-float-label">
                                <Dropdown
                                    inputId="floor"
                                    name="floor"
                                    value={memberform.values.floor}
                                    options={Floorlst}
                                    optionLabel='floor_no'
                                    placeholder="Select a Floor"
                                    onChange={(e) => {
                                        memberform.setFieldValue('floor', e.value);
                                        avaliableRoom(e.value)
                                    }}
                                />
                                <label htmlFor="floor">Select Floor</label>
                            </span>
                            {getFormErrorMessage('floor')}
                        </div>


                        <div className="field mb-6 col-12">
                            <span className="p-float-label">
                                <Dropdown
                                    inputId="room"
                                    name="room"
                                    value={memberform.values.room}
                                    options={branchroom}
                                    optionLabel='room_no'
                                    placeholder="Select a Room No"
                                    onChange={(e) => {
                                        memberform.setFieldValue('room', e.value);
                                        gendercount();
                                        onSelectRoom(e.value);
                                    }}
                                    itemTemplate={(option) => (
                                        <div>
                                            {option.room_no} {option.room_gender} ({option.noof_persons})
                                        </div>
                                    )}
                                />
                                <label htmlFor="member">Select Room</label>
                            </span>
                            {getFormErrorMessage('room')}
                        </div>


                        <div className="col-12 md:col-6 field">
                            <label
                                htmlFor="start"
                                className="text-900 font-semibold">
                                Start Time
                            </label>



                            <PRCalendar
                                id="start"
                                minDate={currentDate}
                                maxDate={maxDate}
                                value={memberform.values.start}
                                onChange={(e) => {
                                    const startTime = e.value;
                                    console.log('Selected Start Time:', startTime);
                                    if (startTime) {
                                        memberform.setFieldValue('start', startTime);
                                        const endTime = new Date(startTime);
                                        endTime.setHours(endTime.getHours() + 1);
                                        if (endTime > maxDate) {
                                            memberform.setFieldValue('end', maxDate);
                                        } else {
                                            memberform.setFieldValue('end', endTime);
                                        }
                                        gendercount();
                                    }
                                }}
                                showTime
                                required
                            />
                            {getFormErrorMessage('start')}
                        </div>
                        <div className="col-12 md:col-6 field">
                            <label
                                htmlFor="end"
                                className="text-900 font-semibold">
                                End Time
                            </label>
                            <PRCalendar
                                id="end"
                                value={memberform.values.end}
                                onChange={(e) => {
                                    memberform.setFieldValue('end', e.value);
                                }}
                                disabled
                                showTime
                                required
                            />
                            {getFormErrorMessage('end')}
                        </div>

                        <div className="col-12 md:col-6 field">
                            <label className="text-900 font-semibold">Available Room Counts</label>
                            <div>
                                <small style={{ color: 'blue' }}>Available Male Rooms: {availableCounts.maleCount} </small>
                            </div>
                            <div>
                                <small style={{ color: 'blue' }}>Available Female Rooms: {availableCounts.femaleCount} </small>
                            </div>
                            <div>
                                <small style={{ color: 'blue' }}>Available Both-Gender Rooms: {availableCounts.bothCount} </small>
                            </div>
                        </div>

                        <div className="col-12 md:col-6 field">
                            <label className="text-900 font-semibold">Blocked Room Counts</label>
                            <div>
                                <small className="p-error">Blocked Male Rooms: {blockedCounts.maleCount}</small>
                            </div>
                            <div>
                                <small className="p-error">Blocked Female Rooms: {blockedCounts.femaleCount}</small>
                            </div>
                        </div>

                        {(availableCounts.bothCount > 0 || availableCounts.maleCount > 0) && (
                            <div className="col-12 md:col-4 field">
                                <span className="p-float-label">
                                    <InputNumber
                                        id="malecount"
                                        name="malecount"
                                        value={memberform.values.malecount}
                                        onValueChange={(e) => {
                                            memberform.setFieldValue('malecount', e.value);
                                            const updatedPax = e.value + (memberform.values.femalecount || 0);
                                            memberform.setFieldValue('pax', updatedPax);
                                        }}
                                        min={-1} // You might want to set this to `0` instead of `-1`
                                        placeholder="Enter Male Count"
                                    />
                                    <label htmlFor="malecount">Male Count</label>
                                </span>
                                {getFormErrorMessage('malecount')}
                            </div>
                        )}
                        {/* Female Count */}
                        {(availableCounts.bothCount > 0 || availableCounts.femaleCount > 0) && (
                            <div className="col-12 md:col-4 field">
                                <span className="p-float-label">
                                    <InputNumber
                                        id="femalecount"
                                        name="femalecount"
                                        value={memberform.values.femalecount}
                                        onValueChange={(e) => {
                                            memberform.setFieldValue('femalecount', e.value);
                                            const updatedPax = (memberform.values.malecount || 0) + e.value;
                                            memberform.setFieldValue('pax', updatedPax);
                                        }}

                                        min={-1}
                                        placeholder="Enter Female Count"
                                    />
                                    <label htmlFor="femaleCount">Female Count</label>
                                </span>
                                {getFormErrorMessage('femalecount')}
                            </div>
                        )}

                        <div className="col-12 md:col-4 field">
                            <span className="p-float-label">
                                <InputNumber
                                    id="pax"
                                    name="pax"
                                    value={memberform.values.pax}
                                    disabled
                                    placeholder="Total Pax"
                                />
                                <label htmlFor="pax">Total Pax</label>
                            </span>
                            {getFormErrorMessage('Pax')}
                        </div>
                    </div>
                    <div className="col-12">
                        <Button type="submit" label="Save" icon="pi pi-check" />
                    </div>
                </form>

            </BlockUI>
        </div>
    );
}
export default BookingEdit;
