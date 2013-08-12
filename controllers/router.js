var userModel = require('../models/user'),
    songModel = require('../models/song'),
    RSS = require('rss'),
    fs = require('fs');

module.exports = function(app) {

    app.get('/', function(req, res) {
        if(req.session.user) {
            res.render('index', {user:req.session.user});
        } else {
            res.render('index');
        }
    });

    app.post('/login', function(req, res) {
        var username = req.param('username'),
            password = req.param('password');
        userModel.authenticate(username, password, function(err, o){
            if (!o){
                res.send(err, 400);
            } else {
                req.session.user = o;
                if (req.param('remember-me') == 'true'){
                    res.cookie('user', o.username, { maxAge: 900000 });
                    res.cookie('pass', o.password, { maxAge: 900000 });
                }
                res.redirect('/user/'+ username);
            }
        });
    });

    app.get('/user/:username', function(req,res) {
        userModel.findByUsername(req.param('username'), function(err, user) {
            if(err) res.send('Error', 400);
            else if(!user) {
                res.send('user not found', 404);
            } else {
                songModel.findAllByUser(user, function(e, songs) {
                    if(e) {
                        res.send(e, 400);
                    } else {
                        res.render('user/profile', {user:user, songs:songs});
                    }
                });

            }
        });
    });

    app.get('/user/:username/rss', function(req,res) {

        userModel.findByUsername(req.param('username'), function(err, user) {
            if(err) res.send('Error', 400);
            else if(!user) {
                res.send('user not found', 404);
            } else {
                songModel.findAllByUser(user, function(e, songs) {
                    if(e) {
                        res.send(e, 400);
                    } else {
                        res.render('user/mixins/songlist', {user:user, songs:songs});
                    }
                });
            }
        });

        /*userModel.findByUsername(req.param('username'), function(err, user) {
            if(err) res.send('Error', 400);
            else if(!user) {
                res.send('user not found', 404);
            } else {
                var feed = new RSS({
                    title:          user.username+'\'s Song Feed',
                    description:    'Song list for user',
                    link:           'http://localhost:3000',
                    image:          'http://localhost:3000/logo.png',
                    copyright:      'Copyright © 2013 Stemix',

                    author: {
                        name:       user.username,
                        email:      user.email,
                        link:       'http://localhost:3000/user/'+user.username
                    }
                });
                songModel.findAllByUser(user, function(e, songs) {
                    if(e) {
                        res.send(e, 400);
                    } else {
                        songs.forEach(function(song) {
                            feed.item({
                                title:  song.title,
                                url:    song.url
                            });
                        });
                        res.set('Content-Type', 'text/xml');
                        res.send(feed.xml());
                    }
                });
            }
        });*/
    });

    app.get('/user/:username/upload', function(req,res) {
        res.render('user/upload', {user:req.session.user});
    });

    app.post('/upload', function(req,res) {

        req.form.on('progress', function(bytesReceived, bytesExpected) {
            console.log(((bytesReceived / bytesExpected)*100) + "% uploaded");
        });

        req.form.on('end', function() {
            var filename = req.files.songFile.path.split('\\');
            filename = filename.pop();

            songModel.add({
                user: req.session.user,
                title: req.files.songFile.name,
                url: filename,
                length: 0
            }, function(e) {
                if(e) {
                    console.log(e);
                }
            });
//            res.redirect('/user/'+req.session.user+'/'+req.files.songFile.name);
            res.send('yay', 200);
        });
    });

    app.get('/user/:username/:songname', function(req,res) {
        userModel.findByUsername(req.params.username, function(err, user) {
            if(err) res.send(err);
            else {
                songModel.findSong(user, req.params.songname, function(e, doc) {
                    if(e) res.send(e);
                    else res.render('song',{song:doc});
                });
            }
        });
    });

    app.post('/signup', function(req, res) {
        userModel.add({
            user 	: req.param('username'),
            email 	: req.param('email'),
            pass	: req.param('password')
        }, function(e){
            if (e){
                res.send(e, 400);
            }	else{
//                res.send('ok', 200);
                res.redirect('/user/'+req.param('username'));
            }
        });
    });

    app.get('/user', function(req,res) {
        var UserModel = userModel.getModel();
        UserModel.find({}, function(err, docs) {
            res.render('user/list', { users:docs });
        });
    });

    app.get('/deleteusers', function(req,res) {
        userModel.deleteAllUsers();
        res.send('all users deleted');
    })

};