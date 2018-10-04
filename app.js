//NodeJS modules
    const express = require('express');
    const exphbs = require('express-handlebars');
    const mongoose = require('mongoose');
    const bodyParser = require('body-parser');
    const methodOverride = require('method-override');

//Create Express server
    const app = express();

//Connect to MongoDB
    mongoose.connect('mongodb://localhost/vidjot-dev', {
        useNewUrlParser: true
    }).then(() => {
        console.log('Mongodb connected...')
    }).catch(() => {
        console.log('Can\'t connect to database...')
    })

//Load Idea Model
    require('./models/Idea');
    const Idea = mongoose.model('ideas');

//Middleware config:
    //-Handlebars
        app.engine('handlebars',exphbs({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');

    //-Body-parser
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json({ type: 'application/json' }))

    //-Method-override
        app.use(methodOverride('_method'))

//Index route
    app.get('/', (req,res) => {
        const title = 'Welcome'
        res.render('index',{
            title
        });
    })

//About route
    app.get('/about', (req,res) => {
        res.render('about');
    })

//Idea index route
    app.get('/ideas', (req,res) => {
        Idea.find({})
            .sort({date: 'desc'})
            .then((ideas) => {
                res.render('ideas/index',{
                    ideas:ideas
                });
            });
    })

//Add route
    app.get('/ideas/add', (req,res)=> {
        res.render('ideas/add')
    })

//Edit route
    app.get('/ideas/edit/:id', (req,res) => {
        Idea.findOne({
            _id: req.params.id
        }).then((idea) => {
            res.render('ideas/edit', {
                idea:idea
            })
        })
    })

//Process Add form
    app.post('/ideas', (req,res) => {
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
                details: req.body.details
            }
            new Idea(newUser)
                .save()
                .then(() => {
                    res.redirect('/ideas')
                })
        }
    });

//Process Edit form
    app.put('/ideas/:id', (req,res) => {
        Idea.findOne({
            _id:req.params.id
        }).then((idea) => {
            //Update values
            idea.title = req.body.title,
            idea.details = req.body.details
            //Save 
            idea.save()
                .then(() => {
                    res.redirect('/ideas')
            });
        })
    })

//Process Edit form
    app.delete('/ideas/:id', (req, res) => {
        Idea.findByIdAndDelete(req.params.id)
            .then(() => {
                res.redirect('/ideas')
            })
    })

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
});