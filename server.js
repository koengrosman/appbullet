var express = require('express');
var app = express();
var bodyParser = require('body-parser'); 
var jade = require('jade');
var pg = require('pg');

var connectionString = "postgres://" + process.env.POSTGRES_USER + ":@localhost/bulletinboard";
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ // this makes the bodyparser function available to the express server
	extended: true
}));

app.get('/postmessage', function(request, response) {
	response.render('index.jade');
}); // test

app.post('/addtodatabase', function(request, response) {
	title = request.body.title;
	body = request.body.body;

	pg.connect(connectionString, function (err, client, done) {
		if(err) {
					throw err;
				}
	client.query("INSERT INTO messages(title, body) VALUES($1, $2)", [title, body], function (err) {
				if(err) {
					throw err;
				}
				done();
				pg.end(); 
			});
	});
	response.redirect("/postsoverview");   
});

app.get('/postsoverview', function(request, response) {
	pg.connect(connectionString, function (err, client, done) {
	client.query('select * from messages', function (err, result) {
	console.log(result.rows);
	x = result.rows;

	done();
	pg.end(); 
	response.render('postsoverview.jade', { // renders the index.jade file 
			datajson: x //this makes the data from the users.json available to the variable datajson in jade 
		});
	});
});
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});














