var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'bdd'
});

var app = express();

app.use(session({
    secret : 'u0ç8_`cJ,?',
    resave : true,
    saveUninitialized : true
}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
    if (request.session.loggedin == true) {
        response.sendFile(path.join(__dirname + '/index.html'));
        //handle_articles(response);
    } else {
        response.sendFile(path.join(__dirname + '/login.html'));
    }
});

app.get('/post-article', function(request, response) {
    response.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/auth', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (error) {
                console.log('Something gone wrong (login)');
            }
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password !');
        response.end();
    }
});

app.post('/register', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    var email = request.body.email;
    if (username && password && email) {
        connection.query('SELECT * FROM users WHERE username = ?', [username], function (error, results, fields) {
            if (results.length > 0) {
                response.send('Username already taken');
            } else {
                connection.query('INSERT INTO users SET ?', {username: username, password: password, email: email}, function (error, result, fields) {
                    if (error) {
                        console.log('Something gone wrong (register)');
                        response.redirect('/');
                    }
                    console.log('Query answered');
                });
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/');
            }
        });
    } else {
        response.send('Please enter every field');
        response.end();
    }
});

app.get('/logout', function(req, res){
    req.session.destroy(function(){
       console.log("user logged out.")
    });
    res.redirect('/');
});

function handle_articles(response) {
    connection.query('SELECT * FROM articles', function(err, rows, fields) {
        //response.writeHead(200, {'Content-type': 'application/json'});

        rows.forEach(function(row) {
            var myData = {
                contenu: row.contenu
            };
            response.write(JSON.stringify(myData));
        });
        return response.send();
    });
}


app.get('/home', function(request, response) {
    if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.username + '!');
    } else {
        reponses.send('Please login to view this page!');
    }
    response.end();
});

app.listen(3000,()=>{
    console.log("Server started on port 3000");
});