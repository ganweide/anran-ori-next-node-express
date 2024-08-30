var loginrouter = require('express').Router();
const { loginVerify } = require('../../controller/auth');

loginrouter.post("/authenticate", async (req, res) => {
    try {
        const login = await loginVerify(req.body);
        res.status(200).json(login);
    } catch (e) {
        res.sendStatus(500);
    }
});
module.exports = loginrouter;