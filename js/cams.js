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
	mqtt_mainpage_client.subscribe("camera/cmd");
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
	// Cancello
	$("#frame1").attr("src","http://cam3.local:8001/stream.mjpg")

	// Ingresso primo piano
	$("#frame2").attr("src","http://cam1.local:8001/stream.mjpg")

	// Ufficio primo piano
	$("#frame3").attr("src","http://cam2.local:8001/stream.mjpg")

	$("#frame4").attr("src","http://cam4.local:8001/stream.mjpg")


	$("#cam_layer").fadeIn();
});
