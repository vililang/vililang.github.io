/* JavaScript for xmas calendar */

var date = new Date();
var jsonData = new Object();
var imgArray = [];
var popupVisible = false;
var currentlyOpenWindow;

var preloadImgs = function() {
	for (i=0;i<date.getDate();i++) {
		imgArray[i] = new Image();
		imgArray[i].src = jsonData[i].img;
	}
};

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
	
	$("#windowpopup").show();
	currentlyOpenWindow = day;
	popupVisible = true;
	
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

var main = function (){

	/* Read calendar window pics and images */
	$.getJSON("js/windows.json", function(data) {
			jsonData = data;
	}).done(preloadImgs);	

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

$(document).ready(main);

/* Dirty popup position correction on window resize <<*/
$(window).resize(function() {
	if (popupVisible) {
    		var marginValue = (($(window).height() - $("#windowpopup").height()) / 2) + $(window).scrollTop();
    		$("#windowpopup").css("top", marginValue);
	}
});
 
