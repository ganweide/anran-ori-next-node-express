const express = require('express');
const Branch = require('../../models/branch');
const router = express.Router();
const auth = require('./jwtfilter');

router.post('/', auth, async (req, res) => {
    try {
        const { company_name, branch_name, whatsappno, operating_from_hours, operating_to_hours, address, google_link, waze_link, staff, image_url, image_data, sortorder, status_active, paymentkey, hqbanch, sst, sst_percent, branch_code, apikey } = req.body;
        const branch = new Branch({ company_name, branch_name, whatsappno, operating_from_hours, operating_to_hours, address, google_link, waze_link, staff, image_url, image_data, sortorder, status_active, paymentkey, hqbanch, sst, sst_percent, branch_code, apikey });
        await branch.save();
        res.send(branch);
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
                if (filters[e].value && filters[e].value && e === 'branch_name') {
                    let newObject = {};
                    newObject[e] = { $regex: ".*" + filters[e].value + ".*", $options: 'i' };
                    filterQuery.push(newObject);
                } else if (filters[e].value && filters[e].value && e === 'company_name') {
                    let newObject = {};
                    newObject[e] = { $regex: ".*" + filters[e].value + ".*", $options: 'i' };
                    filterQuery.push(newObject);
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
        let sortQuery = {};
        if (sortField) {
            if (sortField === 'branch_name') {
                sortQuery['branch_name'] = sortOrder === 1 ? 'asc' : 'desc';
            } else if (sortField === 'status_active') {
                sortQuery['status_active'] = sortOrder === 1 ? 'asc' : 'desc';
            } else if (sortField === 'sortorder') {
                sortQuery['sortorder'] = sortOrder === 1 ? 'asc' : 'desc';
            } else if (sortField === 'company_name') {
                sortQuery['company_name'] = sortOrder === 1 ? 'asc' : 'desc';
            }
        }
        if (filters && filterQuery.length > 0) {
            const obj = {
                data: await Branch.find({
                    $and: filterQuery
                }).populate({
                    path: "staff",
                }).sort(sortQuery).limit(rows).skip(first),
                totalRecords: await Branch.find({
                    $and: filterQuery
                }).countDocuments()
            }
            res.send(obj);
        } else {
            const obj = {
                data: await Branch.find({}).populate({
                    path: "staff",
                }).sort(sortQuery).limit(rows).skip(first),
                totalRecords: await Branch.find({}).countDocuments()
            }
            res.send(obj);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const branchs = await Branch.find({ status_active: true }).sort({ sortorder: 1 });
        res.send(branchs);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.get('/mobile/', async (req, res) => {
    try {
        const branchs = await Branch.find({ status_active: true }).sort({ sortorder: 1 });
        res.send(branchs);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const branch = await Branch.findById(id).populate({
            path: "staff",
        });
        res.send(branch);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { company_name, branch_name, whatsappno, operating_from_hours, operating_to_hours, address, google_link, waze_link, staff, image_url, image_data, sortorder, status_active, paymentkey, hqbanch, sst, sst_percent, branch_code, apikey } = req.body;
        const branch = await Branch.findByIdAndUpdate(id, { company_name, branch_name, whatsappno, operating_from_hours, operating_to_hours, address, google_link, waze_link, staff, image_url, image_data, sortorder, status_active, paymentkey, hqbanch, sst, sst_percent, branch_code, apikey }, { new: true });
        res.send(branch);
    } catch (error) {
        res.status(500).send(error);
    }
});
module.exports = router;