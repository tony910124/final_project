var $ = require('jquery');

$(document).ready(function() {
	$(".navbar__icon").click(function() {
		$(".navbar__icon").toggleClass("active");
		$(".navbar__content").children().slideToggle(200);
	});
});