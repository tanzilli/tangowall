// TANGOWALL

var mqtt_broker="camserver.local";
var mqtt_port=1884;
var mqtt_mainpage_client;
var player;


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
	mqtt_mainpage_client.subscribe("tangotv/cmd");
}	


function hideAllLayers() {
	console.log("HideAllLayer");
	$("#video_layer").fadeOut();
}

function onMessageArrived(message) {

	console.log(message.payloadString);
	json_data = JSON.parse(message.payloadString);

	if (json_data.cmd=="video_layer") {
		hideAllLayers();
		$("#video_layer").fadeIn();
		return;
	}

	if (json_data.cmd=="hide_all_layers") {
		$("#video_layer").fadeOut();
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

function videoPlay() { 
	$("#button1").html('<button onclick="videoPause()" class="pure-button pure-button-primary">Pause</button>');
	var vid = document.getElementById("video_player");

	if (vid.playbackRate==1) {
		vid.muted = false;
	} else {
		vid.muted = true;
	}	

	vid.play();
} 

function videoPause() { 
	$("#button1").html('<button onclick="videoPlay()" class="pure-button pure-button-primary">Play</button>');

	var vid = document.getElementById("video_player");
	vid.pause();
} 

function videoSeek(value) { 
	var vid = document.getElementById("video_player");
	vid.currentTime=vid.currentTime+value;
} 

function videoPlaybackRate(value) { 
	console.log(value);
	var vid = document.getElementById("video_player");
	vid.playbackRate = value;
	
	if (value==1) {
		vid.muted = false;
	} else {
		vid.muted = true;
	}	
} 

// http://www.developphp.com/video/JavaScript/File-Upload-Progress-Bar-Meter-Tutorial-Ajax-PHP
function drag_drop(event) {
	event.preventDefault();
	//alert(event.dataTransfer.files[0]);

	var file = event.dataTransfer.files[0];
	// alert(file.name+" | "+file.size+" | "+file.type);
	var formdata = new FormData();
	formdata.append("file1", file);
	var ajax = new XMLHttpRequest();
	ajax.upload.addEventListener("progress", progressHandler, false);
	ajax.addEventListener("load", completeHandler, 1);
	//ajax.addEventListener("error", errorHandler, false);
	//ajax.addEventListener("abort", abortHandler, false);
	ajax.open("POST", "upload.php");
	ajax.send(formdata);

	var mp4 = document.getElementById("mp4");
	d = new Date();
	mp4.src = "video/" + event.dataTransfer.files[0].name;
}

function progressHandler(event){
	var percent = (event.loaded / event.total) * 100;
	$("#progressBar").val(Math.round(percent));
}

function completeHandler(event,value){
	console.log("completeHandler " +  value);
	$("#progressBar").value = 0;

	var vid = document.getElementById("video_player");
	vid.load();
	//vid.play();
}

$(document).ready(function() {
	// Interpretazione messaggi MQTT in arrivo
	mqtt_mainpage_client = new Paho.MQTT.Client(mqtt_broker, Number(mqtt_port), "/ws",randomString(20));
	mqtt_mainpage_client.onMessageArrived=onMessageArrived;
	mqtt_mainpage_client.connect({
		onSuccess:onConnect
	});
	
(function() {
  var canvas = this.__canvas = new fabric.Canvas('c', { selection: false });
  fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

  function makeCircle(left, top, line1, line2, line3, line4) {
    var c = new fabric.Circle({
      left: left,
      top: top,
      strokeWidth: 5,
      radius: 12,
      fill: '#fff',
      stroke: '#666'
    });
    c.hasControls = c.hasBorders = false;

    c.line1 = line1;
    c.line2 = line2;
    c.line3 = line3;
    c.line4 = line4;

    return c;
  }

  function makeLine(coords) {
    return new fabric.Line(coords, {
      fill: 'red',
      stroke: 'red',
      strokeWidth: 5,
      selectable: false,
      evented: false,
    });
  }

  var line = makeLine([ 250, 125, 250, 175 ]),
      line2 = makeLine([ 250, 175, 250, 250 ]),
      line3 = makeLine([ 250, 250, 300, 350]),
      line4 = makeLine([ 250, 250, 200, 350]),
      line5 = makeLine([ 250, 175, 175, 225 ]),
      line6 = makeLine([ 250, 175, 325, 225 ]);

  canvas.add(line, line2, line3, line4, line5, line6);

  canvas.add(
    makeCircle(line.get('x1'), line.get('y1'), null, line),
    makeCircle(line.get('x2'), line.get('y2'), line, line2, line5, line6),
    makeCircle(line2.get('x2'), line2.get('y2'), line2, line3, line4),
    makeCircle(line3.get('x2'), line3.get('y2'), line3),
    makeCircle(line4.get('x2'), line4.get('y2'), line4),
    makeCircle(line5.get('x2'), line5.get('y2'), line5),
    makeCircle(line6.get('x2'), line6.get('y2'), line6)
  );

  canvas.on('object:moving', function(e) {
    var p = e.target;
    p.line1 && p.line1.set({ 'x2': p.left, 'y2': p.top });
    p.line2 && p.line2.set({ 'x1': p.left, 'y1': p.top });
    p.line3 && p.line3.set({ 'x1': p.left, 'y1': p.top });
    p.line4 && p.line4.set({ 'x1': p.left, 'y1': p.top });
    canvas.renderAll();
  });
})();
	
	
	
	
	
	
	
});
