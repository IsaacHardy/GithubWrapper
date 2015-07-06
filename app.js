var request = require('request');
var express = require('express');
var app = express();

var options = {
  url: 'https://api.github.com/users/twhitacre',
  headers: {
    'User-Agent': 'request'
  }
};

request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Print the google web page.
  }
});


app.listen(process.env.PORT || 5000);
