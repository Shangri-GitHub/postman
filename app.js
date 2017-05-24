var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var request = require('request');
var mysql = require('mysql');


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();






// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
// app.use('/users', users);
app.post('/postman', function (req, res) {
    // console.log(req.body.url);
    // console.log(req.body.postData);
    var options = {
        method: 'POST',
        uri: req.body.url,
        json: true,
        body: req.body.postData
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body)
        }
    })
});

app.post('/queryCompany', function (req, res) {
    // 数据库
    var connection = mysql.createConnection({
        host     : '192.168.0.102',
        user     : 'hanxing',
        password : '123456'
    });
    connection.connect();

    connection.query('SELECT * FROM mysqlTest.Company', function(err, rows, fields) {
        if (err) throw err;
        res.send(rows)
    });
    connection.end();


});


app.get('/getman', function (req, res) {
    console.log(req.query.url);
    request(req.query.url, function (error, response, body) {
        console.log(body); // Print the HTML for the Google homepage.

        res.send(body)
    });
});



// connection.query('SELECT * FROM mysqlTest.students', function(err, rows, fields) {
//     if (err) throw err;
//     console.log(rows);
//     // console.log(fields);
// });




// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
