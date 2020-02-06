const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const mongoose = require("mongoose");
const path = require('path');
const db = require('./config/keys.js').mongoURI;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const routes = require("./routes.js");



app.use(express.static(path.join(__dirname, 'public')));




app.use(routes);

mongoose.connect(process.env.MONGODB_URI || db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Error connecting to MongoDB ' ,err));

app.listen(PORT, () =>
    console.log(`The server listening on http://localhost:${PORT}`)
    );