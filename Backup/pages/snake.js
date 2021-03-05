

    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Call init() when page is loaded
window.addEventListener('load', (e) => {
	init();
})

//frequencies and names of guitar strngs in standard tuning
var standard_frequency = new Array(82.41, 110, 146.8, 196, 246.9, 329.6);
var strings_name = new Array("E", "A", "D", "G", "B", "E");
var string;	//this variable holds name of string being tuned
var Z;
var X=0;
var facz = true;

function init()
{
	show();	
	// We ask to get the audio
	var constraints = {audio: true};	
	
	// We are then getting the user audio by passing it 
	navigator.mediaDevices.getUserMedia(constraints)
		// Then is the first callback, the argument stream is an audiostream
		.then(function(stream){
			console.log("Connected live audio input :)");	//Yeah, we're happy
			audioStream(stream);
		})
		.catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.
}


//This function take audio stream as input and processes it to recognise guitar string being played and frequency of input audio
function audioStream(stream)
{
	// Everything happens within the audioContext variable
    var audio_context = new (window.AudioContext || window.webkitAudioContext)();
    var microphone = audio_context.createMediaStreamSource(stream);
    var analyser = audio_context.createAnalyser();

    microphone.connect(analyser);
    analyser.fftSize = 4096;

	var bufferLength = analyser.frequencyBinCount;

	// Finds frequency 
	function auto_correlation()
	{
		var difference, min_diff, offset, amplitude, string_offset;
		
		var buffer = new Float32Array(bufferLength);
		analyser.getFloatTimeDomainData(buffer);
		// If amplitude is less than buffer, it's noise
		amplitude = 0;
		for(var j=0; j<bufferLength; j++)
			amplitude += buffer[j];
		amplitude /= bufferLength;
		if(amplitude > 0.00025)	// Values lower are noise
		{

			min_diff = 1000000000;
			for(var i=0; i<6; i++)
			{
				difference = 0;
				offset = Math.floor((audio_context.sampleRate)/standard_frequency[i]);
				for(var j=0; j<bufferLength-offset; j++)
				{
					difference += Math.abs(buffer[j] - buffer[j + offset]);
				}
				difference /= bufferLength;
				if(difference < min_diff)
				{
					min_diff = difference;
					string = i;	
				}
			}

			var upper_limit, lower_limit;
			if(string == 0)
				upper_limit = 650;
			else upper_limit = Math.floor(((audio_context.sampleRate)/standard_frequency[string-1] + (audio_context.sampleRate)/standard_frequency[string])/2);
			if(string == 5)
				lower_limit = 100;
			else lower_limit = Math.floor(((audio_context.sampleRate)/standard_frequency[string] + (audio_context.sampleRate)/standard_frequency[string+1])/2);

			min_diff = 1000000000;			
			for(var i = lower_limit; i <= upper_limit; i++)
			{
				difference = 0;
				for(var j=0; j<bufferLength-i; j++)
				{
					difference += Math.abs(buffer[j] - buffer[j+i]);
				}
				if(difference < min_diff)
				{
					min_diff = difference;
					offset = i;
				}
			}

			frequency = Math.floor((audio_context.sampleRate)/offset);

			if(offset>120 && offset<630)
			{
				show(frequency);
			}
		}
		setTimeout(auto_correlation, 250);
	}
	auto_correlation();
}


// Shows the chord and frequency
function show(frequency) {

	var displayArea = document.getElementById('displayArea');
	var dimension = window.innerHeight*0.7;
	if(window.innerHeight > window.innerWidth)
		dimension = window.innerWidth*0.9;
	displayArea.width = dimension;
	displayArea.height = dimension;
	var dispArea = displayArea.getContext("2d");

	var percent;
	if(string == undefined)
		percent = 100;
	else	percent = 100-(Math.abs(frequency.toFixed(1) - standard_frequency[string].toFixed(1))*100)/standard_frequency[string].toFixed(1);
	
	var centreX = dimension*0.5, centreY = dimension*0.5, radius = dimension*0.5;
	var angle = (2*Math.PI*percent)/100.0 - Math.PI/2.0;
	
	dispArea.moveTo(centreX, centreY);	
	dispArea.arc(centreX, centreY, radius, -0.5*Math.PI, angle);

	dispArea.fillStyle = 'green';

	dispArea.moveTo(centreX, centreY);	
	dispArea.arc(centreX, centreY, radius*0.7, 0, 2*Math.PI);

	dispArea.textAlign = "center";


	dispArea.fillStyle = "Black";
	dispArea.font = 'bold '+(radius*0.4|0) + 'px sans-serif';
	if(string != undefined)
		dispArea.fillText(strings_name[string], centreX, centreY-radius*0.05);
	else{
		dispArea.font = 20 + 'px Arial';
			dispArea.fillText("Pluck a string", centreX, centreY);
	}

	dispArea.fillStyle = "blue";
	dispArea.font = 20 + 'px sans-serif';
	if(string != undefined){
        console.log(frequency);
		dispArea.fillText("Frequency: " + (frequency).toFixed(1)+" Hz of " + (standard_frequency[string]).toFixed(1) + "Hz", centreX, centreY+30);

    }


    if (frequency > 80){
        if(frequency < 85){
            X = 0;
            console.log("Z is:" + X);
            nextX = -1;
            nextY = 0;

        }
    }
    if (frequency > 105){
        if(frequency < 115){
            X = 1;
            console.log("Z is:" + X);
            nextX = 0;
            nextY = -1;
        }
    }
    if (frequency > 143){
        if(frequency < 148){
            X = 2;
            console.log("Z is:" + X);
            nextX = 1;
            nextY = 0;
        }
    }
    if (frequency > 190){
        if(frequency < 200){
            X = 3;
            console.log("Z is:" + X);
            nextX = 0;
            nextY = 1;
        }
    }
    
}

var canvas, ctx;

	window.onload = function() {
		canvas = document.getElementById("canvas");
		ctx = canvas.getContext("2d");

		//keyDownEvent();

		// render X times per second
		var x = 2;
		setInterval(draw, 1000 / x);
		};

		// game world
		var gridSize = (tileSize = 20); // 20 x 20 = 400
		var nextX = (nextY = 0);

		// snake
		var defaultTailSize = 40;
		var tailSize = defaultTailSize;
		var snakeTrail = [];
		var snakeX = (snakeY = 10);

		// apple
		var appleX = (appleY = 15);

		// draw
		function draw() {
		// move snake in next pos
		snakeX += nextX;
		snakeY += nextY;

		// snake over game world?
		if (snakeX < 0) {
			snakeX = gridSize - 1;
		}
		if (snakeX > gridSize - 1) {
			snakeX = 0;
		}

		if (snakeY < 0) {
			snakeY = gridSize - 1;
		}
		if (snakeY > gridSize - 1) {
			snakeY = 0;
		}

		//snake bite apple?
		if (snakeX == appleX && snakeY == appleY) {
			tailSize++;

			appleX = Math.floor(Math.random() * gridSize);
			appleY = Math.floor(Math.random() * gridSize);
		}

		//paint background
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// paint snake
		ctx.fillStyle = "green";
		for (var i = 0; i < snakeTrail.length; i++) {
			ctx.fillRect(
			snakeTrail[i].x * tileSize,
			snakeTrail[i].y * tileSize,
			tileSize,
			tileSize
			);
           

			//snake bites it's tail?
			if (snakeTrail[i].x == snakeX && snakeTrail[i].y == snakeY) {
			tailSize = 5;
            console.log("bitten");
			}
		}

		// paint apple
		ctx.fillStyle = "red";
		ctx.fillRect(appleX * tileSize, appleY * tileSize, tileSize, tileSize);

		//set snake trail
		snakeTrail.push({ x: snakeX, y: snakeY });
		while (snakeTrail.length > tailSize) {
			snakeTrail.shift();
            console.log("STLENGTH:" + snakeTrail.length);
            console.log("TS:" + tailSize);
		}
	}





        
    /*
    keyDownEvent();
        keyDownEvent();
		function keyDownEvent() {
            switch (X) {
                
                case 0:
                    nextX = -1;
                    nextY = 0;
                    console.log("Hi" + X);
                    console.log("Bye" + X);
                    break;
                case 1:
                    nextX = 0;
                    nextY = -1;
                    console.log(e+X);
                    break;
                case 2:
                    nextX = 1;
                    nextY = 0;
                    console.log(e + X);
                    break;
                case 3:
                    nextX = 0;
                    nextY = 1;
                    console.log(e+X);
                    break;
            }
	    }
    */