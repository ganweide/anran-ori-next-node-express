const express = require('express');
const Transfer = require('../../models/transfer');
const MemberPackage = require('../../models/memberPackage');
const Members = require('../../models/members');
const Branch = require('../../models/branch');
const router = express.Router();
const moment = require('moment');
const auth = require('./jwtfilter');

router.post('/', auth, async (req, res) => {
    try {
        let transaction_no = '';
        if (req.body.memberpackage.branch) {
            transaction_no = await generateRunningNumber(req.body.memberpackage.branch._id, req.body.memberpackage.branch.branch_code);
        }
        console.log(transaction_no)
        const requestData = {
            ...req.body,
            transaction_no
        };
        let obj = await Transfer.create(requestData);
        res.send(obj);
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});


const generateRunningNumber = async (id, branchCode) => {
    try {
        const letter = "T";
        const date = new Date();
        const yyyyMMdd = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;

        // Find the latest booking with the matching pattern
        console.log(branchCode)
        console.log(letter)
        console.log(yyyyMMdd)
        console.log(id)
        const latestBooking = await Transfer.findOne({
            //'memberpackage.branch._id': id,
            transaction_no: new RegExp(`^${branchCode}-${letter}-${yyyyMMdd}`)
        }).sort({ transaction_no: -1 });

        let sequence = "0001"; // Default starting sequence if no previous booking found
       console.log(latestBooking)
        if (latestBooking) {
            const lastTransactionNo = latestBooking.transaction_no;
            const sequencePart = lastTransactionNo.split(`${yyyyMMdd}`)[1]; // Extract the sequence part after the date
            if (sequencePart) {
                const lastSequence = parseInt(sequencePart, 10); // Parse the sequence part as an integer
                sequence = (lastSequence + 1).toString().padStart(4, "0"); // Increment and pad the sequence to 4 digits
            }
        }

        const runningNo = `${branchCode}-${letter}-${yyyyMMdd}${sequence}`;
        return runningNo;
    } catch (error) {
        console.error("Error generating running number:", error);
        return ''; // Return an empty string in case of an error
    }
};


router.get('/', auth, async (req, res) => {
    try {
        const obj = await Transfer.find({}).populate({
            path: "memberfrom",
        }).populate({
            path: "memberto",
        }).populate({
            path: "memberpackage",
        });
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const obj = await Transfer.findById(id).populate({
            path: "memberfrom",
        }).populate({
            path: "memberto",
        }).populate({
            path: "memberpackage",
        });
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const obj = await Transfer.findByIdAndUpdate(id, req.body, { new: false });
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/mobileTransfer/', auth, async (req, res) => {
    try {
        const memobj = await Members.findOne({ $and: [{ mobileNumber: { $eq: req.body.mobileno } }] });
        if (memobj) {
            if (req.body.memberfrom === memobj._id) {
                res.status(200).json({
                    status: "Failed",
                    data: [],
                    message: "Cannot transfer to the same member",
                });
                return;
            }
            if (req.body.points < req.body.memberpackage.balance) {
                let transfer = {
                    memberfrom: req.body.memberfrom,
                    memberto: memobj,
                    memberpackage: req.body.memberpackage,
                    points: req.body.points
                }
                let obj = await Transfer.create(transfer);
                let dt = {
                    member: obj.memberto,
                    packageid: req.body.memberpackage,
                    package: req.body.memberpackage.package,
                    times: obj.points,
                    quantity: 1,
                    price: req.body.memberpackage.price,
                    balance: obj.points,
                    purchasetype: 'Transfer',
                    transferfrom: obj.memberpackage
                };
                await MemberPackage.create(dt);
                let update = {
                    balance: req.body.memberpackage.balance - obj.points,
                    transferedtimes: req.body.memberpackage.transferedtimes + obj.points
                };
                await MemberPackage.findByIdAndUpdate(req.body.memberpackage._id, update, { new: false });
                res.status(200).json({
                    status: "ok",
                    data: [obj],
                    message: "Package Transfered",
                });
            } else {
                res.status(200).json({
                    status: "Failed",
                    data: [],
                    message: "Insuffient balance",
                });
            }
        } else {
            res.status(200).json({
                status: "Failed",
                data: [],
                message: "Mobile No Not Matchine with Member",
            });
        }
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
                if (filters[e].value && filters[e].value && e === 'transfer_date') {
                    const dateStr = filters[e].value;
                    const dt = formatDate(dateStr);
                    const isValidDate = moment(dt, 'YYYY-MM-DD', true).isValid();
                    if (isValidDate) {
                        const startDate = moment(dt).startOf('day').toDate();
                        const endDate = moment(dt).endOf('day').toDate();
                        filterQuery.push({ transfer_date: { $gte: startDate, $lte: endDate } });
                    }
                } else if (filters[e].value && filters[e].value && e === 'transaction_no') {
                    filterQuery.push({ transaction_no: { $regex: ".*" + filters[e].value + ".*", $options: 'i' } });
                }
            });
        }
        if (id) {
            filterQuery.push({ memberfrom: { $eq: id } });
        }

        if (filters && filters.member && filters.member.value) {
            const branchList = await Members.find({ member_name: { $regex: ".*" + filters.member.value + ".*", $options: 'i' } }).select('_id');
            filterQuery.push({ memberto: { $in: branchList } });
        }
        if (filters && filters.memberfrom && filters.memberfrom.value) {
            const branchList = await Members.find({ member_name: { $regex: ".*" + filters.memberfrom.value + ".*", $options: 'i' } }).select('_id');
            filterQuery.push({ memberfrom: { $in: branchList } });
        }
        if (filters && filters.Package && filters.Package.value) {
            const branchList = await MemberPackage.find({ package: { $regex: ".*" + filters.Package.value + ".*", $options: 'i' } }).select('_id');
            filterQuery.push({ memberpackage: { $in: branchList } });
        }


        let query = filterQuery.length > 0 ? { $and: filterQuery } : {};


        let sortQuery = {};
        if (sortField) {
            if (sortField === 'Package') {
                sortQuery['memberpackage'] = sortOrder === 1 ? 'asc' : 'desc';
            } else {
                sortQuery[sortField] = sortOrder === 1 ? 'asc' : 'desc';
            }
        }

        const data = await Transfer.find(query)
            .populate({ path: "memberfrom" })
            .populate({ path: "memberto" })
            .populate({ path: "memberpackage" })
            .sort(sortQuery)
            .skip(first)
            .limit(rows);

        const totalRecords = await Transfer.countDocuments(query);

        res.send({ data, totalRecords });


    } catch (error) {
        res.status(500).send(error);
    }
});


router.post('/getTransferBasedonPackage', auth, async (req, res) => {
    try {
        const { memberid, packageid } = req.body;

        const transfer = await Transfer.find({
            $and: [
                { memberfrom: memberid },
                { memberpackage: packageid }
            ]
        }).populate({
            path: "memberto",
            select: 'member_name'
        }).populate({
            path: "memberpackage",
            select: 'package'
        }).sort({ transfer_date: -1 });
        res.status(200).json({ success: true, transfer });
    } catch (error) {
        res.status(500).send(error);
    }
});

function formatDate(dateStr) {
    // Convert from 'DD/MM/YYYY' to 'YYYY-MM-DD'
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
}

module.exports = router;