//NodeJS modules
    const express = require('express');
    const router = express.Router();

//User Login Route
    router.get('/login', (req,res) => {
        res.send('Login')
    });

//User Register Route
    router.get('/register', (req,res) => {
        res.send('Register')
    });
//Module exports
    module.exports = router;