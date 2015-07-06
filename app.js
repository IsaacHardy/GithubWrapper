var request = require('request');

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
