const express = require('express');
const Roles = require('../../models/role');
const router = express.Router();
const auth = require('./jwtfilter');

router.post('/', auth, async (req, res) => {
    try {
        const { role_name, admin_role, admin_banner, admin_message, admin_staff,
            admin_branch, admin_room, admin_package, member_member, member_booking,
            member_checkin, member_checkinqr, member_transfer, finance_purchase, finance_checkin, finance_attendance, branch, all_branch, status_active } = req.body;
        const obj = new Roles({ role_name, admin_role, admin_banner, admin_message, admin_staff, admin_branch, admin_room, admin_package, member_member, member_booking, member_checkin, member_checkinqr, member_transfer, finance_purchase, finance_checkin, finance_attendance, branch, all_branch, status_active });
        await obj.save();
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/findall', auth, async (req, res) => {
    try {
        const { first, rows, filters, sortField, sortOrder } = req.body;
        let filterQuery = [];
        if (filters) {
            Object.keys(filters).forEach(e => {
                if (filters[e].value && filters[e].value && e === 'role_name') {
                    let newObject = {};
                    newObject[e] = { $regex: ".*" + filters[e].value + ".*", $options: 'i' };
                    filterQuery.push(newObject);
                } else if (filters[e].value && filters[e].value && e === 'status_active') {
                    let newObject = {};
                    newObject[e] = { $eq: (filters[e].value==='Active') };
                    filterQuery.push(newObject);
                }
            });
        }
        let sortQuery = {};
        if (sortField) {
            if (sortField === 'role_name') {
                sortQuery['role_name'] = sortOrder === 1 ? 'asc' : 'desc';
            } else if (sortField === 'status_active') {
                sortQuery['status_active'] = sortOrder === 1 ? 'asc' : 'desc';
            }
        }
        if (filters && filterQuery.length > 0) {
            const obj = {
                data: await Roles.find({
                    $and: filterQuery
                }).sort(sortQuery).limit(rows).skip(first),
                totalRecords: await Roles.find({
                    $and: filterQuery
                }).countDocuments()
            }
            res.send(obj);
        } else {
            const obj = {
                data: await Roles.find({}).sort(sortQuery).limit(rows).skip(first),
                totalRecords: await Roles.find({}).countDocuments()
            }
            res.send(obj);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const obj = await Roles.find({});
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const obj = await Roles.findById(id).populate({
            path: "branch",
        });
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { role_name, admin_role, admin_banner, admin_message, admin_staff, admin_branch, admin_room, admin_package, member_member, member_booking, member_checkin, member_checkinqr, member_transfer, finance_purchase, finance_checkin, finance_attendance, branch, all_branch, status_active } = req.body;
        const obj = await Roles.findByIdAndUpdate(id, { role_name, admin_role, admin_banner, admin_message, admin_staff, admin_branch, admin_room, admin_package, member_member, member_booking, member_checkin, member_checkinqr, member_transfer, finance_purchase, finance_checkin, finance_attendance, branch, all_branch, status_active }, { new: false });
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});
module.exports = router;