var mongoose = require('mongoose')
    , moment = require('moment')
    , user = require('./user');
//var db = mongoose.connect('mongodb://localhost/stemix');

var User = user.getModel();

var SongSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: String,
    url: String,
    length: String
});

SongModel = mongoose.model('Song', SongSchema);

exports.add = function(data, callback) {
    var song = SongModel();
    song.user = data.user._id;
    song.title = data.title;
    song.url = data.url;
    song.length = data.length;
    song.save(callback);
}

exports.findAllByUser = function(user, callback) {
    var id = null;
    SongModel.find({user: user}, function(err, docs) {
        if(err) callback(err);
        else callback(null, docs);
    });
}

exports.findSong = function(user, title, callback) {
    SongModel.findOne({title:title, user:user}, function(err, docs) {
        if(err) callback(err);
        else callback(null, docs);
    })
}

exports.getModel = function() {
    return SongModel;
}