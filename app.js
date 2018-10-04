//NodeJS modules
    const express = require('express');
    const exphbs = require('express-handlebars');
    const mongoose = require('mongoose');
    const bodyParser = require('body-parser');
    const methodOverride = require('method-override');
    const flash = require('connect-flash');
    const session = require('express-session');

//Create Express server
    const app = express();

//Load routes
    const ideas = require('./routes/ideas');
    const users = require('./routes/users');

//Connect to MongoDB
    mongoose.connect('mongodb://localhost/vidjot-dev', {
        useNewUrlParser: true
    }).then(() => {
        console.log('Mongodb connected...');
    }).catch(() => {
        console.log('Can\'t connect to database...');
    })

//Middleware config:
   
    //-Handlebars
        app.engine('handlebars',exphbs({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');

    //-Body-parser
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json({ type: 'application/json' }));

    //-Method-override
        app.use(methodOverride('_method'));

    //-Espress-session
        app.use(session({
            secret: 'secret',
            resave: true,
            saveUninitialized: true,
        }));

    //-Node Flash
        app.use(flash());
    
    //-Global middleware variables
        app.use((req,res,next) => {
            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg');
            res.locals.error = req.flash('error');
            next();
        })

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

//Use routes
    app.use('/ideas', ideas);
    app.use('/users', users);
    
const port = 5000;

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
});