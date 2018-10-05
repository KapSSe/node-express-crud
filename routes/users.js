//NodeJS third-party modules
    const express = require('express');
    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');
    const passport = require('passport');
    const router = express.Router();
    const {UserSchema} = require('../models/User');

//Assign a model
    const User = mongoose.model('users',UserSchema);

//User Login Route
    router.get('/login', (req, res) => {
        res.render('users/login')
    });

//User Register Route
    router.get('/register', (req, res) => {
        res.render('users/register')
    });

//Login Form Post
    router.post('/login', (req, res, next) => {
        passport.authenticate('local', {
            successRedirect:'/ideas',
            failureRedirect:'/users/login',
            failureFlash: true,
        })(req,res,next);
    })

//Register Form Post
    router.post('/register', (req, res) => {
        const errors = [];
        if (req.body.password != req.body.password2) {
            errors.push({
                text: 'Passwords do not match'
            })
        }
        if (req.body.password.length < 4) {
            errors.push({
                text: 'Passwords must be at least 4 characters'
            })
        }
        if (errors.length) {
            res.render('users/register', {
                errors: errors,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                password2: req.body.password2,
            })
        } else {
            //Check if user with this email is exist
            User.findOne({
                    email: req.body.email
                })
                .then((user) => {
                    if (user) {
                        req.flash('error_msg', 'This email is already registered.');
                        res.redirect('/users/login');
                    } else {
                        //Creating new user from a model    
                        const newUser = new User({
                            name: req.body.name,
                            email: req.body.email,
                            password: req.body.password,
                        });

                        //Generating hash and save new user to database
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                newUser.save().then((newUser) => {
                                    req.flash('success_msg', 'You have been registered');
                                    res.redirect('/users/login')
                                }).catch((err) => {
                                    console.log(err);
                                    return;
                                });
                            });
                        });
                    }
                })

        }
    });

//Module exports
    module.exports = router;