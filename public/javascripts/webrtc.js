'use strict';

/**
 * @file Write a short description here.
 */



console.log('starting webrtc.js');

var socket = io();





/*
var polyRTCPeerConnection =
    webkitRTCPeerConnection || RTCPeerConnection ||
    mozRTCPeerConnection || msRTCPeerConnection;

var servers = {
    iceServers: [
        {url: "stun:23.21.150.121"},
        {url: "stun:stun.1.google.com:19302"}
    ]
};


var conn = new polyRTCPeerConnection(servers);



function handleVideoStream(stream) {
    var video = document.querySelector('video');
    video.src = window.URL.createObjectURL(stream);

    video.onloadedmetadata = function(e) {
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



navigator.getUserMedia  =
    navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;

navigator.getUserMedia({video: true}, handleVideoStream, handleStreamError);

navigator.getUserMedia({audio:true}, handleAudioStream, handleStreamError);

*/