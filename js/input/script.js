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
			window.location.href = "message.html";
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
			console.log("Hello");
			window.location.href = "message.html";
		});
	}

	$("#SignOut").click(function() {
		firebase.auth().signOut();
		window.location.href = "index.html";
	});

	firebase.auth().onAuthStateChanged(function(user) {
		console.log("Yee");
		UpdatePosts();
	});

	$("#Send").click(function() {
		const message = $("#message").val();
		const uid = firebase.auth().currentUser.uid;
		var username;

		User.child(uid).once('value').then(function(snapshot) {
			username = snapshot.val().username;
			Posts.push({
				author: username,
				message: message,
				createAt: firebase.database.ServerValue.TIMESTAMP
			});
		});

		UpdatePosts();
	});

	function GetFormattedDate(date) 
	{
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		return year + '/' + month + '/' + day;
	}

	function GetTime(date) 
	{		
		var hour = date.getHours().toString();
		var minute = date.getMinutes().toString();
		var second = date.getSeconds().toString();

		var zero = "00";
		hour = zero.substring(0, zero.length - hour.length) + hour;
		minute = zero.substring(0, zero.length - minute.length) + minute;
		second = zero.substring(0, zero.length - second.length) + second;

		return hour + ":" + minute + ":" + second;
	}


	function UpdatePosts() {
		var $messageArea = $(".message-area");
		$messageArea.empty();

		var data = [];
		Posts.once('value', function(snapshot) {
			snapshot.forEach(function(item){
				var itemValue = item.val();
				data.push(itemValue);
			});

			data.sort(function(a, b) {
				return (a.createAt < b.createAt);
			});
			
			data.forEach(function(item) {
				var date = new Date(item.createAt);
				var time = GetTime(date);
				date = GetFormattedDate(date);
				var message = $("<h3>").addClass("message-area__item__content").append(item.message);
				var author = $("<h5>").addClass("message-area__item__detail__author").append(item.author);
				var postTime = $("<h5>").addClass("message-area__item__detail__date").append(date).append($("<br>")).append(time);
				var detail = $("<div>").addClass("message-area__item__detail").append(author).append(postTime);
				var line = $("<div>").addClass("line");
				var messageElement = $("<li>").addClass("message-area__item").append(message).append(line).append(detail);
				$messageArea.append(messageElement);

				/*var titleArea = $("<div>").addClass("title").append(item.title);
				var authorArea = $("<div>").addClass("detail__author").append(item.author);
				var timeArea = $("<div>").addClass("detail__time").append(date).append("<br>").append(time);
				var detail = $("<div>").addClass("detail").append(authorArea).append(timeArea);
				var line = $("<div>").addClass("line");
				var postList = $("<li>").addClass("item").append(titleArea).append(line).append(detail).attr("value", item.title);
				$forumContent.append(postList);*/
			});
		});
	}




	$(".icon").click(function() {
		$(this).toggleClass("active");
		$(".navbar__list").toggleClass("active");
	});

	$(".item").click(function() {
		if($(this).attr("id") == "SignOut")
			return ;

		var id = $(this).children().attr("href");
		var topValue = $(id).offset().top;
		var navbarHeight = 60;

		$(".icon").toggleClass("active");
		$(".navbar__list").toggleClass("active");
		$("html body").stop().animate({
			scrollTop: topValue - navbarHeight
		}, 1000);
	});

	$(".landing-area__main-anchor").click(function() {
		var topValue = $("#introduction").offset().top;
		var navbarHeight = 60;
		$("html body").stop().animate({
			scrollTop: topValue - navbarHeight
		}, 1000);
	});

	$("#SignUp, #SignIn").click(function() {
		var id = $(this).attr("id");
		$("#SignUp, #SignIn").toggleClass("active");
		if(id == "SignUp") {
			$("#username").slideDown(100);
			$("#submit").attr("value", "Sign Up Now");
			$("#SignUp").addClass("active");
			$("#SignIn").removeClass("active");
		}
		else if(id == "SignIn") {
			$("#username").slideUp(100);
			$("#submit").attr("value", "Sign In Now");
			$("#SignIn").addClass("active");
			$("#SignUp").removeClass("active");
		}

		$("#submit").attr("state", id);
	});

	/*$("#post").click(function() {
		const title = $("#title").val();
		const content = $("#content").val();
		const dbPost = Posts.child(title);
		const uid = firebase.auth().currentUser.uid;
		var username;

		User.child(uid).once('value').then(function(snapshot) {
			username = snapshot.val().username;
			dbPost.set({
				author: username,
				title: title,
				content: content,
				createAt: firebase.database.ServerValue.TIMESTAMP
			});
		});
		updatePosts();
	});

	firebase.auth().onAuthStateChanged(function(user) {
		updatePosts();
	});

	function GetFormattedDate(date) 
	{
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		return year + '/' + month + '/' + day;
	}

	function GetTime(date) 
	{		
		var hour = date.getHours().toString();
		var minute = date.getMinutes().toString();
		var second = date.getSeconds().toString();

		var zero = "00";
		hour = zero.substring(0, zero.length - hour.length) + hour;
		minute = zero.substring(0, zero.length - minute.length) + minute;
		second = zero.substring(0, zero.length - second.length) + second;

		return hour + ":" + minute + ":" + second;
	}*/

	/*function updatePosts() {
		var $forumContent = $("#forum-content");
		$forumContent.empty();
		var data = [];
		Posts.once('value', function(snapshot) {
			snapshot.forEach(function(item){
				var itemValue = item.val();
				data.push(itemValue);
			});

			data.sort(function(a, b) {
				return (a.createAt < b.createAt);
			});
			
			data.forEach(function(item) {
				var date = new Date(item.createAt);
				var time = GetTime(date);

				date = GetFormattedDate(date);
				var titleArea = $("<div>").addClass("title").append(item.title);
				var authorArea = $("<div>").addClass("detail__author").append(item.author);
				var timeArea = $("<div>").addClass("detail__time").append(date).append("<br>").append(time);
				var detail = $("<div>").addClass("detail").append(authorArea).append(timeArea);
				var line = $("<div>").addClass("line");
				var postList = $("<li>").addClass("item").append(titleArea).append(line).append(detail).attr("value", item.title);
				$forumContent.append(postList);
			});
		});
	}*/

	/*$("#send").click(function() {
		//console.log("click send");
		var message = $("#message").val();
		var title = $(".post__title").text();
		const dbPost = Posts.child(title+"/message/");
		const uid = firebase.auth().currentUser.uid;

		User.child(uid).once('value').then(function(snapshot) {
			username = snapshot.val().username;
			dbPost.push({
				author: username,
				message: message,
				createAt: firebase.database.ServerValue.TIMESTAMP
			});
		});
	});*/
});