require("dotenv").config();
const express = require("express");
const cors = require('cors');

const path = require('path');
const app = express();
app.use(cors());
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Database connected successfully');
});
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(process.env.PUBLIC_FILE_STORAGE_URL));
app.use(process.env.PUBLIC_FILE_PROFILE_URL, express.static(process.env.PUBLIC_FILE_PROFILE_URL));
app.use(require('./routes'));
app.use("*", (req, res) => {
    res.status(404).json({
        success: "false",
        message: "Page not found",
        error: {
            statusCode: 404,
            message: "You reached a route that is not defined on this server",
        },
    });
});
module.exports = app;