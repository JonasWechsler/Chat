//http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
//http://devmag.org.za/2012/07/29/how-to-choose-colours-procedurally-algorithms/

function menu_init() {
	var menu = $('#menu');
	var sizer = $('#sizeslider');
	var height = menu.innerHeight();
	var GOLD = 0.618033988749895;
	menu.mouseover(function () {
		menu.animate({
			bottom: 0,
			borderWidth: "0px"
		}, {
			queue: false
		});
	});
	menu.mouseleave(function () {
		height = menu.innerHeight();
		menu.animate({
			bottom: -1 * height,
			borderWidth: "15px 0px 0px 0px"
		}, {
			queue: false
		});
	});
	menu.css({
		bottom: -1 * height,
		borderWidth: "15px 0px 0px 0px"
	});
	menu.animate({
		bottom: 0,
		borderWidth: "0px"
	}, {
		queue: false
	});
}

function setColor(newcolor){
	console.log('color:' + color);
	console.log(newcolor);
	color=newcolor;
	
}

function color_init(){
	$('.colorradio').click(function () {
		console.log($(this).css('background-color'));
		setColor($(this).css('background-color'));
	});
}

function showValue(newValue) {
	set_size(newValue);
	$("#size").text(newValue);
}