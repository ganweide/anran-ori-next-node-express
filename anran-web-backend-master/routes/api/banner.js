const express = require('express');
const Banner = require('../../models/banner');
const router = express.Router();
const auth = require('./jwtfilter');

router.post('/', auth, async (req, res) => {
    try {
        const { image_url, image_data_url, startdate, enddate, status_active, allways, sortorder } = req.body;
        const obj = new Banner({ image_url, image_data_url, startdate, enddate, status_active, allways, sortorder });
        await obj.save();
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { image_url, image_data_url, startdate, enddate, status_active, allways, sortorder } = req.body;
        const obj = await Banner.findByIdAndUpdate(id, { image_url, image_data_url, startdate, enddate, status_active, allways, sortorder }, { new: true });
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const obj = await Banner.findById(id);
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
                if (filters[e].value && filters[e].value && e === 'image_data_url') {
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
            if (sortField === 'image_data_url') {
                sortQuery['image_data_url'] = sortOrder === 1 ? 'asc' : 'desc';
            } else if (sortField === 'status_active') {
                sortQuery['status_active'] = sortOrder === 1 ? 'asc' : 'desc';
            } else if (sortField === 'sortorder') {
                sortQuery['sortorder'] = sortOrder === 1 ? 'asc' : 'desc';
            }
        }
        if (filters && filterQuery.length > 0) {
            const obj = {
                data: await Banner.find({
                    $and: filterQuery
                }).sort(sortQuery).limit(rows).skip(first),
                totalRecords: await Banner.find({
                    $and: filterQuery
                }).countDocuments()
            }
            res.send(obj);
        } else {
            const obj = {
                data: await Banner.find({}).sort(sortQuery).limit(rows).skip(first),
                totalRecords: await Banner.find({}).countDocuments()
            }
            res.send(obj);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

router.post('/findallMobile',auth, async (req, res) => {
    try {
        const obj = {
            data: await Banner.find({})
        }
        res.send(obj);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

module.exports = router;