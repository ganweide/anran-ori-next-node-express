const express = require('express');
const Package = require('../../models/package');
const router = express.Router();
const auth = require('./jwtfilter');
const MemberPackage = require('../../models/memberPackage');

router.post('/', auth, async (req, res) => {
    try {
        const { package_name, price, noof_times, promo_noof_times, package_image, package_image_url, transferable, individual_package, promotion_period_from, promotion_period_to, percentage_ownbranch, price_ownbranch, price_checkinbranch, all_branch, sortorder, status_active, unlimitedyear, package_category, promotion } = req.body;
        const obj = new Package({ package_name, price, noof_times, promo_noof_times, package_image, package_image_url, transferable, individual_package, promotion_period_from, promotion_period_to, percentage_ownbranch, price_ownbranch, price_checkinbranch, all_branch, sortorder, status_active, unlimitedyear, package_category, promotion });
        await obj.save();
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.get('/', auth, async (req, res) => {
    try {
        const obj = await Package.find({ status_active: true });
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
                if (filters[e].value && Number(filters[e].value) && e !== 'package_name') {
                    let newObject = {};
                    newObject[e] = { $eq: filters[e].value };
                    filterQuery.push(newObject);
                } else if (filters[e].value && filters[e].value && e === 'package_name') {
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
            if (sortField === 'package_name') {
                sortQuery['package_name'] = sortOrder === 1 ? 'asc' : 'desc';
            } else if (sortField === 'status_active') {
                sortQuery['status_active'] = sortOrder === 1 ? 'asc' : 'desc';
            } else if (sortField === 'sortorder') {
                sortQuery['sortorder'] = sortOrder === 1 ? 'asc' : 'desc';
            }
        }
        if (filters && filterQuery.length > 0) {
            const obj = {
                data: await Package.find({
                    $and: filterQuery
                }).sort(sortQuery).limit(rows).skip(first),
                totalRecords: await Package.find({
                    $and: filterQuery
                }).countDocuments()
            }
            res.send(obj);
        } else {
            const obj = {
                data: await Package.find({}).sort(sortQuery).limit(rows).skip(first),
                totalRecords: await Package.find({}).countDocuments()
            }
            res.send(obj);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const obj = await Package.findById(id).populate({
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
        const obj = await Package.findById(id).populate({
            path: "branch",
        });
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.get('/packagesByBranch/:branchId', auth, async (req, res) => {
    try {
        const { branchId } = req.params;
        const packages = await Package.find({
            branch: branchId,
            status_active: true
        }).populate({
            path: 'branch'
        });
        res.send(packages);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/delete/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const count = await MemberPackage.countDocuments({ packageid: id });
        if (count > 0) {
            return res.status(200).send({ message: 'This Package is already in use' });
        }
        const deletedPackage = await Package.findByIdAndDelete(id);
        if (!deletedPackage) {
            return res.status(404).send({ message: 'Package not found' });
        }
        res.send({ message: 'Package deleted successfully', deletedPackage });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Error deleting package', error });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { package_name, price, noof_times, promo_noof_times, package_image, package_image_url, transferable, individual_package, promotion_period_from, promotion_period_to, branch, percentage_ownbranch, price_ownbranch, price_checkinbranch, all_branch, sortorder, status_active, unlimitedyear, package_category, promotion } = req.body;
        const obj = await Package.findByIdAndUpdate(id, { package_name, price, noof_times, promo_noof_times, package_image, package_image_url, transferable, individual_package, promotion_period_from, promotion_period_to, branch, percentage_ownbranch, price_ownbranch, price_checkinbranch, all_branch, sortorder, status_active, unlimitedyear, package_category, promotion }, { new: true });
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});
module.exports = router;