//http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
//http://devmag.org.za/2012/07/29/how-to-choose-colours-procedurally-algorithms/

function menu_init() {
	var menu = $('.menu');
	var sizer = $('.sizeslider');
	var height = menu.innerHeight();

	var BROWSER_KEY = "AIzaSyCuEqugiKRH0VfVsspQ6ErjRgDKTIvNTwc";
	var GoogleFonts = "https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=" + BROWSER_KEY;
	var promptedFonts = [];
	var numFonts = 100;

	var GOLD = 0.618033988749895;
	/*menu.mouseover(function () {
		menu.animate({
			bottom: 0,
			borderWidth: "0px"
		}, {
			queue: false
		});
	});
	menu.click(function () {
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
	});*/
	$.getJSON(GoogleFonts, function (json) {
		console.log(json);
		for (var i = 0; i < 100; i++) {
			promptedFonts.push(json.items[i].family);
		}
		for (var i = 0; i < promptedFonts.length; i++) {
			$(".fonts").append("<option>" + promptedFonts[i] + "</option>");
		}

		WebFont.load({
			google: {
				families: promptedFonts
			}
		});
	});
	$(".fonts").change(function () {
		var str = "";
		$("select option:selected").each(function () {
			str += $(this).text() + " ";
		});
		console.log(str);
		$(".textbox").css('font-family',str);
	}).change();
}


function showSizeValue(newValue) {
	set_size(newValue);
	$(".size").text(newValue);
}

function showHistoryValue(newValue) {

}