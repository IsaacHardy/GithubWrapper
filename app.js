// require necessary modules
var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    request = require('request');
//  , db = mongoskin.db((process.env.MONGOLAB_URI || 'localhost:27017/test'), {safe:true});

// get an instance of express
var app = express();

// Base Github API URl
var githubURL = 'https://api.github.com/';
var githubHeaders = {
  'User-Agent': 'request'
};

if (process.env.GITHUB_TOKEN !== undefined) {
  githubHeaders["Authorization"] = "token " + process.env.GITHUB_TOKEN;
}

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
     res.send(200);
    }
    else {
      next();
    }
};

// configure it
app.configure(function(){
  app.use(allowCrossDomain);
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  // app.use(express.static(path.join(__dirname, 'public')));
});

// dev config
app.configure('development', function(){
  app.use(express.errorHandler());
});


// index route
app.get('/', routes.index);


// GET User Info
// `/user/:username`
app.get('/user/:username', function(req, res, next) {
  var url = githubURL + 'users/' + req.params.username;
  request({ url: url, headers: githubHeaders },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.setHeader('Content-Type', 'application/json');
        res.send(body);
      }
    }
  );
});

// GET Repos for Org
// `/repos/:username`
app.get('/repos/:username', function (req, res, next) {
  var url = githubURL + 'repos/tiy-atl-js-q2-2015/Assignments/issues?state=closed&labels=Complete&assignee=' + req.params.username;
  request({ url: url, headers: githubHeaders },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.setHeader('Content-Type', 'application/json');
        res.send(body);
      }
    }
  );
});
// end API endpoints

// GET Org Members
app.get('/orgs/:org/members', function (req, res, next) {
  var url = githubURL + 'orgs/' + req.params.org + '/members/';
  request({ url: url, headers: githubHeaders },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.setHeader('Content-Type', 'application/json');
        res.send(body);
      }
    }
  );
});



// run the server
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
