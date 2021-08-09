const { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } = require('constants');
var crypto = require('crypto');
var duration = 3600000;
var cookieName = 'Auth';


var Session = function (user, res) {
    var token = crypto.randomBytes(16).toString('hex');

    res.cookie(cookieName, token, { maxAge: duration, httpOnly: true });
    Session.ssnsByCookie[token] = this;
    Session.ssnsByPrs[user.id] = Session.ssnsByPrs[user.id] || [];
    Session.ssnsByPrs[user.id].push(this);
    Session.ssnsById.push(this);

    this.id = Session.ssnsById.length - 1;
    this.token = token;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.prsId = user.id;
    this.email = user.email;
    this.role = user.role;
    this.loginTime = this.lastUsed = new Date().getTime();
};

Session.ssnsByCookie = {};
Session.ssnsById = [];
Session.ssnsByPrs = {};

Session.prototype.isAdmin = function () {
    return this.role === 1;
};

Session.prototype.logout = function () {
    delete Session.ssnsById[this.id];
    delete Session.ssnsByCookie[this.token];
    delete Session.ssnsByPrs[this.prsId];
};

Session.getAllIds = () => Object.keys(Session.ssnsById);
Session.findById = id => Session.ssnsById[id];
Session.findByPrs = id => Session.ssnsByPrs[id];
Session.clearAll = () => { Session.ssnsByPrs = {}; Session.ssnsById = []; }

Session.router = function (req, res, next) {
    var cookie = req.cookies[cookieName];
    var session = cookie && Session.ssnsByCookie[cookie];

    if (session) {
        if (session.lastUsed < new Date().getTime() - duration)
            session.logout();
        else{
            console.log("Setting Session");
            req.session = session;
        }    
    }
    next();
};

module.exports = Session;