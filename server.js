var express = require('express');
var app = express();
const request = require('request');
const router = express.Router()
const bodyParser = require('body-parser');

// Import in the sql libraries
const { sql, poolPromise } = require('./DB/dbPool')

//const routes = require( "./routes" );

// Set up the server
// process.env.PORT is related to deploying on AWS
var server = app.listen(process.env.PORT || 5000, listen);
module.exports = server;
path = require('path');

//app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(express.static('img'));

// Inject your routes in here

app.get('/', async (req, res) => {
   try {
      res.render('public/index')
   }
   catch (err) {
      res.status(500);
      res.send(err.message);
   }
})

// End routes

// Set the folder for public items
publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir))
app.set('views', __dirname);
app.use(express.urlencoded({ extended: true }))

// This call back just tells us that the server has started
function listen() {
   var host = server.address().address;
   var port = server.address().port;
   console.log('Listening at http://' + host + ':' + port);
}
