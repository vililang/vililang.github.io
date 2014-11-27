/* JavaScript for xmas calendar */

var date = new Date();
var jsonData = new Object();
var imgArray = [];
var popupVisible = false;
var currentlyOpenWindow;
var windowsOpenedEarlier = "nnnnnnnnnnnnnnnnnnnnnnnn";

var main = function (){
	windowsOpenedEarlier = readCookie();

	/* Read calendar window pics and images */
	$.getJSON("js/windows.json", function(data) {
			jsonData = data;
	}).done(preloadImgs);	

	tagOpenedWindows();

	/* Hover effect on closed calendar windows*/
	$(".calendarwindow").hover(function() {
		$(this).toggleClass("highlighted");
	});

	/* Trying to open a calendar window */
	$(".calendarwindow").click(function() {
		var tryDate = $(this).text();
		var dd = date.getDate();
		var mm = date.getMonth()+1;
		var yyyy = date.getFullYear();

		if (tryDate <= dd && mm == 12 && yyyy == 2014) { // NOTE: checking for NOV for test purposes!
			$(".overlay").fadeIn(500);
			openWindow(tryDate);
		}
	});	

	/* Dismissing the window popup by clicking the dark overlay */
	$(".overlay").click(function (){
		$("#windowpopup").hide();
		$(this).fadeOut(300);
		popupVisible = false;
	}); 

};

/* Preload window images up to current date */
var preloadImgs = function() {
	for (i=0;i<date.getDate();i++) {
		imgArray[i] = new Image();
		imgArray[i].src = jsonData[i].img;
	}
};

/* Tag the already opened windows in main calendar view somehow */
var tagOpenedWindows = function() {
	$('.calendarwindow').each(function(index){
		var winNum = $(this).text();
		if (windowsOpenedEarlier.charAt(winNum-1) == 'y') {
				$(this).css("background-color","rgba(25,25,25, 0.5)");
				$(this).css("border","1px solid #191919");
		}
	});
};

/* A big one for generating and displaying the opened calendar window popup */
var openWindow = function(day) {
	var popupTxt = jsonData[day-1].txt;
	var hasNextWindow = false;
	var hasPrevWindow = false;

	var html = "<img src='" + imgArray[day-1].src + "' id='windowimage'/>";

		// exclude prev arrow from first calendar pic popup
		if (day>1) {
			html += "<div class='arrowleft'><a href='#'><img src='pics/arrow_left.png'/></a></div>";
			hasPrevWindow = true;
		}
		
		// exlude next arrow if no more "allowed" windows left in the calendar
		if (day<24 && (date.getDate()-day>0)) {
			html += "<div class='arrowright'><a href='#'><img src='pics/arrow_right.png'/></a></div>";
			hasNextWindow = true;
		}

		html += "<div class='flavourwrap'>";
			html += "<div class='flavourleft'>" + day + ".</div>";
			html += "<div class='flavourmiddle'><p>" + popupTxt + "</p></div>";
			html += "<div class='flavourright'><img src='pics/twitter24x24.png'/><img src='pics/facebook24x24.png'/></div>";
		html += "</div>";
			
	$("#windowpopup").html(html);

	// dirty vertical position adjustment
    var marginValue = (($(window).height() - $("#windowpopup").height()) / 2) + $(window).scrollTop();
    $("#windowpopup").css("top", marginValue);
    var arrowTopMargin = ($("#windowpopup").height() / 2) - 21; 
    $('.arrowleft').css("margin-top",arrowTopMargin);
	$('.arrowright').css("margin-top",arrowTopMargin);

	$("#windowpopup").show();
	currentlyOpenWindow = day;
	popupVisible = true;

	/* tagging the opened window to cookie and marking it up in the calendar pic */
	windowsOpenedEarlier = windowsOpenedEarlier.substr(0,day-1) + "y" + windowsOpenedEarlier.substr(day);
	setCookie();	
	$("td:contains(" + day + ")").each(function() {
		var chk = $(this).text();
		if ($(this).text() == day) {
			$(this).css("background-color","rgba(25,25,25, 0.5)");
			$(this).css("border","1px solid #191919");
		}
	});

	// add event handlers for prev arrow if it is present
	if (hasPrevWindow) {
		$(".arrowleft").hover(function(){
			$(this).toggleClass("arrowhighlight");
		});
		$(".arrowleft").click(function(){
			$("#windowpopup").hide();
			currentlyOpenWindow--;
			openWindow(currentlyOpenWindow);		
		});
	}

	// add event handlers for next arrow if it is present
	if (hasNextWindow) {
		$(".arrowright").hover(function(){
			$(this).toggleClass("arrowhighlight");
		});

		$(".arrowright").click(function(){
			$("#windowpopup").hide();
			currentlyOpenWindow++;
			openWindow(currentlyOpenWindow);
		});
	}
};

var setCookie = function() {
	var expires = "expires=Sat, 31 Jan 2015 00:00:00 UTC"; 
	var cookieStr = "opened=" + windowsOpenedEarlier + "; " + expires;
	document.cookie=cookieStr;
};

var readCookie = function() {
	var param = "opened=";
	var arr = document.cookie.split(';');
		for (var i = 0; i < arr.length; i++) {
			var c = arr[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf(param) != -1) return c.substring(param.length, c.length);
		}
		return "nnnnnnnnnnnnnnnnnnnnnnnn";
};

/* Dirty popup position correction on window resize <<*/
$(window).resize(function() {
	if (popupVisible) {
    		var marginValue = (($(window).height() - $("#windowpopup").height()) / 2) + $(window).scrollTop();
    		$("#windowpopup").css("top", marginValue);
    		var arrowTopMargin = ($("#windowpopup").height() / 2) - 21; 
    		$('.arrowleft').css("margin-top",arrowTopMargin);
			$('.arrowright').css("margin-top",arrowTopMargin);
	}
});

$(document).ready(main);

 
