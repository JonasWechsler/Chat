var express = require("express");
var app = express();
var port = 3700;

app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

app.get("/", function (req, res) {
    res.render("index");
});

app.use(express.static(__dirname + '/public'));
var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
	console.log(socket);
    socket.on('say', function (data) {
        io.sockets.emit('say', data);
    });
});

console.log("Listening on port " + port);