function chat_init(){
	var messages = [];
	var url = 'http://sweet-talk.herokuapp.com/';
	var socket = io.connect('localhost');
	var input = $("#input");
	var lastX = null;
	var lastY = null;
	var moved = true;
	var MIN_SIZE = 6;
	var RESIZEABLE = true;
	var size = parseInt(input.css('font-size'));
	$("#text").mousedown(function (event) {
		input.css('position', 'absolute');
		input.css('left', '' + (event.pageX - input.outerHeight() * .5) + "px");
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
		if (!lastX || !lastY || moved) {
			moved = false;
			lastX = offset.left;
			lastY = offset.top + input.height();
		}
		var newX = lastX;
		var newY = lastY + parseInt(input.css('font-size'));
		submit_text(newX, newY, text, input.css('font-size'));
		lastY = newY;
		lastX = newX;
		return false;
	}
	socket.on('say', function (data) {
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
			a.css('font-size', size);
			html.push(a);
			
		}
		console.log("size::" + roughsizeof(messages) + " bytes");
		$("#text").children().remove();
		$("#text").append(html);
	});

	function submit_text(X, Y, Text, Size) {
		socket.emit('say', {
			x: X,
			y: Y,
			text: Text,
			size: Size
		});
	}
}