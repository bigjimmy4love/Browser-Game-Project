var Ball = function( ){
    // List of variables only the object can see (private variables).
    var velocity = [0,0];
    var position = [0,0];
    var element = $('#ball');
    var paused = false;
    // Method that moves the ball based on its velocity. This method is only used
    // internally and will not be made accessible outside of the object.
    function move(t) {
    }
    // Update the state of the ball, which for now just checks
    // if the play is paused and moves the ball if it is not.
    // This function will be provided as a method on the object.
    function update(t) {
      // First the motion of the ball is handled
      if(!paused) {
        move(t);
      }
    }
    // Pause the ball motion.
    function pause() {
      paused = true;
    }
    // Start the ball motion.
    function start() {
      paused = false;
    }
    // Now explicitly set what consumers of the Ball object can use.
    // Right now this will just be the ability to update the state of the ball,
    // and start and stop the motion of the ball.
    return {
      update:       update,
      pause:        pause,
      start:        start,
  }

  var ball = Ball();

  var lastUpdate = 0;
var ball = Ball();

function update(time) {
  var t = time - lastUpdate;
  lastUpdate = time;
  ball.update(t);
  requestAnimationFrame(update);
}

requestAnimationFrame(update);

var ball;
var lastUpdate;
$(document).ready(function() {
  lastUpdate = 0;
  ball = Ball();
  requestAnimationFrame(update);
});

var position = [300, 300];
var velocity = [-1, -1];
var move = function(t) {
  position[0] += velocity[0];
  position[1] += velocity[1];
  element.css('left', position[0] + 'px');
  element.css('top', position[1] + 'px');
}

var Player = function (elementName, side) {
    var position = [0,0];
    var element = $('#'+elementName);
    var move = function(y) {
    }
    return {
      move: move,
      getSide:      function()  { return side; },
      getPosition:  function()  { return position; }
    }
  }

  var move = function(y) {
    // Adjust the player's position.
    position[1] += y;
    // If the player is off the edge of the screen, move it back.
    if (position[1] <= 0)  {
      position[1] = 0;
    }
    // The height of the player is 128 pixels, so stop it before any
    // part of the player extends off the screen.
    if (position[1] >= innerHeight - 128) {
      position[1] = innerHeight - 128;
    }
    // If the player is meant to stick to the right side, set the player position
    // to the right edge of the screen.
    if (side == 'right') {
      position[0] = innerWidth - 128;
    }
    // Finally, update the player's position on the page.
    element.css('left', position[0] + 'px');
    element.css('top', position[1] + 'px');
  }

  player = Player('player', 'left');
player.move(0);
opponent = Player('opponent', 'right');
opponent.move(0);

var distance = 24;  // The amount to move the player each step.
$(document).ready(function() {
  lastUpdate = 0;
  player = Player('player', 'left');
  player.move(0);
  opponent = Player('opponent', 'right');
  opponent.move(0);
  ball = Ball();
  // pointerdown is the universal event for all types of pointers -- a finger,
  // a mouse, a stylus and so on.
  $('#up')    .bind("pointerdown", function() {player.move(-distance);});
  $('#down')  .bind("pointerdown", function() {player.move(distance);});
  requestAnimationFrame(update);
});
$(document).keydown(function(event) {
  var event = event || window.event;
  // This code converts the keyCode (a number) from the event to an uppercase
  // letter to make the switch statement easier to read.
  switch(String.fromCharCode(event.keyCode).toUpperCase()) {
    case 'A':
      player.move(-distance);
      break;
    case 'Z':
      player.move(distance);
      break;
  }
  return false;
});

var move = function(t) {
    // If there is an owner, move the ball to match the owner's position.
    if (owner !== undefined) {
      var ownerPosition = owner.getPosition();
      position[1] = ownerPosition[1] + 64;
      if (owner.getSide() == 'left') {
        position[0] = ownerPosition[0] + 64;
      } else {
        position[0] = ownerPosition[0];
      }
    // Otherwise, move the ball using physics. Note the horizontal bouncing
    // has been removed -- ball should pass by a player if it
    // isn't caught.
    } else {
      // If the ball hits the top or bottom, reverse the vertical speed.
      if (position[1] - 32 <= 0 || position[1] + 32 >= innerHeight) {
        velocity[1] = -velocity[1];
      }
      position[0] += velocity[0];
      position[1] += velocity[1];
    }
    element.css('left', (position[0] - 32) + 'px');
    element.css('top',  (position[1] - 32) + 'px');
  }

  return {
    move: move,
    getSide:      function()  { return side; },
    getPosition:  function()  { return position; }
  }

  var update = function(t) {
    // First the motion of the ball is handled.
    if(!paused) {
        move(t);
    }
    // The ball is under control of a player, no need to update.
    if (owner !== undefined) {
        return;
    }
    // First, check if the ball is about to be grabbed by the player.
    var playerPosition = player.getPosition();
      if (position[0] <= 128 &&
          position[1] >= playerPosition[1] &&
          position[1] <= playerPosition[1] + 128) {
        console.log("Grabbed by player!");
        owner = player;
    }
    // Then the opponent...
    var opponentPosition = opponent.getPosition();
      if (position[0] >= innerWidth - 128 &&
          position[1] >= opponentPosition[1] &&
          position[1] <= opponentPosition[1] + 128) {
        console.log("Grabbed by opponent!");
        owner = opponent;
    }

    var aim = 0;
var fire = function() {
  // Safety check: if the ball doesn't have an owner, don't not mess with it.
  if (ball.getOwner() !== this) {
    return;
  }
  var v = [0,0];
  // Depending on the side the player is on, different directions will be thrown.
  // The ball should move at the same speed, regardless of direction --
  // with some math you can determine that moving .707 pixels on the
  // x and y directions is the same speed as moving one pixel in just one direction.
  if (side == 'left') {
    switch(aim) {
    case -1:
      v = [.707, -.707];
      break;
    case 0:
      v = [1,0];
      break;
    case 1:
      v = [.707, .707];
    }
  } else {
    switch(aim) {
    case -1:
      v = [-.707, -.707];
      break;
    case 0:
      v = [-1,0];
      break;
    case 1:
      v = [-.707, .707];
    }
  }
  ball.setVelocity(v);
  // Release control of the ball.
  ball.setOwner(undefined);
}
// The rest of the Ball definition code goes here...
return {
  move: move,
  fire: fire,
  getSide:      function()  { return side; },
  setAim:       function(a) { aim = a; },
  getPosition:  function()  { return position; },
}

$(document).keydown(function(event) {
    var event = event || window.event;
    switch(String.fromCharCode(event.keyCode).toUpperCase()) {
      case 'A':
        player.move(-distance);
        break;
      case 'Z':
        player.move(distance);
        break;
      case 'K':
        player.setAim(-1);
        break;
      case 'M':
        player.setAim(1);
        break;
      case ' ':
        player.fire();
        break;
    }
    return false;
  });
  $(document).keyup(function(event) {
    var event = event || window.event;
    switch(String.fromCharCode(event.keyCode).toUpperCase()) {
      case 'K':
      case 'M':
        player.setAim(0);
        break;
    }
    return false;
  });

  $('#left')  .bind("pointerdown", function() {player.setAim(-1);});
$('#right') .bind("pointerdown", function() {player.setAim(1);});
$('#left')  .bind("pointerup",   function() {player.setAim(0);});
$('#right') .bind("pointerup",   function() {player.setAim(0);});
$('body')   .bind("pointerdown", function() {player.fire();});

function checkScored() {
    if (position[0] <= 0) {
      pause();
      $(document).trigger('ping:opponentScored');
    }
    if (position[0] >= innerWidth) {
      pause();
      $(document).trigger('ping:playerScored');
    }
  }

  $(document).on('ping:playerScored', function(e) {
    console.log('player scored!');
    score[0]++;
    $('#playerScore').text(score[0]);
    ball.setOwner(opponent);
    ball.start();
  });
  $(document).on('ping:opponentScored', function(e) {
    console.log('opponent scored!');
    score[1]++;
    $('#opponentScore').text(score[1]);
    ball.setOwner(player);
    ball.start();
  });


function AI(playerToControl) {
    var ctl = playerToControl;
    var State = {
      WAITING: 0,
      FOLLOWING: 1,
      AIMING: 2
    }
    var currentState = State.FOLLOWING;
  }

  function update() {
    switch (currentState) {
      case State.FOLLOWING:
        // Do something to follow the ball.
        break;
      case State.WAITING:
        // Do something to wait.
        break;
      case State.AIMING:
        // Do something to aim.
        break;
    }
  }

  function moveTowardsBall() {
    // Move the same distance the player would move, to make it fair.
    if(ball.getPosition()[1] >= ctl.getPosition()[1] + 64) {
      ctl.move(distance);
    } else {
      ctl.move(-distance);
    }
  }
  function update() {
    switch (currentState) {
      case State.FOLLOWING:
        moveTowardsBall();
        currentState = State.WAITING;
      case State.WAITING:
        setTimeout(function() {
          currentState = State.FOLLOWING;
        }, 400);
        break;
      }
    }
  }

  function update(time) {
    var t = time - lastUpdate;
    lastUpdate = time;
    ball.update(t);
    ai.update();
    requestAnimationFrame(update);
  }

  function repeat(cb, cbFinal, interval, count) {
    var timeout = function() {
      repeat(cb, cbFinal, interval, count-1);
    }
    if (count <= 0) {
      cbFinal();
    } else {
      cb();
      setTimeout(function() {
        repeat(cb, cbFinal, interval, count-1);
      }, interval);
    }
  }
  
  function aimAndFire() {
  
    // Repeat the motion action 5 to 10 times.
  
    var numRepeats = Math.floor(5 + Math.random(5));
    function randomMove() {
      if (Math.random() > .5) {
        ctl.move(-distance);
      } else {
        ctl.move(distance);
      }
    }
  
    function randomAimAndFire() {
  
      var d = Math.floor( Math.random(3 - 1) );
      opponent.setAim(d);
      opponent.fire();
  
      // Finally, set the state to FOLLOWING.
  
      currentState = State.FOLLOWING;
    }
  
    repeat(randomMove, randomAimAndFire, 250, numRepeats);
  
  }}
