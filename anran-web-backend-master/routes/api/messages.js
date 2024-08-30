const express = require('express');
const Messages = require('../../models/messages');
const router = express.Router();
const Members = require('../../models/members');
const Booking = require('../../models/booking');
const moment = require('moment');
const auth = require('./jwtfilter');

router.post('/', auth, async (req, res) => {
    try {
        const { msg, image_url, image_data_url, startdate, enddate, msg_type, status_active, allways, sortorder } = req.body;
        const obj = new Messages({ msg, image_url, image_data_url, startdate, enddate, msg_type, status_active, allways, sortorder });
        await obj.save();
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { msg, image_url, image_data_url, startdate, enddate, msg_type, status_active, allways, sortorder } = req.body;
        const obj = await Messages.findByIdAndUpdate(id, { msg, image_url, image_data_url, startdate, enddate, msg_type, status_active, allways, sortorder }, { new: true });
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const obj = await Messages.findById(id);
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.post('/findall', async (req, res) => {
    try {
        const { first, rows, filters, sortField, sortOrder } = req.body;
        let filterQuery = [];
        if (filters) {
            Object.keys(filters).forEach(e => {
                if (filters[e].value && filters[e].value && e === 'msg') {
                    let newObject = {};
                    newObject[e] = { $regex: ".*" + filters[e].value + ".*", $options: 'i' };
                    filterQuery.push(newObject);
                } else if (filters[e].value && filters[e].value && e === 'status_active') {
                    let newObject = {};
                    newObject[e] = { $eq: (filters[e].value === 'Active') };
                    filterQuery.push(newObject);
                } else if (filters[e].value && filters[e].value && e === 'msg_type') {
                    let newObject = {};
                    newObject[e] = { $regex: ".*" + filters[e].value + ".*", $options: 'i' };
                    filterQuery.push(newObject);
                } else if (filters[e].value && filters[e].value && e === 'sortorder') {
                    let newObject = {};
                    newObject[e] = { $eq: filters[e].value };
                    filterQuery.push(newObject);
                }
            });
        }
        let sortQuery = {};
        if (sortField) {
            if (sortField === 'msg') {
                sortQuery['msg'] = sortOrder === 1 ? 'asc' : 'desc';
            } else if (sortField === 'status_active') {
                sortQuery['status_active'] = sortOrder === 1 ? 'asc' : 'desc';
            } else if (sortField === 'sortorder') {
                sortQuery['sortorder'] = sortOrder === 1 ? 'asc' : 'desc';
            } else if (sortField === 'msg_type') {
                sortQuery['msg_type'] = sortOrder === 1 ? 'asc' : 'desc';
            }
        }
        if (filters && filterQuery.length > 0) {
            const obj = {
                data: await Messages.find({
                    $and: filterQuery
                }).sort(sortQuery).limit(rows).skip(first),
                totalRecords: await Messages.find({
                    $and: filterQuery
                }).countDocuments()
            }
            res.send(obj);
        } else {
            const obj = {
                data: await Messages.find({}).sort(sortQuery).limit(rows).skip(first),
                totalRecords: await Messages.find({}).countDocuments()
            }
            res.send(obj);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.post('/findallmember', async (req, res) => {
    try {
        const { mobileNumber } = req.body;
        let obj = [];
        const member = await Members.findOne({ $and: [{ mobileNumber: { $eq: mobileNumber } }] });
        if (member) {
            const welcomemessage = await Messages.findOne({ $and: [{ msg_type: { $eq: 'WELCOME' } }] });
            if (welcomemessage) {
                obj.push({
                    msg: welcomemessage.msg.replace("&lt;MemberName&gt;", member.member_name),
                    image: welcomemessage.image_url || welcomemessage.image_data_url || null
                });
            }
            const bookingmessage = await Messages.findOne({ $and: [{ msg_type: { $eq: 'BOOKING' } }] });
            const bookings = await Booking.find({ $and: [{ member: { $eq: member._id } }, { start: { $gte: moment().startOf('day').toString(), $lt: moment().endOf('day').toString() } }] });
            if (bookingmessage && bookings) {
                bookings.forEach(ee => {
                    obj.push(bookingmessage.msg.replace("&lt;MemberName&gt;", member.member_name).replace("&lt;BookingDate&gt;", moment(ee.booking_date).format('MM/DD/YYYY')).replace("&lt;BookingTime&gt;", moment(ee.start).format('h:mm')));
                    obj.push({
                        msg: bookingmessage.msg
                            .replace("&lt;MemberName&gt;", member.member_name)
                            .replace("&lt;BookingDate&gt;", moment(ee.booking_date).format('MM/DD/YYYY'))
                            .replace("&lt;BookingTime&gt;", moment(ee.start).format('h:mm A')),
                        image: bookingmessage.image_url || bookingmessage.image_data_url || null
                    });
                });
            }
        } else {
            const welcomemessage = await Messages.findOne({ $and: [{ msg_type: { $eq: 'GREETING' } }] });
            if (welcomemessage) {
                obj.push({
                    msg: welcomemessage.msg,
                    image: welcomemessage.image_url || welcomemessage.image_data_url || null
                });
            } else {
                obj.push({
                    msg: "Welcome to Anran Welness Center",
                    image: null
                });
            }
        }
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/findallmembermsg', auth, async (req, res) => {
    try {
        const { mobileNumber } = req.body;
        let obj = [];
        const member = await Members.findOne({ $and: [{ mobileNumber: { $eq: mobileNumber } }] });
        if (member) {
            const welcomemessage = await Messages.findOne({ $and: [{ msg_type: { $eq: 'WELCOME' } }] });
            if (welcomemessage) {
                welcomemessage.msg = welcomemessage.msg.replace("&lt;MemberName&gt;", member.member_name);
                obj.push(welcomemessage);
            }
            const bookingmessage = await Messages.findOne({ $and: [{ msg_type: { $eq: 'BOOKING' } }] });
            const bookings = await Booking.find({ $and: [{ member: { $eq: member._id } }, { start: { $gte: moment().startOf('day').toString(), $lt: moment().endOf('day').toString() } }] });
            if (bookingmessage && bookings) {
                bookings.forEach(ee => {
                    bookingmessage.msg = bookingmessage.msg.replace("&lt;MemberName&gt;", member.member_name).replace("&lt;BookingDate&gt;", moment(ee.booking_date).format('MM/DD/YYYY')).replace("&lt;BookingTime&gt;", moment(ee.start).format('h:mm'));
                    obj.push(bookingmessage);
                });
            }
        } else {
            const defaultmessage = { "msg": "Welcome to Anran Wellness", "image_url": null };
            obj.push(defaultmessage);
        }
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.post('/findallmembermsgMobile', async (req, res) => {
    try {
        const { mobileNumber } = req.body;
        let obj = [];
        
        // Find the member by mobile number
        const member = await Members.findOne({ mobileNumber });
        
        if (member) {
            // Find welcome message
            const welcomemessage = await Messages.findOne({ msg_type: 'WELCOME' });
            if (welcomemessage) {
                welcomemessage.msg = welcomemessage.msg.replace("&lt;MemberName&gt;", member.member_name);
                obj.push(welcomemessage);
            }

            // Find booking message
            const bookingmessage = await Messages.findOne({ msg_type: 'BOOKING' });
            
            // Find today's bookings for the member
            const bookings = await Booking.find({
                member: member._id,
                start: {
                    $gte: moment().startOf('day').toDate(),
                    $lt: moment().endOf('day').toDate()
                }
            });

            if (bookingmessage && bookings.length > 0) {
                bookings.forEach(booking => {
                    const formattedMessage = bookingmessage.msg
                        .replace("&lt;MemberName&gt;", member.member_name)
                        .replace("&lt;BookingDate&gt;", moment(booking.booking_date).format('MM/DD/YYYY'))
                        .replace("&lt;BookingTime&gt;", moment(booking.start).format('h:mm'));
                    obj.push({ ...bookingmessage, msg: formattedMessage });
                });
            }
        } else {
            // Default message if member not found
            const defaultmessage = { msg: "Welcome to Anran Wellness", image_url: null };
            obj.push(defaultmessage);
        }
        
        res.send(obj);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;