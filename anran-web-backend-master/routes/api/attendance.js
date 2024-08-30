const express = require('express');
const Attendance = require('../../models/staff_attendance');
const router = express.Router();
const Staff = require('../../models/staff');
const ExcelJS = require('exceljs');
const Branch = require('../../models/branch');
const auth = require('./jwtfilter');

router.post('/', auth,async (req, res) => {
    const { att_type, username } = req.body;
    try {
        const staffList = await Staff.find({ $and: [{ username: { $eq: username } }] });
        if (staffList && staffList.length > 0) {
            const staff = staffList[0];
            const obj = new Attendance({ att_type, staff });
            await obj.save();
            res.status(200).send({ status: true });
        }
        res.status(500).send({ status: false });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/findall',auth, async (req, res) => {
    try {
        const { first, rows, filters } = req.body;
        let filterQuery = [];
        if (filters) {
            Object.keys(filters).forEach(e => {
                if (filters[e].value && e === 'att_type') {
                    let newObject = {};
                    newObject[e] = { $regex: ".*" + filters[e].value + ".*" };
                    filterQuery.push(newObject);
                }
            });
        }
        if (filters && filters.staff && filters.staff.value) {
            const staffList = await Staff.find({ username: { $regex: ".*" + filters.staff.value + ".*" } }).select('_id');
            filterQuery.push({ staff: { $in: staffList } });
        }
        if (filters && filterQuery.length > 0) {
            const obj = {
                data: await Attendance.find({
                    $and: filterQuery
                }).populate({
                    path: "staff",
                }).limit(rows).skip(first),
                totalRecords: await Attendance.find({
                    $and: filterQuery
                }).countDocuments()
            }
            res.send(obj);
        } else {
            const obj = {
                data: await Attendance.find({}).populate({
                    path: "staff",
                }).limit(rows).skip(first),
                totalRecords: await Attendance.find({}).countDocuments()
            }
            res.send(obj);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/generate-attendence',auth, async (req, res) => {
    const { fromDate, toDate } = req.body;
    try {
        const atts = await Attendance.find({
            att_date: {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            }
        }).populate('staff');

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Attendence Report');

        const headerStyle = {
            font: { bold: true },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFA500' } // Orange color
            }
        };

        // Add header row
        worksheet.columns = [
            { header: 'Date', key: 'date', width: 20 },
            { header: 'Staff Name', key: 'staff', width: 20 },
            { header: 'Branch', key: 'branch', width: 15 },
            { header: 'Type', key: 'atttype', width: 15 },
        ];

        worksheet.getRow(1).eachCell((cell) => {
            cell.fill = headerStyle.fill;
            cell.font = headerStyle.font;
        });

   
        for (const att of atts) {
            const branch = await Branch.findById(att.staff.branch);  
            worksheet.addRow({
                date: att.att_date,
                staff: att.staff ? att.staff.name : '',
                branch: branch.branch_name,
                atttype: att.att_type,
            });
        }

        // Generate Excel file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=usage_report.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error generating Attendence report:', error);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;