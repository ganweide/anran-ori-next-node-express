const express = require('express');
const Members = require('../../models/members');
const Branch = require('../../models/branch');
const Booking = require('../../models/booking');
const MemberPackage = require('../../models/memberPackage');
const router = express.Router();
const auth = require('./jwtfilter');
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const moment = require('moment');
const multer = require('multer');
const path = require('path');
const fs = require('fs');



router.post('/checkmobileExist', async (req, res) => {
    try {
        const { mobileNumber } = req.body;
        const mobile = startsWithZero(mobileNumber);
        const obj = await Members.findOne({ mobileNumber: mobile });
        if (!obj) {
            res.status(200).json({
                status: "ok",
                data: [],
                message:
                    "Not avaliable",
            });
        } else {
            res.status(200).json({
                status: "Failed",
                data: [obj.member_name],
                message:
                    "Mobile No Already Exist",
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/partial-Register', async (req, res) => {
    try {
        const { member_name, mobileNumber } = req.body;


        const mobile = startsWithZero(mobileNumber);

        // Check if a member with the given mobile number already exists
        const obj = await Members.findOne({ mobileNumber: mobile });

        if (!obj) {
            // If not, create a new member
            const members = new Members({ member_name, mobileNumber: mobile });
            await members.save();
            res.status(200).json({
                status: "ok",
                data: [members],
                message: "User registered",
            });
        } else {
            // If a member already exists, return a failure message
            res.status(200).json({
                status: "Failed",
                data: [],
                message: "Mobile No Already Exist",
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});


function startsWithZero(mobileNumber) {
    return mobileNumber.startsWith('0') ? '6' + mobileNumber : + mobileNumber;
}

function startsWithZeroWeb(mobileNumber) {
    const mobileNumberStr = String(mobileNumber);
    return mobileNumberStr.startsWith('0') ? '6' + mobileNumberStr : Number(mobileNumberStr);
}

router.post('/full-Register', async (req, res) => {
    try {
        const { member_date, member_name, status, existingmobileno, preferredbranch, paymentmethod, legalFullname, preferredname, chinesename, age, gender, dob, address, city, postcode, states, mobileNumber, email, passport, aboutus, medicalhistory, suffered, healthrelatedissue, emergencyName, emergencymobile, emergencyrelationship, profileimageurl } = req.body;
        const mobile = startsWithZeroWeb(mobileNumber);
        const obj = await Members.findOne({ mobileNumber: mobile });
        if (!obj) {
            const fullregister = true;
            const members = new Members({ member_date, member_name, status, existingmobileno, preferredbranch, paymentmethod, legalFullname, preferredname, chinesename, age, gender, dob, address, city, postcode, states, mobileNumber: mobile, email, passport, aboutus, medicalhistory, suffered, healthrelatedissue, emergencyName, emergencymobile, emergencyrelationship, fullregister, profileimageurl });
            await members.save();
            res.status(200).json({
                status: "ok",
                data: [members],
                message:
                    "User registered",
            });
        } else {
            res.status(200).json({
                status: "Failed",
                data: [],
                message:
                    "Mobile No Already Exist",
            });
        }

    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});


router.post('/', auth, async (req, res) => {
    try {
        const { member_date, member_name, status, existingmobileno, preferredbranch, paymentmethod, legalFullname, preferredname, chinesename, age, gender, dob, address, city, postcode, states, mobileNumber, email, passport, aboutus, medicalhistory, suffered, healthrelatedissue, emergencyName, emergencymobile, emergencyrelationship, profileimageurl } = req.body;
        const mobile = startsWithZeroWeb(mobileNumber);
        const obj = await Members.findOne({ mobileNumber: mobile });
        if (!obj) {
            const fullregister = true;
            const members = new Members({ member_date, member_name, status, existingmobileno, preferredbranch, paymentmethod, legalFullname, preferredname, chinesename, age, gender, dob, address, city, postcode, states, mobileNumber: mobile, email, passport, aboutus, medicalhistory, suffered, healthrelatedissue, emergencyName, emergencymobile, emergencyrelationship, fullregister, profileimageurl });
            await members.save();
            res.status(200).json({
                status: "ok",
                data: [members],
                message:
                    "User registered",
            });
        } else {
            res.status(200).json({
                status: "Failed",
                data: [],
                message:
                    "Mobile No Already Exist",
            });
        }

    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const members = await Members.find({}).populate({
            path: "preferredbranch",
        });
        res.send(members);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const members = await Members.findById(id).populate({
            path: "preferredbranch",
        });
        res.send(members);
    } catch (error) {
        res.status(500).send(error);
    }
});



router.get('/findAllmember', auth, async (req, res) => {
    try {
        const members = await Members.find({}).select("member_name mobileNumber gender _id");
        res.send(members);
    } catch (error) {
        res.status(500).send(error);
    }
});



router.get('/findbyid/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const members = await Members.findById(id).populate({
            path: "preferredbranch",
        });
        const token = jwt.sign(
            req.body,
            process.env.TOKEN_KEY,
            {
                expiresIn: "5m",
            }
        );
        res.status(200).json({
            status: true,
            data: [members],
            message: "Member Data", token
        });

    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { member_date, member_name, status, existingmobileno, preferredbranch, paymentmethod, legalFullname, preferredname, chinesename, age, gender, dob, address, city, postcode, states, mobileNumber, email, passport, aboutus, medicalhistory, suffered, healthrelatedissue, emergencyName, emergencymobile, emergencyrelationship, profileimageurl } = req.body;
        const fullregister = true;
        const members = await Members.findByIdAndUpdate(id, { member_date, member_name, status, existingmobileno, preferredbranch, paymentmethod, legalFullname, preferredname, chinesename, age, gender, dob, address, city, postcode, states, mobileNumber, email, passport, aboutus, medicalhistory, suffered, healthrelatedissue, emergencyName, emergencymobile, emergencyrelationship, fullregister, profileimageurl }, { new: false });
        res.send(members);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const Members = await Members.findByIdAndDelete(id);
        res.send(Members);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});


router.post('/findall', auth, async (req, res) => {
    try {
        const { first, rows, filters, sortField, sortOrder } = req.body;
        let filterQuery = [];
        if (filters) {
            Object.keys(filters).forEach(e => {
                if (filters[e].value && filters[e].value && e === 'member_date') {

                    const dateStr = filters[e].value;
                    const isValidDate = moment(dateStr, 'DD/MM/YYYY', true).isValid();
                    if (isValidDate) {
                        const startDate = moment(dateStr).startOf('day').toDate();
                        const endDate = moment(dateStr).endOf('day').toDate();
                        filterQuery.push({ member_date: { $gte: startDate, $lte: endDate } });
                    }
                } else if (filters[e].value && filters[e].value && e === 'name') {
                    filterQuery.push({ member_name: { $regex: ".*" + filters[e].value + ".*", $options: 'i' } });
                } else if (filters[e].value && filters[e].value && e === 'gender') {
                    filterQuery.push({ gender: { $regex: ".*" + filters[e].value + ".*", $options: 'i' } });
                } else if (filters[e].value && filters[e].value && e === 'Mobile') {
                    filterQuery.push({ mobileNumber: { $regex: ".*" + filters[e].value + ".*", $options: 'i' } });
                } else if (filters[e].value && filters[e].value && e === 'email') {
                    filterQuery.push({ email: { $regex: ".*" + filters[e].value + ".*", $options: 'i' } });
                }
            });
        }
        if (filters && filters.branch && filters.branch.value) {
            const branchList = await Branch.find({ branch_name: { $regex: ".*" + filters.branch.value + ".*", $options: 'i' } }).select('_id');
            filterQuery.push({ preferredbranch: { $in: branchList } });
        }

        let query = filterQuery.length > 0 ? { $and: filterQuery } : {};


        let sortQuery = {};
        if (sortField) {
            if (sortField === 'name') {
                sortQuery['member_name'] = sortOrder === 1 ? 'asc' : 'desc';
            } else if (sortField === 'member_date') {
                sortQuery['member_date'] = sortOrder === 1 ? 'asc' : 'desc';
            }
        }

        const data = await Members.find(query)
            .populate({ path: "preferredbranch" })
            .sort(sortQuery)
            .skip(first)
            .limit(rows);

        data.forEach(async member => {
            const memberPackageData = await MemberPackage.findOne({ member: member._id })
                .sort({ package_date: -1 });
            if (memberPackageData) {
                member.package_date = memberPackageData.package_date;
            } else {
                member.package_date = null;
            }
            const checkinData = await Booking.findOne({ member: member._id })
                .sort({ checkin_date: -1 });

            if (checkinData) {
                member.checkin_date = checkinData.checkin_date;
            } else {
                member.checkin_date = null;
            }
        });
        const totalRecords = await Members.countDocuments(query);

        res.send({ data, totalRecords });
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
            filterQuery.push({ preferredbranch: { $in: branchIds } });
        }
        let query = filterQuery.length > 0 ? { $and: filterQuery } : {};
        let sortQuery = {};
        sortQuery['member_date'] =  'desc';
        const data = await Members.find(query)
            .populate({ path: "preferredbranch" })
            .skip(first)
            .sort(sortQuery)
            .limit(rows);

        const totalRecords = await Members.countDocuments(query);

        res.send({ data, totalRecords });
    } catch (error) {
        res.status(500).send(error);
    }
});




const imgUrl = `${process.env.PUBLIC_FILE_PROFILE_URL}`;


// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imgUrl);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});


// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Define a route for file upload
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'ID is required'
            });
        }

        const profileimageurl = path.join(imgUrl, req.file.filename);
        await Members.findByIdAndUpdate(id, { profileimageurl: profileimageurl });
        res.status(200).json({
            status: 'ok',
            data: req.file,
            message: 'File uploaded successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'File upload failed',
            error: error.message
        });
    }
});


module.exports = router;