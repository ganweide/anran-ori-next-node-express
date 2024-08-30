const express = require('express');
const Booking = require('../../models/booking');
const MemberPackage = require('../../models/memberPackage');
const Members = require('../../models/members');
const router = express.Router();
const moment = require('moment');
const Branch = require('../../models/branch');
const Floor = require('../../models/floor');
const auth = require('./jwtfilter');


router.post('/', auth, async (req, res) => {
    try {
        const { member, package, branch, floor, room, start, end, title, package_name, room_no, checkin_date, pax, malecount, femaleCount } = req.body;
        const branchobj = await Branch.findById(branch._id);
        const transaction_no= await generateRunningNumber(branchobj)

        console.log(transaction_no)
        const booking = new Booking({ member, package, branch, floor, room, start, end, title, package_name, room_no, checkin_date, pax, malecount, femaleCount,transaction_no });
        const obj = await booking.save();
        res.send(obj);
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});


const generateRunningNumber = async (branchId) => {
    const branch = await Branch.findById(branchId);
    const branchCode = branch.branch_code;
    const letter = "B";
    const date = new Date();
    const yyyyMMdd = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
    const latestBooking = await Booking.findOne({ branch: branchId, transaction_no: new RegExp(`^${branchCode}-${letter}-${yyyyMMdd}`) })
        .sort({ transaction_no: -1 });
    let sequence = "0001"; 
    if (latestBooking) {
        const lastSequence = parseInt(latestBooking.transaction_no.split(`${yyyyMMdd}`)[1]);
        sequence = (lastSequence + 1).toString().padStart(4, "0");
    }
    const runningno = `${branchCode}-${letter}-${yyyyMMdd}${sequence}`;
    return runningno;
};

router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const obj = await Booking.findById(id)
        .populate({
            path: "member",
            select: "member_name mobileNumber gender _id",
        }) .populate("room")
        .populate("branch")
        .populate("floor")
        .populate({
            path: "package",
            populate: [
                { path: "packageid", model: "items" }, // Populate packageid
                { path: "branch", model: "branch" } // Populate branch
            ]
        });
        res.send(obj);
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { member, package, branch, floor, room, start, end, title, package_name, room_no, bookingstatus, checkin_date, pax, malecount, femaleCount } = req.body;
        const obj = await Booking.findByIdAndUpdate(id, { member, package, branch, floor, room, start, end, title, package_name, room_no, bookingstatus, checkin_date, pax, malecount, femaleCount }, { new: false });
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.put('checkin/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { member } = req.body;
        const obj = await Booking.findByIdAndUpdate(
            id,
            {
                bookingstatus: 'CheckIn',
                checkin_date: Date.now()
            },
            { new: false }
        );
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});



router.post('/cancel', auth, async (req, res) => {
    try {
        const { id } = req.body;
        bookingstatus = 'Cancel'
        const obj = await Booking.findByIdAndUpdate(id, { bookingstatus }, { new: false });
        res.status(200).json({
            status: 'ok',
            data: obj,
            message: 'Cancel successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});



router.get('/', async (req, res) => {
    try {
        updateBookingStatus();
        const booking = await Booking.find({ $and: [{ bookingstatus: { $eq: 'Booked' } }] }).populate({
            path: "member",
        }).populate({
            path: "room",
        }).populate({
            path: "branch",
        }).populate({
            path: "floor",
        });
        res.send(booking);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.post('/findall', auth, async (req, res) => {
    try {
        updateBookingStatus();
        const { id, first, rows, filters, sortField, sortOrder } = req.body;
        let filterQuery = [];
        if (filters) {
            Object.keys(filters).forEach(async e => {
                if (filters[e].value && filters[e].value && e === 'start') {
                    const dateStr = filters[e].value;
                    const dt = formatDate(dateStr);
                    const isValidDate = moment(dt, 'YYYY-MM-DD', true).isValid();
                    if (isValidDate) {
                        const startDate = moment(dt).startOf('day').toDate();
                        const endDate = moment(dt).endOf('day').toDate();
                        filterQuery.push({ start: { $gte: startDate, $lte: endDate } });
                    }
                } else if (filters[e].value && filters[e].value && e === 'checkin_date') {
                    const dateStr = filters[e].value;
                    const dt = formatDate(dateStr);
                    const isValidDate = moment(dt, 'YYYY-MM-DD', true).isValid();
                    if (isValidDate) {
                        const startDate = moment(dt).startOf('day').toDate();
                        const endDate = moment(dt).endOf('day').toDate();
                        filterQuery.push({ checkin_date: { $gte: startDate, $lte: endDate } });
                    }
                } else if (filters[e].value && filters[e].value && e === 'package_name') {
                    filterQuery.push({ package_name: { $regex: ".*" + filters[e].value + ".*" } });
                } else if (filters[e].value && filters[e].value && e === 'bookingstatus') {
                    filterQuery.push({ bookingstatus: { $regex: ".*" + filters[e].value + ".*" } });
                }else if (filters[e].value && filters[e].value && e === 'transaction_no') {
                    filterQuery.push({ transaction_no: { $regex: ".*" + filters[e].value + ".*" } });
                }else if (filters[e].value && filters[e].value && e === 'purchasetype') {
                    filterQuery.push({ purchasetype: { $regex: ".*" + filters[e].value + ".*" } });
                }
            });
        }
        if (id) {
            filterQuery.push({ member: { $eq: id } });
        }
        if (filters && filters.member_name && filters.member_name.value) {
            const branchList = await Members.find({ member_name: { $regex: ".*" + filters.member_name.value + ".*", $options: 'i' } }).select('_id');
            filterQuery.push({ member: { $in: branchList } });
        }
        if (filters && filters.branch && filters.branch.value) {
            const branchList = await Branch.find({ branch_name: { $regex: ".*" + filters.branch.value + ".*", $options: 'i' } }).select('_id');
            filterQuery.push({ branch: { $in: branchList } });
        }
        if (filters && filters.floor && filters.floor.value) {
            const branchList = await Floor.find({ floor_no: { $regex: ".*" + filters.floor.value + ".*", $options: 'i' } }).select('_id');
            filterQuery.push({ floor: { $in: branchList } });
        }
        let query = filterQuery.length > 0 ? { $and: filterQuery } : {};
        let sortQuery = {};
        if (sortField) {
            if (sortField === 'member_name') {
                sortQuery['member'] = sortOrder === 1 ? 'asc' : 'desc';
            } else {
                sortQuery[sortField] = sortOrder === 1 ? 'asc' : 'desc';
            }

        }
        const data = await Booking.find(query)
            .populate({ path: "member" })
            .populate({ path: "room" })
            .populate({ path: "branch" })
            .populate({ path: "floor" })
            .sort(sortQuery)
            .skip(first)
            .limit(rows);

        const totalRecords = await Booking.countDocuments(query);
        res.send({ data, totalRecords });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});




router.post('/findbydate/:id', auth, async (req, res) => {
    try {
        updateBookingStatus();
        const { id } = req.params;
        const { date } = req.body;
        const startdt = new Date(new Date(date).setHours(0, 0, 0, 0))
        const enddt = new Date(new Date(date).setHours(23, 59, 59, 999))
        const obj = await Booking.find({ $and: [{ member: { $eq: id } }, { start: { $gte: startdt, $lt: enddt } }] }).populate({
            path: "member",
        }).populate({
            path: "room",
        }).populate({
            path: "branch",
        }).populate({
            path: "floor",
        });
        res.status(200).json({
            status: "ok",
            data: [obj],
            message: "Booking Data",
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

function formatDate(dateStr) {
    // Convert from 'DD/MM/YYYY' to 'YYYY-MM-DD'
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
}

router.post('/memberbased', auth, async (req, res) => {
    try {
        updateBookingStatus();
        const { first, rows, member, bookingstatus } = req.body;
        const obj = {
            data: await Booking.find({ $and: [{ member: { $eq: member } }, { bookingstatus: { $eq: bookingstatus } }] }).populate({
                path: "member",
            }).populate({
                path: "room",
            }).populate({
                path: "package",
            }).populate({
                path: "branch",
            }).populate({
                path: "floor",
            }).limit(rows).skip(first),
            totalRecords: await Booking.find({ $and: [{ member: { $eq: member } }, { bookingstatus: { $eq: bookingstatus } }] }).countDocuments()
        }
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.post('/checkinApp', auth, async (req, res) => {
    try {
        const { member, id } = req.body;
        const bookobj = await Booking.findById(id);
        if (bookobj != null) {
            const mpobj = await MemberPackage.findById(bookobj.package._id);
            if (mpobj.balance != 0) {
                const obj = await Booking.findByIdAndUpdate(id, {
                    bookingstatus: 'CheckIn',
                    checkin_date: Date.now()
                }, { new: false });
                let update = {
                    balance: mpobj.balance - bookobj.pax,
                    used: mpobj.used + bookobj.pax
                };
                await MemberPackage.findByIdAndUpdate(obj.package._id, update, { new: false });
                res.status(200).json({
                    status: "ok",
                    data: [obj],
                    message: "Check In Accepted",
                });
            } else {
                res.status(200).json({
                    status: "Failed",
                    data: [],
                    message: "Balance Package is 0",
                });
            }
        } else {
            res.status(200).json({
                status: "Failed",
                data: [],
                message: "Booking Deails Not Avaliable",
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});





router.post('/check-booking-count', auth, async (req, res) => {
    try {
        const { roomId, start, end } = req.body;
        if (!roomId || !start || !end) {
            return res.status(400).json({ error: 'Please provide room ID, start time, and end time' });
        }
        const bookingCount = await Booking.find({
            $and: [{ room: { $eq: roomId } }],
            $or: [
                { start: { $lt: new Date(end), $gte: new Date(start) } },
                { end: { $gt: new Date(start), $lte: new Date(end) } },
                { start: { $lte: new Date(start) }, end: { $gte: new Date(end) } }
            ]
        }).populate({
            path: "member",
            select: 'gender'
        });
        let maleCount = 0;
        let femaleCount = 0;

        bookingCount.forEach(booking => {

            bookingCount.forEach(booking => {
                if (booking.malecount > 0) {
                    maleCount = +booking.malecount;
                } else if (booking.femalecount > 0) {
                    femaleCount = +booking.femalecount;
                }
            });
        });
        res.json({ maleCount, femaleCount });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.post('/memberbasedAllData', auth, async (req, res) => {
    try {
        const { member, bookingstatus } = req.body;
        const obj = await Booking.find({ $and: [{ member: { $eq: member } }, { bookingstatus: { $eq: bookingstatus } }] }).populate({
            path: "member",
        }).populate({
            path: "room",
        }).populate({
            path: "branch",
        }).populate({
            path: "floor",
        })
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});

async function updateBookingStatus() {
    try {
        let newDate = new Date(new Date().getTime() + 10 * 60000);
        const data = await Booking.updateMany(
            {
                $and: [
                    { start: { $lt: newDate } },
                    { bookingstatus: 'Booked' }
                ]
            },
            { $set: { bookingstatus: 'Not Show Up' } }
        );
        return { matchedCount: data.matchedCount, modifiedCount: data.modifiedCount };
    } catch (error) {
        return { error: error.message };
    }
}

router.post('/checkBookingExists', auth, async (req, res) => {
    try {
        const { member, date } = req.body;
        const inputDate = new Date(date);
        inputDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(inputDate);
        nextDay.setDate(inputDate.getDate() + 1);
        const bookingCount = await Booking.countDocuments({
            $and: [{ member: { $eq: member } }, { bookingstatus: { $eq: 'Booked' } }],
            $or: [{ start: { $gte: inputDate, $lt: nextDay } }]
        });
        if (bookingCount > 0) {
            res.status(200).json({
                status: false,
                message: "Booking Already Exist in given Date",
            });
        } else {
            res.status(200).json({
                status: true,
                message: "Booking Not Exist in given Date",
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});


router.post('/getBookingBasedonPackage', auth, async (req, res) => {
    try {
        const { memberid, packageid } = req.body;
        const bookings = await Booking.find({
            $and: [
                { member: memberid },
                { package: packageid }
            ]
        }).populate({
            path: "branch",
            select: 'branch_name'
        }).sort({ booking_date: -1 });
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = router;


