
//////////////////////////////////////////////////////////////////////////

//Call init() when page is loaded
window.addEventListener('load', (e) => {
	initializeTuner();
})


var Settings = {
	container: document.getElementById("guitar-tuner"),
	backgroundColor: 'white', 
	notOkayColor: "orange",
	okayColor: "green",
	fontColor: "black",

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


