const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const config = require('./config/database');

mongoose.connect(config.database);
let db = mongoose.connection;

//Check connection
db.once('open',function(){
    console.log('Connected to MongoDB');
})

//Check for DB errors
db.on('error', function(err){
    console.log(err);
});


//INIT APP
const app = express();

//Bring in Models
let Page = require('./models/page');

//LOAD VIEW ENGINE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//BODY PARSER MIDDELWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 60000}
  }))

// Express Message Middleware
app.use(flash());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//Express validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req,res,next){
    res.locals.user = req.user || null;
    next();
})


//Home Route
app.get('/', function(req, res){
    res.render('home');
})

// Route Files
let pages = require('./routes/pages');
app.use('/pages', pages);

let users = require('./routes/users');
app.use('/users', users);

app.get('*', function(req, res){
    res.render('fourohfour');
});

app.listen(3000, function(){
    console.log('Server started on port 3000...');
})