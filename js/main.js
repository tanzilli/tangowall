// TANGOWALL

var mqtt_broker="camserver.local";
var mqtt_port=1884;
var mqtt_mainpage_client;


// Genera una stringa random di caratteri
// Viane usata per le funzioni MQTT
var randomString = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function onConnect() {
	mqtt_mainpage_client.subscribe("tangowall/cmd");
}	

function onMessageArrived(message) {

	console.log(message.payloadString);
	json_data = JSON.parse(message.payloadString);

	if (json_data.cmd=="tangowall_layer") {
		$("#tangowall_layer").fadeIn();
		$("#partywall_layer").fadeOut();
		$("#mirror_2_layer").fadeOut();
		return;
	}

	if (json_data.cmd=="partywall_layer") {
		$("#tangowall_layer").fadeOut();
		$("#partywall_layer").fadeIn();
		$("#mirror_2_layer").fadeOut();
		return;
	}

	if (json_data.cmd=="mirror_2_layer") {
		$("#tangowall_layer").fadeOut();
		$("#partywall_layer").fadeOut();
		$("#mirror_2_layer").fadeIn();
		return;
	}

	// Visibility
	if (json_data.cmd=="visibility") {
		//var element=document.getElementById(json_data.element); 

		//element.style.visibility=json_data.value;

		if (json_data.value===false) {
			$("#" + json_data.element).fadeOut();
		} else {
			$("#" + json_data.element).fadeIn();
		}
		return;
	}    

	// Load video
	if (json_data.cmd=="load") {
		var video_tag=document.getElementById(json_data.element); 
		var source_tag=document.getElementById(json_data.element + "_source"); 

		source_tag.src=json_data.filename;
		video_tag.load();
		return;
	}    

	// Play/PlaybackRate
	if (json_data.cmd=="play") {
		var element=document.getElementById(json_data.element); 
		element.playbackRate=json_data.playbackRate;
		element.play();
		return;
	}    

	if (json_data.cmd=="pause") {
		var element=document.getElementById(json_data.element); 
		element.pause();
		return;
	}    

	// currentTime
	if (json_data.cmd=="current_time") {
		var element=document.getElementById(json_data.element); 
		
		element.currentTime=json_data.current_time;
		return;
	}    

	// seek
	if (json_data.cmd=="seek") {
		var element=document.getElementById(json_data.element); 
		element.currentTime=element.currentTime+json_data.offset;
		return;
	}    

	

	// Load video
	if (json_data.cmd=="youtube_load") {
		youtube_id = json_data.value;

		player.on('ready', event => {
			//const instance = event.detail.plyr;
			player.play();
		});


		/*player.on('ended', event => {
			var message;
			console.log("Ended");
			message = new Paho.MQTT.Message("end");
			message.destinationName = "tangowall/finished";
			mqtt_mainpage_client.send(message);
		});*/
		
		player.on('statechange', event => {
			if (event.detail.code===0) {
				var message;
				console.log(event.detail.code);
				message = new Paho.MQTT.Message("end");
				message.destinationName = "tangowall/finished";
				mqtt_mainpage_client.send(message);
			}
		});


		player.source = {
		    type: 'video',
		    sources: [
		        {
		            src: youtube_id,
		            provider: 'youtube',
		        },
		    ],
		};
	}	
		
	if (json_data.cmd=="youtube_pause") {
		player.pause();
		return;
	}
	
	if (json_data.cmd=="youtube_play") {
		player.play();
		return;
	}




	// Refresh della pagina
	//if (json_data.cmd=="loadpage") {
	//	$("#all").fadeOut("slow",function() {
	//		document.location.href = json_data.value;
	//	});
	//	return;
	//}

	/* Seek
	if (json_data.cmd=="seek") {
		var element = document.getElementById(json_data.element);
		console.log(element.seekable.start(0));
		console.log(element.seekable.end(0));
		
		var requested_position=json_data.position;
		var total_duration=element.seekable.end(0);
		
		element.currentTime=requested_position*total_duration/100;
	}    
	*/
	
}	

/* View in fullscreen */
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen(elem) {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}

$(document).ready(function() {
	// Interpretazione messaggi MQTT in arrivo
	mqtt_mainpage_client = new Paho.MQTT.Client(mqtt_broker, Number(mqtt_port), "/ws",randomString(20));
	mqtt_mainpage_client.onMessageArrived=onMessageArrived;
	mqtt_mainpage_client.connect({
		onSuccess:onConnect
	});

	$("#tangowall_layer").fadeIn();

	// Change the second argument to your options:
	// https://github.com/sampotts/plyr/#options
	const player = new Plyr('#player', {captions: {active: true}});
	
	// Expose player so it can be used from the console
	window.player = player;
	
	//player.play();
	
	//var elem = document.documentElement;
	//openFullscreen(elem);
});
