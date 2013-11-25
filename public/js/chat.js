function set_size(newsize) {
	if (newsize.indexOf('px') == -1)
		newsize = newsize + "px";
	size = newsize;
	$(".textbox").css('font-size', size);
	$('.sizeslider').prop({
		'min': 10,
		'max': 64
	});
}

var position = {
	x: 0,
	y: 0,
	z: 1
};

function chat_init() {
	var messages = [];
	var url = 'http://sweet-talk.herokuapp.com/';
	var socket = io.connect();
	var input = $(".textbox");
	var lastX = null;
	var lastY = null;
	var moved = true;
	var MIN_SIZE = 10;
	var date = new Date();
	var size = parseInt(input.css('font-size'));
	const OVERSAMPLE_RATIO = 2;
	const LOOK_STEP = 100;

	var width;
	var height;

	var c = document.getElementById('text');
	var ctx = c.getContext("2d");

	$("#text").mouseup(function (event) {
		input.css('position', 'absolute');
		input.css('left', '' + (event.pageX - (input.outerWidth() - input.innerWidth())) + "px");
		input.css('top', '' + (event.pageY - input.outerHeight() * .5) + "px");
		moved = true;
		input.focus();
	});
	$('body').keypress(function () {
		input.focus();
	});

	$('body').bind('mousewheel', function (e) {
		const STEP = .1;
		if (e.originalEvent.wheelDelta / 120 > 0) {
			position.z += STEP;
		} else {
			position.z -= STEP;
		}
		if (position.z < STEP)
			position.z = STEP;
		redraw();
		return false;
	});

	$('body').keyup(function (e) {
		if (e.keyCode == 13) {
			send_text();
		}
	});

	function send_text() {
		var text = $(".textbox").val();
		input.val('');
		if (text == '') return;
		var offset = input.offset();
		lastX = offset.left;
		lastY = offset.top;

		var fpos = reverse_translate_point(lastX + (input.outerWidth(true) - input.innerWidth()), lastY);
		var fsize = parseInt(input.css('font-size'), 10) * position.z;
		var font = input.css('font-family');

		submit_text(fpos.x, fpos.y, text, fsize, font);
		input.css('left', '' + (offset.left) + "px");
		console.log("a", (offset.top + parseInt(input.css('font-size'))) - $('#text').height());
		if ($('#text').outerHeight() - (offset.top + parseInt(input.css('font-size'))) > fsize) {
			input.css('top', '' + (offset.top + parseInt(input.css('font-size'))) + "px");
		} else {
			position.y += parseInt(input.css('font-size'));
			redraw();
		}
		return false;
	}

	function draw_text(x, y, text, size, color, font) {
		console.log(x + " " + y + " " + text + " " + size + " " + color + " " + font);
		ctx.fillStyle = color;
		ctx.font = size + " " + font;
		ctx.fillText(text, x, y + parseInt(size, 10));
	}

	function redraw() {
		var canvas = $('#text');
		ctx.clearRect(0, 0, c.width, c.height);
		for (var i = 0; i < messages.length; i++) {
			var pos = translate_point(messages[i].x, messages[i].y);
			var size = messages[i].size;
			size = parseInt(size, 10);
			size /= position.z;
			size = size + "px";
			draw_text(pos.x, pos.y, messages[i].text, size, messages[i].color, messages[i].font);
		}
	}

	$(".dup").click(function () {
		pan("up")
	});
	$(".ddown").click(function () {
		pan("down")
	});
	$(".dleft").click(function () {
		pan("left")
	});
	$(".dright").click(function () {
		pan("right")
	});
	$(document).keydown(function (e) {
		switch (e.keyCode) {

		case 37:
			pan("left");
			break;
			/*left*/
		case 38:
			pan("up");
			break;
			/*up*/
		case 39:
			pan("right");
			break;

			/*right*/
		case 40:
			pan("down");
			break;

			/*down*/
		
		}
	});

	function pan(direction) {
		switch (direction) {
		case "up":
			console.log("up");
			position.y -= LOOK_STEP;
			break;
		case "down":
			position.y += LOOK_STEP;
			break;
		case "left":
			position.x -= LOOK_STEP;
			break;
		case "right":
			position.x += LOOK_STEP;
			break;
		}
		redraw();
	}
	/**translates from universal coordinates into display coordinates*/
	function translate_point(x0, y0) {
		console.log("untranslated", x0, y0);
		var canvas = $('#text');
		var width = canvas.width() * OVERSAMPLE_RATIO;
		var height = canvas.height() * OVERSAMPLE_RATIO;
		var center = {
			x: width / 2,
			y: height / 2
		}

		x0 -= position.x;
		y0 -= position.y;

		x0 /= position.z;
		y0 /= position.z;

		x0 += center.x / 2;
		y0 += center.y / 2;

		return {
			x: x0,
			y: y0
		};
	}
	/**translates from display coordinates into universal coordinates*/
	function reverse_translate_point(x0, y0) {
		var canvas = $('#text');
		var width = canvas.width() * OVERSAMPLE_RATIO;
		var height = canvas.height() * OVERSAMPLE_RATIO;
		var center = {
			x: width / 2,
			y: height / 2
		}

		x0 -= center.x / 2;
		y0 -= center.y / 2;

		x0 *= position.z;
		y0 *= position.z;

		x0 += position.x;
		y0 += position.y;

		return {
			x: x0,
			y: y0
		};
	}
	socket.on('hear', function (data) {
		data.time = date.getTime();
		messages.push(data);
		redraw();
	});

	socket.on('colorlist', function (data) {
		var colorpicker = $(".colorpicker");
		var html = new Array();
		for (var i = 0; i < data.length; i++) {
			var a = $("<div>");
			a.css('background-color', data[i]);
			a.addClass('colorradio');
			html.push(a);
		}

		colorpicker.empty();
		colorpicker.prepend(html);

		color_init();
	});

	function submit_text(X, Y, Text, Size, Font) {
		socket.emit('say', {
			time: 0,
			x: X,
			y: Y,
			text: Text,
			size: Size,
			font: Font
		});
	}

	function setColor(newcolor) {
		socket.emit('colorset', newcolor);
		color = newcolor;
		$(".textbox").css('color', newcolor);
	}

	function color_init() {
		$('.colorradio').click(function () {
			console.log($(this).css('background-color'));
			setColor($(this).css('background-color'));
		});
	}

	function update_canvas_size() {
		var canvas = $('#text');
		width = parseInt(canvas.width() * OVERSAMPLE_RATIO, 10);
		canvas.attr('width', width);
		height = parseInt(canvas.height() * OVERSAMPLE_RATIO, 10);
		canvas.attr('height', height);
		ctx.scale(OVERSAMPLE_RATIO, OVERSAMPLE_RATIO);
		redraw();
	}
	window.onresize = function () {
		update_canvas_size();
	}
	update_canvas_size();
}