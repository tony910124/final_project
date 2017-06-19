var $ = require('jquery');

$(document).ready(function() {
	var config = {
	    apiKey: "AIzaSyBVD8idoqTmxHNSGdSitkL8AtV7c4l_oQ8",
	    authDomain: "goddamnproject.firebaseapp.com",
	    databaseURL: "https://goddamnproject.firebaseio.com",
	    projectId: "goddamnproject",
	    storageBucket: "goddamnproject.appspot.com",
	    messagingSenderId: "197579178072"
	};
	firebase.initializeApp(config);

	var User = firebase.database().ref().child('user');
	var Posts = firebase.database().ref().child('post');

	$("#submit").click(function() {
		state = $(this).attr("state");
		if(state == "SignUp")
			SignUp();
		else if(state == "SignIn")
			SignIn();
	});

	function SignUp() {
		const username = $('#username').val();
		const email = $('#email').val();
		const password = $('#password').val();
		const auth = firebase.auth();

		const promise = auth.createUserWithEmailAndPassword(email, password);
		promise.catch(function(e) {
			console.log(e.message);
		});

		promise.then(function(user) {
			console.log("Hello, " + user.email);
			const dbUserId = User.child(user.uid);
			dbUserId.set({
				email: user.email,
				username: username,
				donate: 0
			});
		});
	}
	
	function SignIn()
	{
		const email = $('#email').val();
		const password = $('#password').val();
		const auth = firebase.auth();

		const promise = auth.signInWithEmailAndPassword(email, password);
		promise.catch(function(e) {
			console.log(e.message);
		});

		promise.then(function() {
			console.log("Sign In fucker");
			window.location.href = "forum.html";
		});
	}

	$("#post").click(function() {
		const title = $("#title").val();
		const content = $("#content").val();
		const dbPost = Posts.child(title);
		dbPost.set({
			createAt: firebase.database.ServerValue.TIMESTAMP,
			title: title,
			content: content
		});
		updatePosts();
	});

	firebase.auth().onAuthStateChanged(function(user) {
		updatePosts();
	});

	function updatePosts() {
		var $forumContent = $("#forum-content");
		$forumContent.empty();

		Posts.orderByChild("createAt").on("child_added", function(snapshot) {
			var data = snapshot.val();
			var title = data.title;
			var content = data.content;
			var $postList = $("<li>");
			var $titleArea = $("<div>").addClass("title");
			var $line = $("<div>").addClass("line");
			var $content = $("<div>").addClass("author");
			$titleArea.append(title);
			$content.append(content);
			$postList.append($titleArea).append($line).append($content);
			$forumContent.append($postList);
		});
	}

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

	$(".landing__slogan a").click(function() {
		var navbarHeight = 60;		
		$("html body").stop().animate({
			scrollTop: $("#introduction").offset().top - navbarHeight
		}, 1000);
	});

	$("#SignUp, #SignIn").click(function() {
		var id = $(this).attr("id");
		$("#SignUp, #SignIn").toggleClass("active");

		if(id == "SignUp") {
			$("#username").slideDown(100);
			$("#submit").attr("value", "Sign Up Now");
		}
		else if(id == "SignIn") {
			$("#username").slideUp(100);
			$("#submit").attr("value", "Sign In Now");
		}

		$("#submit").attr("state", id);
		//$("input[type=submit]").attr("id", id+"Btn");
	});
	
});