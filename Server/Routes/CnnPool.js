var mysql = require('mysql');
var Validator = require('./Validator.js');


var CnnPool = function () {
    var poolCfg = require('./connection.json');
    var argvDbIdx;

    argvDbIdx = process.argv.indexOf('-db') + 1;
    if (argvDbIdx > 0 && argvDbIdx < process.argv.length) {
        poolCfg.database = process.argv[argvDbIdx];
    }

    this.pool = mysql.createPool(poolCfg)
};

CnnPool.PoolSize = 4;

CnnPool.prototype.getConnection = function (cb) {
    this.pool.getConnection(cb);
};


CnnPool.router = function (req, res, next) {
    console.log("Connecting to Database");
    CnnPool.singleton.getConnection(function (err, cnn) {
        if (err) {
            res.status(500).json('Failed to connect to Database: ' + err);
        }
        else {
            console.log('Connected to Database');
            cnn.chkQry = function (qry, prms, cb) {
                //Run Query checking for errors.
                this.query(qry, prms, function (err, rsp, fields) {
                    if (err) {
                        res.status(500).json('Failed Query ' + qry);
                    }
                    cb(err, rsp, fields);
                });
            };
            req.cnn = cnn;
            next();
        };
    });
};

//Cnn Pool Object needed for the app
CnnPool.singleton = new CnnPool();

module.exports = CnnPool;