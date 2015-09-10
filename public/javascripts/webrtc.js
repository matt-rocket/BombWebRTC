'use strict';

/**
 * @file Write a short description here.
 */






function createSignallingChannel() {
    var socket = io();
    // setup signalling channel
    var signalChannel = {
        send: function (msg) {
            socket.emit('message', msg);
        },
        onmessage: function (msg) {
            var signal = JSON.parse(msg);
            if (signal.sdp) {
                gotSDP(signal.sdp);
            }
            else if (signal.ice) {
                console.log(' ICE');
            }
            console.log('received signal', signal);
        }
    };
    socket.on('message', signalChannel.onmessage);
    return signalChannel;
};


function handleVideoStream(stream) {
    var video = document.querySelector('video');
    video.src = window.URL.createObjectURL(stream);

    video.onloadedmetadata = function (e) {
        //     Ready to go. Do some stuff.
        console.log('video loaded!');
        console.log(stream);
    };
};


function handleAudioStream(stream) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext();

    // Create an AudioNode from the stream
    var mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Connect it to destination to hear yourself
    // or any other node for processing!
    mediaStreamSource.connect(audioContext.destination);
}


function handleStreamError(err) {
    console.log('Error', err);
}


// CONSTANTS

var polyRTCPeerConnection =
    webkitRTCPeerConnection || RTCPeerConnection ||
    mozRTCPeerConnection || msRTCPeerConnection;


var servers = {
    iceServers: [
        {url: "stun:23.21.150.121"},
        {url: "stun:stun.1.google.com:19302"}
    ]
};

servers = {
    iceServers: [
        {urls: "stun:23.21.150.121"},
        {urls: "stun:stun.l.google.com:19302"},
        {urls: "turn:numb.viagenie.ca", credential: "webrtcdemo", username: "louis%40mozilla.com"}
    ]
};

var connectionInfo = {
    pc: null
}

var game_room = 42;


// DOING IT

var sc = createSignallingChannel();

function gotIceCandidate(event) {
    console.log('got ICE');
}

function gotSDP(desc) {
    console.log('got SDP', desc);
    console.log('object', new RTCSessionDescription(desc));
    connectionInfo.pc.setRemoteDescription(new RTCSessionDescription(desc), function() {
        console.log('setting remote SDP');
        connectionInfo.pc.createAnswer(gotDescription, createAnswerError);
    }, function(err) {
        console.log('oohh noooes!', err);
    });
}

function gotDescription(desc) {
    connectionInfo.pc.setLocalDescription(desc, function () {

        var signal = JSON.stringify({sdp: desc});
        console.log('setting local SDP');
        console.log('sending signal', JSON.parse(signal));

        sc.send(signal);
    });
}


function createAnswerError() {
    throw Error('Could not create answer');
}


function start(isCaller) {
    connectionInfo.pc = new polyRTCPeerConnection(servers);
    connectionInfo.pc.onicecandidate = gotIceCandidate;

    if (isCaller) {
        connectionInfo.pc.createOffer(gotDescription);
    }
}




navigator.getUserMedia =
    navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;


start(true);

// navigator.getUserMedia({video: true}, handleVideoStream, handleStreamError);

// navigator.getUserMedia({audio:true}, handleAudioStream, handleStreamError);


/*

 var signalingChannel = createSignalingChannel();
 var pc;
 var configuration = ...;

 // run start(true) to initiate a call
 function start(isCaller) {
 pc = new RTCPeerConnection(configuration);

 // send any ice candidates to the other peer
 pc.onicecandidate = function (evt) {
 signalingChannel.send(JSON.stringify({ "candidate": evt.candidate }));
 };

 // once remote stream arrives, show it in the remote video element
 pc.onaddstream = function (evt) {
 remoteView.src = URL.createObjectURL(evt.stream);
 };

 // get the local stream, show it in the local video element and send it
 navigator.getUserMedia({ "audio": true, "video": true }, function (stream) {
 selfView.src = URL.createObjectURL(stream);
 pc.addStream(stream);

 if (isCaller)
 pc.createOffer(gotDescription);
 else
 pc.createAnswer(pc.remoteDescription, gotDescription);

 function gotDescription(desc) {
 pc.setLocalDescription(desc);
 signalingChannel.send(JSON.stringify({ "sdp": desc }));
 }
 });
 }

 signalingChannel.onmessage = function (evt) {
 if (!pc)
 start(false);

 var signal = JSON.parse(evt.data);
 if (signal.sdp)
 pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
 else
 pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
 };

 */
