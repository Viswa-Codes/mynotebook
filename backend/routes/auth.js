const express = require('express');
const User = require('../models/User');
const router = express.Router();

//To use req.body, we need to use express.json() middleware in index.js
router.post('/', (req, res) => {
    console.log(req.body);
    const user = User(req.body);
    user.save();
    res.send(req.body);
});

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required


module.exports = router