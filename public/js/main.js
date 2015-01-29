/**
* public/main.js
*
* Instantiation of game, sketch and player
*/

// Instantiate the game
var pong = new Game();

// Initialize socket.io
var io = io();

// Start socket connection
// Chagen x.x.x.x to network ip
var socket = io.connect('x.x.x.x:8080');

// Catch start button click event
document.getElementById('player-name-submit').addEventListener('click', function(e) {
  // Stop submit redirection
  e.preventDefault();
  
  // Set player name to input box value
  pong.player.name = document.getElementById('player-name-input').value.trim();

  if (pong.player.name.length > 0) {
    this.parentNode.parentNode.className += ' hidden';
    document.getElementById("canvas-container").style.display = "block";

    // Join game
    join();
  } else {
    document.getElementById('name-error').innerText = 'Please enter your name.';
  }
  
});

// Prevent touch movement on iOS
document.ontouchmove = function (e) {
  e.preventDefault();
};

var join = function() {
  pong.player.setId(socket.io.engine.id);
  pong.player.setPos(0);

  socket.emit('join', pong.player);

  // Start the sketch
  var play = new p5(sketch, 'canvas-container');
};
