const express = require('express');
const Staff = require('../../models/staff');
const router = express.Router();
const Branch = require('../../models/branch');
const Roles = require('../../models/role');
const auth = require('./jwtfilter');

router.post('/', auth, async (req, res) => {
    try {
        const { name, gender, roles, branch, joingdate, username, loginkey, status_active, staff_code, emailaddress, position_department, fullname, nirc, religion, mobilenumber, martialstatus, currentaddress, bankname, bankaccountnumber, bankepfno, banksocsono, bankincometaxno, emergency_contactname, emergency_relation, emergency_contact } = req.body;
        const obj = new Staff({ name, gender, roles, branch, joingdate, username, loginkey, status_active, staff_code, emailaddress, position_department, fullname, nirc, religion, mobilenumber, martialstatus, currentaddress, bankname, bankaccountnumber, bankepfno, banksocsono, bankincometaxno, emergency_contactname, emergency_relation, emergency_contact });
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
                if (filters[e].value && e === 'name') {
                    filterQuery.push({ name: { $regex: ".*" + filters[e].value + ".*", $options: 'i' } });
                } else if (filters[e].value && e === 'gender') {
                    filterQuery.push({ gender: { $regex: ".*" + filters[e].value + ".*", $options: 'i' } });
                } else if (filters[e].value && filters[e].value && e === 'status_active') {
                    let newObject = {};
                    newObject[e] = { $eq: (filters[e].value === 'Active') };
                    filterQuery.push(newObject);
                }
            });
        }
        let sortQuery = {};
        if (filters && filters.branch && filters.branch.value) {
            const branchList = await Branch.find({ branch_name: { $regex: ".*" + filters.branch.value + ".*", $options: 'i' } }).select('_id');
            filterQuery.push({ branch: { $in: branchList } });
        }
        if (filters && filters.roles && filters.roles.value) {
            const rolesList = await Roles.find({ role_name: { $regex: ".*" + filters.roles.value + ".*", $options: 'i' } }).select('_id');
            filterQuery.push({ roles: { $in: rolesList } });
        }
        if (sortField) {
            if (sortField === 'name') {
                sortQuery['name'] = sortOrder === 1 ? 'asc' : 'desc';
            } else if (sortField === 'status_active') {
                sortQuery['status_active'] = sortOrder === 1 ? 'asc' : 'desc';
            }
        }
        if (filters && filterQuery.length > 0) {
            const obj = {
                data: await Staff.find({
                    $and: filterQuery
                }).populate({
                    path: "branch",
                }).populate({
                    path: "roles",
                }).sort(sortQuery).limit(rows).skip(first),
                totalRecords: await Staff.find({
                    $and: filterQuery
                }).countDocuments()
            }
            res.send(obj);
        } else {
            const obj = {
                data: await Staff.find({}).populate({
                    path: "branch",
                }).populate({
                    path: "roles",
                }).sort(sortQuery).limit(rows).skip(first),
                totalRecords: await Staff.find({}).countDocuments()
            }
            res.send(obj);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const obj = await Staff.find();
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const obj = await Staff.findById(id).populate({
            path: "branch",
        }).populate({
            path: "roles",
        });
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, gender, roles, branch, joingdate, username, loginkey, status_active, staff_code, emailaddress, position_department, fullname, nirc, religion, mobilenumber, martialstatus, currentaddress, bankname, bankaccountnumber, bankepfno, banksocsono, bankincometaxno, emergency_contactname, emergency_relation, emergency_contact } = req.body;
        const obj = await Staff.findByIdAndUpdate(id, { name, gender, roles, branch, joingdate, username, loginkey, status_active, staff_code, emailaddress, position_department, fullname, nirc, religion, mobilenumber, martialstatus, currentaddress, bankname, bankaccountnumber, bankepfno, banksocsono, bankincometaxno, emergency_contactname, emergency_relation, emergency_contact }, { new: true });
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.post('/findallDash', auth, async (req, res) => {
    try {
        const { first, rows, branch } = req.body;
        let filterQuery = [];
        if (branch && branch.length > 0) {
            const branchList = await Branch.find({ branch_name: { $in: branch.map(b => new RegExp(b, 'i')) } }).select('_id');
            const branchIds = branchList.map(b => b._id);
            filterQuery.push({ branch: { $in: branchIds } });
        }

        let query = filterQuery.length > 0 ? { $and: filterQuery } : {};
        let sortQuery = {};
        sortQuery['createdAt'] = 'desc';
        const data = await Staff.find(query)
            .populate({ path: "branch" })
            .populate({ path: "roles" })
            .skip(first)
            .sort(sortQuery)
            .limit(rows);

        const totalRecords = await Staff.countDocuments(query);
        res.send({ data, totalRecords });


    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

module.exports = router;