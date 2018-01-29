// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var child_process = require("child_process");
var path = require("path");

var ipcRenderer = require('electron').ipcRenderer;
var tvbus = require("electron").remote.getGlobal("tvbus");

// events listeners
ipcRenderer.on("tvbus-init", function(event, args){
    console.log("[Render] tvbus-init:", args)
    document.getElementById('info').innerHTML = "Ready ...";
})

ipcRenderer.on("tvbus-start", function(event, args){
    console.log("[Render] tvbus-start:", args)
})

ipcRenderer.on("tvbus-prepared", function(event, url){
    loadStream(url);
})

ipcRenderer.on("tvbus-stats", function(event, stats){
    var buffer = stats.split(" ")[0]
    var dlrate = parseInt(stats.split(" ")[1] * 8 / 1000) + " Kbps"

    document.getElementById('info').innerHTML = buffer;
    document.getElementById('dl-rate').innerHTML = dlrate;
})

ipcRenderer.on("tvbus-stop", function(event, code){
    document.getElementById('info').innerHTML = code;
})


// web page actions
document.getElementById('2').onclick = function() {
    stopChannel()
    tvbus.startChannel("tvbus://1vXojEJ9g5KcBSLLUdFZRrHmgupYY8LKJ4JChE1JZTiu7jEHGS")
}

document.getElementById('3').onclick = function() {
    stopChannel()
    tvbus.startChannel("tvbus://1gXL3fdwq3BU1npMkHLB2XjRPmrAaVXg8ND7LiHTN6xZNxC8fq")
}

// access code channel
// document.getElementById('4').onclick = function() {
//     stopChannel()
//     tvbus.startChannel("tvbus://1vXH1gDoDaNBoC1Fs9UX8BrREtbdm18kgmjBcbZvQqTedNZtGXzyXZDxSjSgF", "1234")
// }


var Clappr = require("clappr")
var player = null;

// play the stream
function loadStream(url) {
    player = new Clappr.Player({
        source: url, 
        parentId: "#player",
        width: 800,
        height: 450,
        autoPlay: true,
    });
}

// 
var stopChannel = function() {
    if(player != null) {
        player.stop()
        player.destroy()
    }
    player = null;
}