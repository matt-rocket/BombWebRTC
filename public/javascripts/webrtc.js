'use strict';

/**
 * @file Write a short description here.
 */

console.log('starting webrtc.js');

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

var handleVideoStream = function(localMediaStream) {
    var video = document.querySelector('video');
    video.src = window.URL.createObjectURL(localMediaStream);

    video.onloadedmetadata = function(e) {
        //     Ready to go. Do some stuff.
        console.log('video loaded!');
        console.log(localMediaStream);
    };

};

navigator.getUserMedia  =
    navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;

navigator.getUserMedia({video: true, audio: true}, handleVideoStream, function(err) {
    console.log('Error');
});