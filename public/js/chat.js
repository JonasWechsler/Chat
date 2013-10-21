function chat_init() {
	var messages = [];
	var url = 'http://sweet-talk.herokuapp.com/';
	var socket = io.connect('localhost');
	var input = $("#input");
	var lastX = null;
	var lastY = null;
	var moved = true;
	var MIN_SIZE = 6;
	var RESIZEABLE = true;
	var date = new Date();
	var size = parseInt(input.css('font-size'));
	var color = 'grey';
	$("#text").mousedown(function (event) {
		input.css('position', 'absolute');
		input.css('left', '' + (event.pageX - (input.outerWidth()-input.innerWidth())) + "px");
		input.css('top', '' + (event.pageY - input.outerHeight() * .5) + "px");
		moved = true;
	});
	$('body').keypress(function () {
		input.focus();
	});

	if (RESIZEABLE) {
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
	}
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
		lastX = offset.left /*+ input.outerWidth(true) - input.innerWidth()*/;
		lastY = offset.top;
		//var newX = lastX;
		//var newY = lastY + parseInt(input.css('font-size'));
		//var newY = lastY;
		console.log(input.css('font-size'));
		submit_text(lastX + (input.outerWidth(true) - input.innerWidth()), lastY, text, input.css('font-size'));
		input.css('left', '' + (offset.left) + "px");
		input.css('top', '' + (offset.top + parseInt(input.css('font-size')) ) + "px");
		//lastY = newY;
		//lastX = newX;
		return false;
	}
	socket.on('say', function (data) {
		data.time = date.getTime();
		messages.push(data);
		var html = Array();
		for (var i = 0; i < messages.length; i++) {
			var x = messages[i].x;
			var y = messages[i].y;
			var text = messages[i].text;
			var size = messages[i].size;
			var a = $("<p><\p>");
			a.append(document.createTextNode(text));
			a.css('left', x);
			a.css('top', y);
			a.css('color', color);
			a.css('font-size', size);
			html.push(a);
		}
		$("#text").children().remove();
		$("#text").append(html);
	});

	socket.on('colorlist', function (data) {
		var colorpicker = $("#colorpicker");
		var html = new Array();
		for (var i = 0; i < data.length; i++) {
			var a = $("<td>");
			a.css('background-color', data[i]);
			a.addClass('colorradio');
			html.push(a);
		}
		colorpicker.append(html);

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
}