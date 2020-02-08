const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const mongoose = require("mongoose");
const path = require('path');
const db = require('./config/keys.js').mongoURI;

const routes = require("./payments.js");
const authRoutes = require("./auth.js");
const cmsRoutes = require("./cms.js");

//static front-end folder
app.use(express.static(path.join(__dirname, 'public')));

const session = require('express-session');
const passport = require('passport');

//bodyParser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//use this route without passport
app.use(cmsRoutes);


//passport config
require('./config/passport.js')(passport);



//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use(routes);
app.use(authRoutes);


//mongoDB connection
mongoose.connect(process.env.MONGODB_URI || db, {
    useUnifiedTopology: true,
    useNewUrlParser: true
    })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Error connecting to MongoDB ' , err));

app.listen(PORT, () =>
    console.log(`The server listening on http://localhost:${PORT}`)
);