const express = require('express');
const User = require('../models/User');
const router = express.Router();


router.get('/', (req, res) => {
    res.send('Hello from auth route');
});


module.exports = router