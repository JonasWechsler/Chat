var express = require("express");
require("./color");
var app = express();
var port = 3700;

app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

app.get("/", function (req, res) {
    res.render("index");
});

app.use(express.static(__dirname + '/public'));
var io = require('socket.io').listen(app.listen(process.env.PORT || port));

var colors = new Array();

io.sockets.on('connection', function (socket) {
	console.log('A socket with sessionID ' + socket.store.id 
        + ' connected!');
	
    socket.on('say', function (data) {
        io.sockets.emit('say', data);
    });
});


console.log("Listening on port " + port);