//NodeJS third-party modules
    const express = require('express');
    const mongoose = require('mongoose');
    const router = express.Router();
    const {IdeaSchema} = require('../models/Idea');
    const {ensureAuthenticated} = require('../helpers/auth');


//Load Idea Model
    const Idea = mongoose.model('ideas', IdeaSchema);

//Idea index route
    router.get('/',ensureAuthenticated, (req,res) => {
        Idea.find({user: req.user.id})
            .sort({date: 'desc'})
            .then((ideas) => {
                res.render('ideas/index',{
                    ideas:ideas
                });
            });
    });

//Add route
    router.get('/add', ensureAuthenticated, (req,res)=> {
        res.render('ideas/add')
    });

//Edit route
    router.get('/edit/:id', ensureAuthenticated, (req,res) => {
        Idea.findOne({
            _id: req.params.id
        }).then((idea) => {
            if(idea.user != req.user.id){
                req.flash('error_msg', 'Not Authorised');
                res.redirect('/ideas');
            }else{
                res.render('ideas/edit', {
                    idea:idea
                })
            }
        })
    });

//Process Add form
    router.post('/', ensureAuthenticated, (req,res) => {
        let errors = [];
        if(!req.body.title) {
            errors.push({
                text: 'Please add a title'
            });
        }
        if(!req.body.details) {
            errors.push({
                text: 'Please add some details'
            });
        }
        if (errors.length > 0){
            res.render('ideas/add',{
                errors: errors,
                title: req.body.title,
                details: req.body.details
            });
        }else{
            const newUser = {
                title: req.body.title,
                details: req.body.details,
                user: req.user.id
            }
            new Idea(newUser)
                .save()
                .then(() => {
                    req.flash('success_msg', 'Idea was added');
                    res.redirect('./');
                })
        }
    });

//Process Edit form
    router.put('/:id', ensureAuthenticated, (req,res) => {
        Idea.findOne({
            _id:req.params.id
        }).then((idea) => {
            //Update values
            idea.title = req.body.title,
            idea.details = req.body.details
            //Save 
            idea.save()
                .then(() => {
                    req.flash('success_msg', 'Idea was updated');
                    res.redirect('./');
            });
        })
    });

//Process Delete form
    router.delete('/:id', ensureAuthenticated, (req, res) => {
        Idea.findByIdAndDelete(req.params.id)
            .then(() => {
                req.flash('success_msg', 'Idea was removed');
                res.redirect('./');
            })
    });

//Module exports
    module.exports = router;