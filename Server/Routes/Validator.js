const { mapValues } = require("async");

var Validator = function (req, res) {
    this.errors = [];
    this.session = req.session;
    this.res = res;
}

// List all possible errors and corresponding response strings
Validator.Tags = {
    noPerms: "noPermission",
    missingField: "missingField",
    badInput: "badInput",
    notFound: "notFound",
    noTerms: "noTerms",
    noOldPwd: "noOldPwd"
}

Validator.prototype.check = function (test, err, cb) {
    if (!test) {
        if (Array.isArray(err))
            this.errors.push({ tag: err[0], params: err.slice(1) });
        else
            this.errors.push({ tag: err[0], params: null });
    }
    if (this.errors.length) {
        if (this.res) {
            if (this.errors[0].tag === Validator.Tags.noPerms)
                this.res.status(403).end();
            else if (this.errors[0].tag === Validator.Tags.notFound)
                this.res.status(404).end();
            else
                this.res.status(400).json(this.errors);
            this.res = null;
        }
        if (cb)
            cb(this)
    }
    return !this.errors.length;
}

Validator.prototype.chain = function (test, err) {
    if (!test) {
        if (Array.isArray(err))
            this.errors.push({ tag: err[0], params: err.slice(1) });
        else
            this.errors.push({ tag: err[0], params: null })
    }
    return this;
}

Validator.prototype.checkAdmin = function (cb) {
    return this.check(this.session && this.session.isAdmin(),
        Validator.Tags.noPermission, cb);
};

// Validate that AU is the specified person or is an admin
Validator.prototype.checkPrsOK = function (prsId, cb) {
    return this.check(this.session &&
        (this.session.isAdmin() || this.session.prsId == prsId),
        Validator.Tags.noPermission, cb);
};
// Verify that each field[i] (a field name) of body, if present, is a string
// and at most lengths[i] long.  Post badValue for any exceptions.  Return 
// this for chaining.
Validator.prototype.checkFieldLengths = function (body, fields, lengths) {
    var val;

    for (var i = 0; i < fields.length; i++) {
        val = body[fields[i]];
        this.chain(!val || typeof val === 'string'
            && val.length <= lengths[i], [Validator.Tags.badValue, fields[i]])
    }

    return this;
}

Validator.prototype.hasOnlyFields = function (obj, fieldList) {
    Object.keys(obj).forEach(prop => {
        this.chain(fieldList.indexOf(prop) >= 0,
            [Validator.Tags.forbiddenField, prop]);
    });

    return this;
};

// Check presence of truthy property in |obj| for all fields in fieldList
Validator.prototype.hasFields = function (obj, fieldList, cb) {

    fieldList.forEach((name) => {
        this.chain(obj.hasOwnProperty(name) && obj[name] !== "" && obj[name]
            !== null && obj[name] !== undefined,
            [Validator.Tags.missingField, name]);
    });

    return this.check(true, null, cb);
};