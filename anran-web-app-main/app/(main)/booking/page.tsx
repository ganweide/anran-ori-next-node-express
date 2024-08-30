"use client";
import React, { useEffect, useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import API from "@/anran/service/api";
import { Dropdown } from "primereact/dropdown";
import { EventClickArg } from "@fullcalendar/core";
import { useRouter } from "next/navigation";
import { dateAsString, stringasUTC } from '@/anran/service/dateutils';

const Booking = () => {
    const [branch, setBranch] = useState<any[]>([]);
    const [booking, setBooking] = useState<any[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<any>([]);
    const [slotMin, setSlotMin] = useState<string>('07:00:00');
    const [slotMax, setSlotMax] = useState<string>('19:00:00');
    const router = useRouter();

    useEffect(() => {
        API.get('branch').then(function (response: any) {
            setBranch(response.data);
        });
    }, []);

    const editBooking = (e: EventClickArg) => {
        let plainEvent = e.event.toPlainObject({
            collapseExtendedProps: true,
            collapseColor: true,
        });
        router.push("/booking/edit/" + plainEvent._id);
    };

    const newBooking = (e: any) => {
        if (selectedBranch) {
            console.log(selectedBranch._id);
            router.push("/booking/create/" + selectedBranch._id + "/" + e.startStr + "/" + e.endStr);
        }
    };

    const isValidDate = (dateString: any) => {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    };

    const setData = (branchObj: any) => {
        if (branchObj) {
            setSelectedBranch(branchObj);
            if (branchObj.operating_from_hours && isValidDate(branchObj.operating_from_hours)) {
                setSlotMin((new Date(branchObj.operating_from_hours)).toLocaleTimeString([], {
                    hour: '2-digit',
                    hour12: false
                }) + ':00:00');
            }
            if (branchObj.operating_to_hours && isValidDate(branchObj.operating_to_hours)) {
                setSlotMax((new Date(branchObj.operating_to_hours)).toLocaleTimeString([], {
                    hour: '2-digit',
                    hour12: false
                }) + ':00:00');
            }
        
            API.get('booking').then(function (response: any) {
                const bookings = response.data.map((booking: any) => {
                    return {
                        ...booking,
                        start: booking.start ? stringasUTC(booking.start) : null,
                        end: booking.end ? stringasUTC(booking.end): null
                    };
                });
                setBooking(bookings);
            });
        }
    };


    const eventContent = (eventInfo: any) => {
        const { event } = eventInfo;
        const startDate = event.start ;
        const endDate = event.end;
        const startTime = startDate
            ? startDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
            : 'N/A';

        const endTime = endDate
            ? endDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
            : 'N/A';


        const branch = event.extendedProps?.member?.mobileNumber;

        return (
            <div>
                <div>{`${startTime} - ${endTime}`}</div>
                <div>{event.title}</div>
                <div>{branch}</div>
            </div>
        );
    };

    return (
        <div className="card col-12 p-fluid formgrid grid">
            <div className="field mb-4 col-12 md:col-6">
                <span className="p-float-label">
                    <Dropdown
                        id="branch"
                        name="branch"
                        filter
                        value={selectedBranch}
                        options={branch} optionLabel="branch_name"
                        onChange={(e) => {
                            setData(e.value);
                        }}
                    />
                    <label htmlFor="branch">Branch</label>
                </span>
            </div>
            <div className="field mb-4 col-12 md:col-6"></div>
            <div className="field mb-4 col-12 md:col-12"><hr /></div>
            <div className="field mb-4 col-12 md:col-12">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridDay"
                    events={booking}
                    eventClick={editBooking}
                    select={newBooking}
                    editable
                    selectable
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'timeGridWeek,timeGridDay'
                    }}
                    slotMinTime={slotMin}
                    slotMaxTime={slotMax}
                    eventOverlap={true}
                    height={'auto'}
                    slotEventOverlap={false}
                    eventMaxStack={2}
                    allDaySlot={false}
                    eventContent={eventContent}
                />
            </div>
        </div>
    );
};

export default Booking;
