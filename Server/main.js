var express = require('express');
var http = require('http');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var async = require('async');
const { prototype } = require('events');

let server;


var configApp = (port, corsDomain, testFlag) => {
    var app = express();
 
    // Manage CORS POS.
    // change this back later
    app.use(function (req, res, next) {
       console.log("Handling " + req.path + '/' + req.method);
       res.header("Access-Control-Allow-Origin", `http://localhost:${3001}`);
       res.header("Access-Control-Allow-Credentials", true);
       res.header("Access-Control-Allow-Headers", "Content-Type");
       res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
       res.header("Access-Control-Expose-Headers", "Content-Type, Location");
       next();
    });
 
    // No further processing needed for options calls.
    app.options("/*", function (req, res) {
       res.status(200).end();
    });
 
    // Static path to index.html and all clientside js
    app.use(express.static(path.join(__dirname, 'public')));
 
    // Parse request body using JSON; attach to req as req.body
    app.use(bodyParser.json());
 
    // No messing w/db ids
    app.use(function (req, res, next) {
       delete req.body.id;
       next();
    });
 
    // Attach cookies to req as req.cookies.<cookieName>
    app.use(cookieParser());
 
    // Find relevant Session if any, and attach as req.session
    app.use(Session.router);
 
    // Check general login.  If OK, add Validator to |req| and continue processing,
    // otherwise respond immediately with 401 and noLogin error tag.
    app.use(function (req, res, next) {
       console.log("Checking login for " + req.path);
       if (req.session ||
          req.method === 'POST' && (req.path === '/Prss' || req.path === '/Ssns')) {
          req.validator = new Validator(req, res);
          next();
       } else{
          console.log(`session: ${req.session}; method: ${req.method}; path: ${req.path}`);
          res.status(401).end();
       }
    });
 
    // Add DB connection, with smart chkQry method, to |req|
    app.use(CnnPool.router);
 
    // Load all subroutes
    
 
    if (testFlag)
       addDebugRoutes(app);
 
    return app;
 }