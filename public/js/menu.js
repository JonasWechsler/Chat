function menu_init() {
	var menu = $('#menu');
	var height = menu.innerHeight();
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