const express = require("express");
const router = express.Router();
var multer = require('multer');
const auth = require('./jwtfilter');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.FILE_STORAGE_URL)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    },
})
const uploadStorage = multer({ storage: storage })
router.post("/upload", uploadStorage.single('file'), async (req, res) => {
    try {
        if (req.file === undefined) return res.send("you must select a file.");
        const imgUrl = `${process.env.PUBLIC_IMAGES_URL}${req.file.filename}`;
        return res.send(imgUrl);
    } catch (error) {
        return res.send("Could not upload file!!!");
    }
});
module.exports = router;
