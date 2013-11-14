function set_size(newsize) {
	if (newsize.indexOf('px') == -1)
		newsize = newsize + "px";
	size = newsize;
	$("#input").css('font-size', size);
	$('#sizeslider').prop({
		'min': 10,
		'max': 64
	});
}

	var position = {
		x: 0,
		y: 0,
		z: 1
	}

function chat_init() {
	var messages = [];
	var url = 'http://sweet-talk.herokuapp.com/';
	var socket = io.connect('localhost');
	var input = $("#input");
	var lastX = null;
	var lastY = null;
	var moved = true;
	var MIN_SIZE = 10;
	var RESIZEABLE = true;
	var date = new Date();
	var size = parseInt(input.css('font-size'));
	var OVERSAMPLE_RATIO = 2;

	var c = document.getElementById("text");
	var ctx = c.getContext("2d");

<<<<<<< HEAD
=======
	var position = {
		x:0,
		y:0,
		z:0
	}
	
	var width;
	var height;
	
	var c=document.getElementById("text");
	var ctx=c.getContext("2d");
	
>>>>>>> f66dd90b23bc303ad611236191141cc0734c64b6
	$("#text").mousedown(function (event) {
		input.css('position', 'absolute');
		input.css('left', '' + (event.pageX - (input.outerWidth() - input.innerWidth())) + "px");
		input.css('top', '' + (event.pageY - input.outerHeight() * .5) + "px");
		moved = true;
	});
	$('body').keypress(function () {
		input.focus();
	});

	/*if (RESIZEABLE) {
		$('body').bind('mousewheel', function (e) {
			if (e.originalEvent.wheelDelta / 120 > 0) {
				size += 2;
			} else {
				size -= 2;
			}
			if (size < MIN_SIZE)
				size = MIN_SIZE;
			input.css('font-size', size);
			return false;
		});
	}*/
	$('body').keyup(function (e) {
		if (e.keyCode == 13) {
			send_text();
		}
	});

	function send_text() {
		var text = $("#input").val();
		input.val('');
		if (text == '') return;
		var offset = input.offset();
		lastX = offset.left;
		lastY = offset.top;
		submit_text(lastX + (input.outerWidth(true) - input.innerWidth())-position.x,lastY -  position.y, text, input.css('font-size'));
		input.css('left', '' + (offset.left) + "px");
		input.css('top', '' + (offset.top + parseInt(input.css('font-size'))) + "px");
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
		var width = canvas.width() * OVERSAMPLE_RATIO;
		var height = canvas.height() * OVERSAMPLE_RATIO;
		var center = {
			x:width/2,
			y:height/2
		}
		ctx.clearRect(0, 0, c.width, c.height);
		for (var i = 0; i < messages.length; i++) {
			var x = messages[i].x;
			var y = messages[i].y;
			x += position.x;
			y += position.y;

			x /= position.z;
			y /= position.z;
			var size = messages[i].size;
			size = parseInt(size,10);
			size /= position.z;
			size = size+"px";
			draw_text(x,y, messages[i].text, size, messages[i].color, "sans-serif");
		}
	}
<<<<<<< HEAD
	socket.on('hear', function (data) {
		data.time = date.getTime();
		messages.push(data);
		redraw();
=======
	
	function update_text(){
		ctx.clearRect(0,0,c.width,c.height);
		for (var i = 0; i < messages.length; i++) {
			draw_text(messages[i].x,messages[i].y,messages[i].text,messages[i].size,messages[i].color,"sans-serif");
		}
	}
	
	socket.on('hear', function (data) {
		data.time = date.getTime();
		messages.push(data);
		update_text();
>>>>>>> f66dd90b23bc303ad611236191141cc0734c64b6
	});

	socket.on('colorlist', function (data) {
		var colorpicker = $("#colorpicker");
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

	function submit_text(X, Y, Text, Size) {
		socket.emit('say', {
			time: 0,
			x: X,
			y: Y,
			text: Text,
			size: Size
		});
	}

	function setColor(newcolor) {
		socket.emit('colorset', newcolor);
		color = newcolor;
		$("input").css('color', newcolor);
	}

	function color_init() {
		$('.colorradio').click(function () {
			console.log($(this).css('background-color'));
			setColor($(this).css('background-color'));
		});
	}

	function update_canvas_size() {
		var canvas = $('#text');
<<<<<<< HEAD
		canvas.attr('width', parseInt(canvas.width() * OVERSAMPLE_RATIO, 10));
		canvas.attr('height', parseInt(canvas.height() * OVERSAMPLE_RATIO, 10));
		ctx.scale(OVERSAMPLE_RATIO, OVERSAMPLE_RATIO);
		redraw();
=======
		width = parseInt(canvas.width(),10);
		canvas.attr('width',width);
		height = parseInt(canvas.height(),10);
		canvas.attr('height',height);
		update_text();
>>>>>>> f66dd90b23bc303ad611236191141cc0734c64b6
	}
	window.onresize=function(){
	update_canvas_size();
<<<<<<< HEAD
	$(window).resize(function () {
		update_canvas_size()
	});
=======
	}
>>>>>>> f66dd90b23bc303ad611236191141cc0734c64b6
}