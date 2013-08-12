var express = require('express')
  , mongoose = require('mongoose')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({
    keepExtensions: true,
    uploadDir: __dirname+'/public/uploads',
    limit: '10mb',
    defer: true
}));
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*app.get('/', controllers.index);
app.get('/user', userModel.list);
app.get('/user/new', userModel.new);
app.post('/user', userModel.createUser);
app.param('username', userModel.find);
app.get('/user/:username', userModel.show);*/

require('./controllers/router')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
