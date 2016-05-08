var express = require('express');

//do we need this line if we create a server on server.js?
var app = express();

var morgan = require('morgan');
var bodyParser = require('body-parser');
var swig = require('swig');

module.exports = app;

//swig setup
app.set('views', __dirname, + '/views');
app.set('view engine', 'html');
app.engine('html', swig.renderFile);
swig.setDefaults({ cache: false });

//middleware
app.use(morgan('dev'));
app.use(express.static(__dirname, + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routes
app.use('/wiki', require('./routes/wiki'));
app.use('/users', require('./routes/users'));

//home page
app.get('/', function (req, res) {
   res.render('index');
});

//default error - how does this back track on routes with errors? Does the order matter?
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.message);
});