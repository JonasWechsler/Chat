var express = require("express");
var app = express();
var port = 3700;

var databaseUrl = "chatbase";
var collections = ["messages"];
var db = require("mongojs").connect(databaseUrl, collections);

app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

app.get("/", function (req, res) {
	res.render("index");
});

app.use(express.static(__dirname + '/public'));
var io = require('socket.io').listen(app.listen(process.env.PORT || port));

var date = new Date();
var users = new Array();
var colors = new Array();
var messages = new Array();
var DEFAULT_COLOR = "#8A7777";

io.sockets.on('connection', function (socket) {
	if (colors.length < 5)
		makeColors(5 - colors.length);
	else while (colors > 5)
			colors.pop();

	console.log('A socket with sessionID ' + socket.store.id + ' connected!');

	socket.emit('colorlist', colors);

	socket.on('say', function (data) {
		data.time = date.getTime();
		if (users[socket.store.id])
			data.color = users[socket.store.id];
		else
			data.color = "#8A7777";
		messages.push(data);
		db.messages.save(data);
		io.sockets.emit('hear', data);
	});
	socket.on('colorset', function (data) {
		users[socket.store.id] = data;

		var hex = RGBtoHEX(data);
		position = colors.indexOf(hex);
		if (~position) colors.splice(position, 1);
		users[socket.store.id] = hex;

		if (colors.length < 5)
			makeColors(5 - colors.length);
		else while (colors > 5)
				colors.pop();
		socket.emit('colorlist', colors);
	});
});

console.log("Listening on port " + port);

function HSVtoRGB(h, s, v) {
	var r, g, b, i, f, p, q, t;
	if (h && s === undefined && v === undefined) {
		s = h.s, v = h.v, h = h.h;
	}
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
	case 0:
		r = v, g = t, b = p;
		break;
	case 1:
		r = q, g = v, b = p;
		break;
	case 2:
		r = p, g = v, b = t;
		break;
	case 3:
		r = p, g = q, b = v;
		break;
	case 4:
		r = t, g = p, b = v;
		break;
	case 5:
		r = v, g = p, b = q;
		break;
	}
	return {
		r: Math.floor(r * 255),
		g: Math.floor(g * 255),
		b: Math.floor(b * 255)
	};
}

function RGBtoHEX(r, g, b) {
	if (r && g === undefined && b === undefined) {
		if (r.g === undefined && r.g === undefined && (typeof r == 'string' || r instanceof String)) {
			r = r.substring(4, r.length);
			g = parseInt(r.substring(r.indexOf(',') + 2, r.lastIndexOf(',')), 10);
			b = parseInt(r.substring(r.lastIndexOf(',') + 2, r.length), 10);
			newr = parseInt(r.substring(0, r.indexOf(',')), 10);
			return "#" + ((1 << 24) + (newr << 16) + (g << 8) + b).toString(16).slice(1);
		} else {
			g = r.g;
			b = r.b;
			r = r.r;
		}
	}
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

var gold = 0.618033988749895;
var h = Math.random();

function makeColors(count) {
	for (var i = 0; i < count; i++) {
		var rgb = HSVtoRGB(h, .9, .95);
		var hex = RGBtoHEX(rgb);
		colors.push(hex);
		h += gold;
		h %= 1;
	}
}
makeColors(4);