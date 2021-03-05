window.addEventListener('load', (e) => {
	initializeTuner();
	//init();
});

//////////////////////////////////////////////////////////////////////////

var Settings = {
	container: document.getElementById("guitar-tuner"),
	backgroundColor: 'black', 
	notOkayColor: "orange",
	okayColor: "green",
	fontColor: "white"
};


function initializeTuner() {
	// Create a single or multiple instance of tuners at time
	var tuners = [
		new OnlineTuner.Controller.GuitareTuner(
			new OnlineTuner.Widget.CircleWidget(
				Settings.container, 
				Settings.backgroundColor, 
				Settings.notOkayColor, 
				Settings.okayColor, 
				Settings.fontColor
			)
		)
	];
	
	// Initialize the tuner with the callbacks
	new OnlineTuner.Analyser(tuners).install(function() {
		console.log("Succesfully initialized");
		
	}, function(errorMessage) {
		console.error("Oops, this shouldn't happen", errorMessage);
	});
}

// Render the guitar tuner on the canvas by running the function
//initializeTuner();



function init()
{	
	// We are then getting the user audio by passing it 
	navigator.mediaDevices.getUserMedia({audio: true})
		// Then is the first callback, the argument stream is an audiostream
		.then(function(stream){
			console.log("Successfully connected");
			audioStream(stream);
		})
		.catch(function(err) {
			console.log(err.name + ": " + err.message); 
		}); 
}


//This function take audio stream as input and processes it to recognise guitar string being played and frequency of input audio
function audioStream(stream)
{
	// Everything happens within the audioContext variable
    var audio_context = new (window.AudioContext || window.webkitAudioContext)();
    var microphone = audio_context.createMediaStreamSource(stream);
    var analyser = audio_context.createAnalyser();

    microphone.connect(analyser);

}
