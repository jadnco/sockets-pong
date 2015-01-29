/**
* public/js/classes/Game.js
*
* Game class; store players, properties and draw objects
*/

function Game() {
  // Public Properties
  this.s;
  this.ball;
  this.mPaddle;
  this.oPaddle;

  // Private Constants
  var W = 1200;
  var H = 600;
  var PAD = 50;

  var BLACK = 0;
  var WHITE = 255;
  var GREY = 100;
  
  var BALL_COLOR = WHITE;
  var BALL_SIZE = 10;

  var BALL_SPEED_X = 4;

  var PADDLE_W = 3;
  var PADDLE_H = 60;
  var PADDLE_COLOR = WHITE;

  var LINE_COLOR = GREY;
  
  var FONT = 'Menlo';
  var FONT_SIZE = 16;

  // Make sure this is public
  this.PADDLE_SPEED = 8;

  // Instantiate both players
  this.player = new Player(W, PAD);
  this.opponent = new Player(W, PAD);

  this.twoPlayers = false;

  /**
  * - Game initialization
  * - Set the canvas
  * - Instantiate the ball and paddles 
  */
  this.init = function(s) {
    this.s = s;

    this.player.s = this.s;
    this.opponent.s = this.s;

    // Instantiate the ball
    this.ball = new Ball(this.s, BALL_SIZE, BALL_COLOR);

    // Instantiate both paddles
    this.mPaddle = new Paddle(this.s, PADDLE_W, PADDLE_H, PADDLE_COLOR, H, PAD);
    this.oPaddle = new Paddle(this.s, PADDLE_W, PADDLE_H, PADDLE_COLOR, H, PAD);
  };

  /**
  * - Set the opponent properties
  */
  this.join = function(player) {
    this.opponent.setId(player.id);
    this.opponent.setName(player.name);
    this.opponent.setPos(player.pos);

    this.player.setPos(player.pos ? 0 : 1);

    // Check which side the opponent should be on
    if (this.opponent.pos === 0) {
      this.oPaddle.setX(PAD);
    } else {
      this.oPaddle.setX(W - PAD);
    }

    // Check which side the player should be on
    if (this.player.pos === 0) {
      this.mPaddle.setX(PAD);
    } else {
      this.mPaddle.setX(W - PAD);
    }

    this.twoPlayers = true;
  };

  /**
  * - Canvas setup
  */
  this.setup = function() {
    // Create canvas with given width/height
    this.s.createCanvas(W, H);
    this.s.rectMode(this.s.CORNER);
    this.s.background(BLACK);

    // Center the paddles
    this.mPaddle.setY(H / 2 - PADDLE_H / 2);
    this.oPaddle.setY(H / 2 - PADDLE_H / 2);

    // Center the ball
    this.ball.setX(W / 2 - BALL_SIZE / 2);
    this.ball.setY(H / 2 - BALL_SIZE / 2);
  };

  this.draw = function(x, y) {
    // Fill frame
    this.s.noStroke();
    this.s.fill(BLACK);
    this.s.rect(0, 0, W, H);

    // Set font family and name
    this.s.textFont(FONT);
    this.s.textSize(FONT_SIZE);
    
    // Set shape fill
    this.s.fill(WHITE);

    // Wait until both players are online to start
    if (!this.twoPlayers) {
      this.s.textAlign(this.s.CENTER);
      this.s.text('Waiting for another player', W / 2, H / 2);
    } else {
      this.s.stroke(LINE_COLOR);

      // Top line
      this.s.line(PAD, PAD, W - PAD, PAD);

      // Middle line
      this.s.line(W / 2, 0, W / 2, H - PAD);

      // Bottom line
      this.s.line(PAD, H - PAD, W - PAD, H - PAD);

      this.s.noStroke();

      // Player paddle positioning
      this.mPaddle.setY(this.mPaddle.pos.y + this.mPaddle.speed);
    
      // Check if paddle reaches canvas bounds
      if (this.mPaddle.pos.y < PAD) {
        this.mPaddle.setY(PAD);
      } else if (this.mPaddle.pos.y + this.mPaddle.height > H - PAD) {
        this.mPaddle.setY(H - PAD - this.mPaddle.height);
      }

      // Opponent paddle positioning
      this.oPaddle.setY(this.oPaddle.pos.y + this.oPaddle.speed);

      if (this.oPaddle.pos.y < PAD) {
        this.oPaddle.setY(PAD);
      } else if (this.oPaddle.pos.y + this.oPaddle.height > H - PAD) {
        this.oPaddle.setY(H - PAD - this.oPaddle.height);
      }

      // Ball out of bounds
      if (this.ball.pos.x >= W || this.ball.pos.x <= 0) {

        if (this.ball.pos.x >= W) {
          this.opponent.scored();
        } else {
          this.player.scored();
        }

        // Reset the game
        this.reset();
      }

      this.ball.setX(this.ball.pos.x + this.ball.speed.x);
      this.ball.setY(this.ball.pos.y + this.ball.speed.y);

      // Padding bounds
      if (this.ball.pos.y - this.ball.size / 2 < PAD ||
          this.ball.pos.y + this.ball.size / 2 > H - PAD) {

        this.ball.move(this.ball.pos, {
          x: this.ball.speed.x,
          y: this.ball.speed.y * -1
        });
      }

      // Opponent paddle intersection
      if (this.ball.pos.x - this.ball.size / 2 <= PAD &&
          this.ball.pos.x + this.ball.size / 2 > PAD) {

        if (this.ball.pos.y >= this.oPaddle.pos.y &&
            this.ball.pos.y <= this.oPaddle.pos.y + this.oPaddle.height) {

          var hit = this.ball.pos.y - (this.oPaddle.pos.y + this.oPaddle.height / 2);

          this.ball.move(this.ball.pos, {
            x: this.ball.speed.x * -1,
            y: this.ball.speed.y + (hit / (this.oPaddle.height / 2)) * 2
          });
        }
      }

      // Player paddle intersection
      if (this.ball.pos.x + this.ball.size / 2 >= W - PAD &&
          this.ball.pos.x - this.ball.size / 2 < W - PAD) {

        if (this.ball.pos.y >= this.mPaddle.pos.y &&
            this.ball.pos.y <= this.mPaddle.pos.y + this.mPaddle.height) {

          var hit = this.ball.pos.y - (this.mPaddle.pos.y + this.mPaddle.height / 2);

          this.ball.move(this.ball.pos, {
            x: this.ball.speed.x * -1,
            y: this.ball.speed.y + (hit / (this.mPaddle.height / 2)) * 2
          });
        }
      }

      // Draw everything
      this.player.draw();
      this.opponent.draw();
      this.mPaddle.draw();
      this.oPaddle.draw();
      this.ball.draw();
    }
  };

  /**
  * - Reset the game by centering the ball and paddles
  */
  this.reset = function() {
    // Set ball in center of canvas
    this.ball.move({
      x: W / 2 - BALL_SIZE / 2,
      y: H / 2 - BALL_SIZE / 2
    }, {
      x: BALL_SPEED_X,
      y: 0
    });

    // Center the paddles
    this.mPaddle.setY(H / 2 - PADDLE_H / 2);
    this.oPaddle.setY(H / 2 - PADDLE_H / 2);
  };
}