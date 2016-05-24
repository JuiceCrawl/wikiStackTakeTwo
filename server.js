var http = require('http');
var server = http.createServer();
var models = require('./models'); // ./models/index.js is assumed
var Promise = require('bluebird');

server.on('request', require('./app'));

var force = false;

//Syncronize tables (in any order, async). Then start server.
Promise.all([
    models.User.sync({force: force}),
    models.Page.sync({force: force})
  ])
  .then(function(){
    server.listen(3000, function(){
      console.log('listening on port 3000');
    });
  })
  .catch(console.error);