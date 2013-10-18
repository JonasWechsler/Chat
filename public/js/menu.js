//http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
//http://devmag.org.za/2012/07/29/how-to-choose-colours-procedurally-algorithms/
function menu_init() {
	var menu = $('#menu');
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
		menu.animate({
			bottom: -1 * height,
			borderWidth: "10px 0px 0px 0px"
		}, {
			queue: false
		});
	});
}

function showValue(newValue){
	console.log(newValue);
	$("#size").text(newValue);
}