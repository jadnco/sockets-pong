/**
* public/js/classes/Ball.js
*
* Ball class; set ball properties and draw
*/
function Ball(sketch, size, color) {
  // Properties
  this.size = size;
  this.color = color;

  this.pos = {
    x: 0,
    y: 0
  };

  this.speed = {
    x: 4,
    y: 0
  };

  // Methods
  this.setPos = function(pos) {
    this.pos = pos;
  };

  this.setX = function(x) {
    this.pos.x = x;
  };

  this.setY = function(y) {
    this.pos.y = y;
  };

  this.setSpeed = function(speed) {
    this.speed = speed;
  };

  this.setSpeedX = function(sx) {
    this.speed.x = sx;
  };

  this.setSpeedY = function(sy) {
    this.speed.y = sy;
  };

  /**
  * - Set position and speed/direction of ball
  * - Emit the new properties
  */
  this.move = function(pos, speed) {
    this.speed = speed
    this.pos = pos;

    socket.emit('ballMove', {
      speed : {
        x: this.speed.x,
        y: this.speed.y
      },
      pos : {
        x: this.pos.x,
        y: this.pos.y
      }
    });
  };

  /**
  * - Draw the ball to the canvas
  */
  this.draw = function() {
    sketch.push();
    sketch.noStroke();
    sketch.fill(this.color);
    sketch.ellipse(this.pos.x, this.pos.y, this.size, this.size);
    sketch.pop();
  };
}