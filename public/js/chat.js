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

	var c=document.getElementById("text");
	var ctx=c.getContext("2d");
	
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
		submit_text(lastX + (input.outerWidth(true) - input.innerWidth()), lastY, text, input.css('font-size'));
		input.css('left', '' + (offset.left) + "px");
		input.css('top', '' + (offset.top + parseInt(input.css('font-size'))) + "px");
		return false;
	}
	
	function draw_text(x,y,text,size,color,font){
		console.log(x+" "+y+" "+text+" "+size+" "+color+" "+font);
		ctx.fillStyle=color;
		ctx.font=size+" "+font;
		ctx.fillText(text,x,y+parseInt(size,10));
	}
	
	socket.on('hear', function (data) {
		data.time = date.getTime();
		messages.push(data);
		ctx.clearRect(0,0,c.width,c.height);
		for (var i = 0; i < messages.length; i++) {
			draw_text(messages[i].x,messages[i].y,messages[i].text,messages[i].size,messages[i].color,"sans-serif");
		}
	});

	socket.on('colorlist', function (data) {
		var colorpicker = $("#colorpicker");
		var html = new Array();
		console.log(data);
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
	function update_canvas_size(){
		var canvas = $('#text');
		canvas.attr('width',parseInt(canvas.width(),10));
		canvas.attr('height',parseInt(canvas.height(),10));
	}
	update_canvas_size();
}