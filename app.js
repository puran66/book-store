require('dotenv').config();
const express = require("express");
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const { userRoute, bookStoreRoute } = require('./routes');
const dbConnect = require('./db/dbConnect');
const userAuth = require('./middleware/auth');
const session = require('express-session')

// body parser //

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())


// express session //
app.use(session({secret:process.env.SESSION}))
// Set up static directory for serving images//
app.use(express.static('public'));

// view engine set //

app.set('view engine', 'ejs');

// db connect //

dbConnect();

// routes //

app.use('/', bookStoreRoute)
app.use('/v1', userRoute)

// create server  //

http.createServer(app).listen(process.env.PORT, () => {
  console.log("server started success");
})