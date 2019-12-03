
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
	mqtt_mainpage_client.subscribe("partywall");
	console.log("Connesso");
}	

function onMessageArrived(message) {

	console.log(message.payloadString);
	json_data = JSON.parse(message.payloadString);
}

$(document).ready(function() {
	// Interpretazione messaggi MQTT in arrivo
	mqtt_mainpage_client = new Paho.MQTT.Client(mqtt_broker, Number(mqtt_port), "/ws",randomString(20));
	mqtt_mainpage_client.onMessageArrived=onMessageArrived;
	mqtt_mainpage_client.connect({
		onSuccess:onConnect
	});

	// Change the second argument to your options:
	// https://github.com/sampotts/plyr/#options
	const player = new Plyr('#player', {captions: {active: true}});
	
	// Expose player so it can be used from the console
	window.player = player;
	
	player.play();
	
});


