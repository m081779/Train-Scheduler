$(document).ready(function () {


	var validInput = false; 
	var trainName = '';
  	var destination = '';
  	var trainTime = '';
  	var frequency = '';
	 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDKINKKPP1gpHzk1eUGwDo4FK0udQ3kt6E",
    authDomain: "train-scheduler-20bae.firebaseapp.com",
    databaseURL: "https://train-scheduler-20bae.firebaseio.com",
    projectId: "train-scheduler-20bae",
    storageBucket: "",
    messagingSenderId: "959412520121"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  	function whistleSound() {
		var snd1  = new Audio();
		var src1  = document.createElement("source");
		src1.type = "audio/mpeg";
		src1.src  = "assets/audio/whistle.mp3";
		snd1.appendChild(src1);
		snd1.play();
	}

  function validator() {
  	validInput=false;
  	var counter = 0;
  	if ($('#trainName').val() === '') {
  		$('.trainName').addClass('highLighter').text('Must input a Train name');
  		
  	} else {
  		$('.trainName').empty();
  		counter++;
  	}

  	if ($('#destination').val() === '') {
  		$('.destination').addClass('highLighter').text('Must input a Destination');
  		
  	} else {
  		$('.destination').empty();
  		counter++;
  	}


  	// || $('#trainTime').val(([01]\d|2[0-3]):?([0-5]\d)$)

  	if ($('#trainTime').val() === '' ) {
  		$('.trainTime').addClass('highLighter').text('Must input a Time for first train');
  		
  	} else {
  		$('.trainTime').empty();
  		counter++;
  	}

  	if ($('#frequency').val() === '' || isNaN( $('#frequency').val() ) ) {
  		$('.frequency').addClass('highLighter').text('Must input a Frequency in minutes');
  	} else {
  		$('.frequency').empty();
  		counter++;
 	}

  	if (counter===4) {
  		validInput=true;
  	}
  }//end of validator function


  //submit button event listener  runs validator function to make sure all inputs exist,
  //captures values of inputs, pushes them to firebase, and clears inputs
  $('#submit').on('click', function () {
  	validator();
  	if (validInput) {
  		trainName = $('#trainName').val().trim();
	  	destination = $('#destination').val().trim();
	  	trainTime = $('#trainTime').val().trim();
	  	frequency = $('#frequency').val().trim();

	  	database.ref().push({
	  		trainName,
	  		destination,
	  		trainTime,
	  		frequency,
	  		timeAdded: firebase.database.ServerValue.TIMESTAMP
	  	});
	  	$('trainName').val('');
	  	$('#destination').val('');
	  	$('#trainTime').val('');
	  	$('#frequency').val('');
	  	whistleSound();
  	}
  });


//child added event listener
database.ref().on("child_added", function(snap) {
	//time calculations
	frequency = parseInt(snap.val().frequency);
	trainTime = moment(snap.val().trainTime, "hh:mm").subtract(1, "years");
	var minAway = frequency - (moment().diff(moment(trainTime), "minutes") % frequency);
	var next = moment(moment().add(minAway, "minutes")).format("hh:mm");

	//writing row and cells for table 
	var tr = $('<tr>');
  	var tdName = $('<td>').text(snap.val().trainName);
  	var tdDestination = $('<td>').text(snap.val().destination);
  	var tdNext = $('<td>').text(next);
  	var tdFrequency = $('<td>').text(snap.val().frequency);
  	var tdFrequency = $('<td>').text(snap.val().frequency);
  	var tdminAway = $('<td>').text(minAway);
  	tr.append(tdName, tdDestination, tdFrequency, tdNext,tdminAway );
  	$('tbody').append(tr);
});





});//end of document ready function