/* JavaScript for xmas calendar */

var date = new Date();
var jsonData = new Object();
var imgArray = [];

var preloadImgs = function() {
	for (i=0;i<date.getDate()-1;i++) {
		imgArray[i] = new Image();
		imgArray[i].src = jsonData[i].img;
	}
};

var main = function (){
	$.getJSON("js/windows.json", function(data) {
			jsonData = data;
	}).done(preloadImgs);	

	$(".calendarwindow").hover(function() {
		$(this).toggleClass("highlighted");
	});
	
	$(".overlay").click(function (){
		$("#windowpopup").hide();
		$(this).fadeOut(300);
	}); 

	$(".calendarwindow").click(function() {
		var tryDate = $(this).text();
		var dd = date.getDate();
		var mm = date.getMonth()+1;
		var yyyy = date.getFullYear();
		
		if (tryDate <= dd && mm == 11 && yyyy == 2014) { // NOTE: checking for NOV for test purposes!
			var popupTxt = jsonData[tryDate-1].txt;

			var html = "<img src='" + imgArray[tryDate-1].src + "' class='luukkukuva'/>";
				html += "<div class='flavourwrap'>";
					html += "<div class='flavourleft'>" + tryDate + ".</div>";
					html += "<div class='flavourmiddle'><p>" + popupTxt + "</p></div>";
					html += "<div class='flavourright'><img src='pics/twitter24x24.png'/><img src='pics/facebook24x24.png'/></div>";
				html += "</div>";
			
			$("#windowpopup").html(html);
	  		
	  		/*
	  		var luukkuHeight = $("#avattuluukku").height();
    		var winHeight = $(window).height();
    		$("#avattuluukku").css("margin-top", -(((winHeight-luukkuHeight)/2)+luukkuHeight));
			*/

			$(".overlay").fadeIn(500);
			$("#windowpopup").show();
		}
	
	});	

};

$(document).ready(main);
 
