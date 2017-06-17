var $ = require('jquery');

$(document).ready(function() {
	$(".navbar__icon").click(function() {
		$(".navbar__icon").toggleClass("active");
		$(".navbar__content").children().slideToggle(200);
	});

	$(".navbar__content li").click(function() {
		var id = $(this).children().attr('href');
		var topValue = $(id).offset().top;
		var navbarHeight = 60;

		$(".navbar__icon").toggleClass("active");
		$(".navbar__content").children().slideToggle(200);
		$("html body").stop().animate({
			scrollTop: topValue - navbarHeight
		}, 1000);

		//console.log($(id).offset().top);
	});
});