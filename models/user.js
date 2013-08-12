var mongoose = require('mongoose')
    , moment = require('moment')
    , crypto = require('crypto');

var db = mongoose.connect('mongodb://localhost/stemix');

var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

UserModel = mongoose.model('User', UserSchema);

exports.authenticate = function(username, password, callback) {
    UserModel.findOne({username:username}, function (err, res) {
        if (err != null) {
            console.log(err);
        }

        if (res == null) {
            callback('userModel-not-found');
        } else {
            validatePassword(password, res.password, function (err, o) {
                if (o) {
                    callback(null, res);
                } else {
                    callback('invalid-password');
                }
            });
        }
    });
}

exports.add = function(data, callback) {
    var user = new UserModel();

    UserModel.findOne({username:data.user}, function (e, o) {
        if (o) {
            callback('username-taken');
        } else {
            UserModel.findOne({email:data.email}, function (e, o) {
                if (o) {
                    callback('email-taken');
                } else {
                    saltAndHash(data.pass, function (hash) {
                        user.password = hash;
                        user.email = data.email;
                        user.username = data.user;

                        data.pass = hash;
                        // append date stamp when record was created //
                        data.date = moment().format('MMMM Do YYYY, h:mm:ss a');
                        user.save(callback);
                    });
                }
            });
        }
    });
}

exports.findAll = function() {
    UserModel.find({}, function(err, docs) {
        return docs;
    });
}

exports.findByUsername = function(username, callback) {
    UserModel.findOne({username:username}, function(err, docs) {
        if(err) callback(err);
        else callback(null, docs);
    });
}

exports.getModel = function() {
    return UserModel;
}

exports.deleteAllUsers = function() {
    UserModel.remove({}, function(err) {
        console.log('all user deleted');
    });
}

var generateSalt = function () {
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
    var salt = '';
    for (var i = 0; i < 10; i++) {
        var p = Math.floor(Math.random() * set.length);
        salt += set[p];
    }
    return salt;
};

var md5 = function (str) {
    return crypto.createHash('md5').update(str).digest('hex');
};

var saltAndHash = function (pass, callback) {
    var salt = generateSalt();
    callback(salt + md5(pass + salt));
};

var validatePassword = function (plainPass, hashedPass, callback) {
    var salt = hashedPass.substr(0, 10);
    var validHash = salt + md5(plainPass + salt);
    callback(null, hashedPass === validHash);
};