// Iconomowoc main js file

var currentPercent = 0;
var counter = 0;
var tid = setInterval(stepcounter, 27);

var windowWidth = $(window).width();
var windowHeight =$(window).height();
var sideSpace = 10;    
var size1k = 100;
var canvasWidth = windowWidth - (sideSpace*2);
var startOffset = (canvasWidth/2);

$('#canvas').css({'width': canvasWidth});
$('.me').css({'left': startOffset});


function stepcounter() {
	if (currentPercent < 100) {
		currentPercent += 1;
	} else {
		currentPercent = 0;
		counter += 1;
		console.log('over');
}


	if (counter >= 12) {
		$('#canvas').addClass('paused');
		 $("#canvas").append('<div class="totalsteps" style="bottom: 1px; left:'  + (startOffset)  + 'px;">12.5 k</div>');
		abortTimer();
	}
    
}

function abortTimer() { // to be called when you want to stop the timer
	clearInterval(tid);
}   