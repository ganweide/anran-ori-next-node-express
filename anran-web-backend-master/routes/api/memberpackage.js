const express = require('express');
const MemberPackage = require('../../models/memberPackage');
const Members = require('../../models/members');
const Branch = require('../../models/branch');
const router = express.Router();
const moment = require('moment');
const auth = require('./jwtfilter');
const Counter = require('../../models/counterSchema');


async function getNextInvoiceNumber() {
    const counter = await Counter.findByIdAndUpdate(
        { _id: 'invoiceNumber' },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );

    return `INV-${counter.sequence_value.toString().padStart(6, '0')}`;
}

router.post('/', auth, async (req, res) => {
    try {
        const memberPackages = req.body;
        const updatedMemberPackages = await Promise.all(memberPackages.map(async (item) => {
            const nextInvoiceNumber = await getNextInvoiceNumber();
            return { ...item, invoicenumber: nextInvoiceNumber };
        }));
        let mempackage = await MemberPackage.create(updatedMemberPackages);
        res.send(mempackage);
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});



router.post('/createpackage', auth, async (req, res) => {
    try {
        const nextInvoiceNumber = await getNextInvoiceNumber();
        const memberPackages = req.body;
        memberPackages.invoicenumber = nextInvoiceNumber;
        let mempackage = await MemberPackage.create(memberPackages);
        res.send(mempackage);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const obj = await MemberPackage.findByIdAndUpdate(id, req.body, { new: false });
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.get('/delete/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const obj = await MemberPackage.findByIdAndDelete(id);
        res.status(200).send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const members = await MemberPackage.find({}).populate({
            path: "member",
        });
        res.send(members);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const obj = await MemberPackage.find({ $and: [{ member: { $eq: id } }] });
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.get('/avail/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const oneYearAgo = moment().subtract(1, 'years').toDate();
        const obj = await MemberPackage.find({
            member: id,
            $or: [
                { package_date: { $gt: oneYearAgo } },
                { balance: { $gt: 0 } }
            ]
        }).populate({ path: "packageid" })
        .populate({ path: "branch" })
        .sort({ package_date: -1 });

        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/findid/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const obj = await MemberPackage.findById(id);
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/memberid', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const obj = await MemberPackage.find({ $and: [{ member: { $eq: id } }, { balance: { $gt: 0 } }] });
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/memberid', auth, async (req, res) => {
    try {
        const { member, first, rows } = req.body;
        const obj = {
            data: await MemberPackage.find({ $and: [{ member: { $eq: member } }] }).populate({
                path: "member",
            }).populate({
                path: "packageid",
            })
                .sort({ package_date: -1 })
                .limit(rows).skip(first),
            totalRecords: await MemberPackage.find({ $and: [{ member: { $eq: member } }] }).countDocuments()
        }
        res.status(200).send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});



router.post('/findAll', auth, async (req, res) => {
    try {
        const { id, first, rows, filters, sortField, sortOrder } = req.body;
        let filterQuery = [];
        if (filters) {
            Object.keys(filters).forEach(e => {
                if (filters[e].value && filters[e].value && e === 'package_date') {
                    const dateStr = filters[e].value;
                    const dt = formatDate(dateStr);
                    const isValidDate = moment(dt, 'YYYY-MM-DD', true).isValid();
                    if (isValidDate) {
                        const startDate = moment(dt).startOf('day').toDate();
                        const endDate = moment(dt).endOf('day').toDate();
                        filterQuery.push({ package_date: { $gte: startDate, $lte: endDate } });
                    }
                } else if (filters[e].value && filters[e].value && e === 'package') {
                    filterQuery.push({ package: { $regex: ".*" + filters[e].value + ".*", $options: 'i' } });
                } else if (filters[e].value && filters[e].value && e === 'invoicenumber') {
                    filterQuery.push({ invoicenumber: { $regex: ".*" + filters[e].value + ".*", $options: 'i' } });
                }
            });
        }

        if (id) {
            filterQuery.push({ member: { $eq: id } });
        }
        if (filters && filters.member && filters.member.value) {
            const branchList = await Members.find({ member_name: { $regex: ".*" + filters.member.value + ".*", $options: 'i' } }).select('_id');
            filterQuery.push({ member: { $in: branchList } });
        } else if (filters && filters.branch && filters.branch.value) {
            const branchList = await Branch.find({ branch_name: { $regex: ".*" + filters.branch.value + ".*", $options: 'i' } }).select('_id');
            filterQuery.push({ branch: { $in: branchList } });
        }

        let query = filterQuery.length > 0 ? { $and: filterQuery } : {};

        let sortQuery = {};
        if (sortField) {
            if (sortField === 'member') {
                sortQuery['member'] = sortOrder === 1 ? 'asc' : 'desc';
            } else if (sortField === 'package_date') {
                sortQuery['package_date'] = sortOrder === 1 ? 'asc' : 'desc';
            } else if (sortField === 'branch') {
                sortQuery['branch'] = sortOrder === 1 ? 'asc' : 'desc';
            } else {
                sortQuery[sortField] = sortOrder === 1 ? 'asc' : 'desc';
            }
        }

        const data = await MemberPackage.find(query)
            .populate({ path: "member" })
            .populate({ path: "packageid" })
            .populate({ path: "branch" })
            .sort(sortQuery)
            .skip(first)
            .limit(rows);

        const totalRecords = await MemberPackage.countDocuments(query);

        res.send({ data, totalRecords });

    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/findAllDash', auth, async (req, res) => {
    try {
        const { first, rows, branch } = req.body;

        let filterQuery = [];
        if (branch && branch.length > 0) {
            //  const branchList = await Branch.find({ branch_name: { $in: branch.map(b => new RegExp(b, 'i')) } }).select('_id');
            //  const branchIds = branchList.map(b => b._id);
            //  filterQuery.push({ packageid: { $in: branchIds } });
        }

        let query = filterQuery.length > 0 ? { $and: filterQuery } : {};
        let sortQuery = {};
        sortQuery['createdAt']='desc';

        const data = await MemberPackage.find(query)
            .populate({ path: "member" })
            .populate({ path: "packageid" })
            .skip(first)
            .sort(sortQuery)
            .limit(rows);

        const totalRecords = await MemberPackage.countDocuments(query);

        res.send({ data, totalRecords });

    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

function formatDate(dateStr) {
    // Convert from 'DD/MM/YYYY' to 'YYYY-MM-DD'
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
}

module.exports = router;