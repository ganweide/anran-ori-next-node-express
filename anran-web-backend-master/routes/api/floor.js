const express = require('express');
const Floor = require('../../models/floor');
const router = express.Router();
const Branch = require('../../models/branch');
const auth = require('./jwtfilter');

router.post('/', auth, async (req, res) => {
    try {
        const { branch, floor_no, floor_details, floor_url, floor_plan, sortorder, status_active } = req.body;
        const obj = new Floor({ branch, floor_no, floor_details, floor_url, floor_plan, sortorder, status_active });
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
                if (filters[e].value && e === 'floor_no') {
                    filterQuery.push({ floor_no: { $regex: ".*" + filters[e].value + ".*", $options: 'i' } });
                } else if (filters[e].value && e === 'floor_details') {
                    filterQuery.push({ floor_details: { $regex: ".*" + filters[e].value + ".*", $options: 'i' } });
                } else if (filters[e].value && filters[e].value && e === 'status_active') {
                    let newObject = {};
                    newObject[e] = { $eq: (filters[e].value === 'Active') };
                    filterQuery.push(newObject);
                } else if (filters[e].value && filters[e].value && e === 'sortorder') {
                    let newObject = {};
                    newObject[e] = { $eq: filters[e].value };
                    filterQuery.push(newObject);
                }
            });
        }
        if (filters && filters.branch && filters.branch.value) {
            const branchList = await Branch.find({ branch_name: { $regex: ".*" + filters.branch.value + ".*", $options: 'i' } }).select('_id');
            filterQuery.push({ branch: { $in: branchList } });
        }
        let sortQuery = {};
        if (sortField) {
            if (sortField === 'floor_no') {
                sortQuery['floor_no'] = sortOrder === 1 ? 'asc' : 'desc';
            } else if (sortField === 'status_active') {
                sortQuery['status_active'] = sortOrder === 1 ? 'asc' : 'desc';
            } else if (sortField === 'sortorder') {
                sortQuery['sortorder'] = sortOrder === 1 ? 'asc' : 'desc';
            } else if (sortField === 'floor_details') {
                sortQuery['floor_details'] = sortOrder === 1 ? 'asc' : 'desc';
            }
        }
        if (filters && filterQuery.length > 0) {
            const obj = {
                data: await Floor.find({
                    $and: filterQuery
                }).populate({
                    path: "branch",
                }).sort(sortQuery).limit(rows).skip(first),
                totalRecords: await Floor.find({
                    $and: filterQuery
                }).countDocuments()
            }
            res.send(obj);
        } else {
            const obj = {
                data: await Floor.find({}).populate({
                    path: "branch",
                }).sort(sortQuery).limit(rows).skip(first),
                totalRecords: await Floor.find({}).countDocuments()
            }
            res.send(obj);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const obj = await Floor.find({status_active: true}).populate({
            path: "branch",
        });
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const obj = await Floor.findById(id).populate({
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
        const { branch, floor_no, floor_details, floor_url, floor_plan, sortorder, status_active } = req.body;
        const obj = await Floor.findByIdAndUpdate(id, { branch, floor_no, floor_details, floor_url, floor_plan, sortorder, status_active }, { new: true });
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/branchfloor/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const obj = await Floor.find({ 
            branch: id, 
            status_active: true 
        }).populate({
            path: "branch"
        });
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});
module.exports = router;