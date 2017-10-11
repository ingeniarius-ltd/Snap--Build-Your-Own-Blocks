/**
 * @author Russell Toris - rctoris@wpi.edu
 */

var KEYBOARDTELEOP = KEYBOARDTELEOP || {
  REVISION : '0.4.0-SNAPSHOT'
};

/**
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * Manages connection to the server and all interactions with ROS.
 *
 * Emits the following events:
 *   * 'change' - emitted with a change in speed occurs
 *
 * @constructor
 * @param options - possible keys include:
 *   * ros - the ROSLIB.Ros connection handle
 *   * topic (optional) - the Twist topic to publish to, like '/cmd_vel'
 *   * throttle (optional) - a constant throttle for the speed
 */


/** Function can be called from outside **/
var handleKey;

KEYBOARDTELEOP.Teleop = function(options) {

  var that = this;
  options = options || {};
  var ros = options.ros;
  var topic = options.topic || '/cmd_vel';
  // permanent throttle
  var throttle = options.throttle || 1.0;

  // used to externally throttle the speed (e.g., from a slider)
  this.scale = 1.0;

  // linear x and y movement and angular z movement
  var x = 0;
  var y = 0;
  var z = 0;

  var cmdVel = new ROSLIB.Topic({
    ros : ros,
    name : topic,
    messageType : 'geometry_msgs/Twist'
  });

  // sets up a key listener on the page used for keyboard teleoperation
  handleKey = function(keyCode, keyDown) {

    // used to check for changes in speed
    var oldX = x;
    var oldY = y;
    var oldZ = z;
    
    var pub = true;

    var speed = 0;
    // throttle the speed by the slider and throttle constant
    if (keyDown === true) {
      speed = throttle * that.scale;
    }
    // check which key was pressed
    switch (keyCode) {
      case 65:
        // turn left
        z = 1 * speed;
        break;
      case 87:
        // up
        x = 0.5 * speed;
        break;
      case 68:
        // turn right
        z = -1 * speed;
        break;
      case 83:
        // down
        x = -0.5 * speed;
        break;
      case 69:
        // strafe right
        y = -0.5 * speed;
        break;
      case 81:
        // strafe left
        y = 0.5 * speed;
        break;
      default:
        pub = false;
    }

    // publish the command
    if (pub === true) {
      var twist = new ROSLIB.Message({
        angular : {
          x : 0,
          y : 0,
          z : z
        },
        linear : {
          x : x,
          y : y,
          z : z
        }
      });
      cmdVel.publish(twist);

      // check for changes
      if (oldX !== x || oldY !== y || oldZ !== z) {
        that.emit('change', twist);
      }
    }
  };

  // var button = document.getElementsByClassName('btn-teleop');
  // var buttonQ; var buttonW; var buttonE;
  // var buttonA; var buttonS; var buttonD;
  //
  //
  // // Q
  //   button[0].addEventListener('touchstart', function() {
  //       buttonQ = setInterval(function(){ handleKey(81, true); }, 100);
  //   }, false);
  //   button[0].addEventListener('touchend', function() {
  //       clearInterval(buttonQ);
  //       clearInterval(buttonW);
  //       clearInterval(buttonE);
  //       clearInterval(buttonA);
  //       clearInterval(buttonS);
  //       clearInterval(buttonD);
  //       handleKey(81, false);
  //   }, false);
  //   button[0].addEventListener('mousedown', function() {
  //       buttonQ = setInterval(function(){ handleKey(81, true); }, 100);
  //   }, false);
  //   button[0].addEventListener('mouseup', function() {
  //       clearInterval(buttonQ);
  //       clearInterval(buttonW);
  //       clearInterval(buttonE);
  //       clearInterval(buttonA);
  //       clearInterval(buttonS);
  //       clearInterval(buttonD);
  //       handleKey(81, false);
  //   }, false);
  //
  // // W
  //   button[1].addEventListener('touchstart', function() {
  //       buttonW = setInterval(function(){ handleKey(87, true); }, 100);
  //   }, false);
  //   button[1].addEventListener('touchend', function() {
  //       clearInterval(buttonQ);
  //       clearInterval(buttonW);
  //       clearInterval(buttonE);
  //       clearInterval(buttonA);
  //       clearInterval(buttonS);
  //       clearInterval(buttonD);
  //       handleKey(87, false);
  //   }, false);
  //   button[1].addEventListener('mousedown', function() {
  //       buttonW = setInterval(function(){ handleKey(87, true); }, 100);
  //   }, false);
  //   button[1].addEventListener('mouseup', function() {
  //       clearInterval(buttonQ);
  //       clearInterval(buttonW);
  //       clearInterval(buttonE);
  //       clearInterval(buttonA);
  //       clearInterval(buttonS);
  //       clearInterval(buttonD);
  //       handleKey(87, false);
  //   }, false);
  //
  // // E
  //   button[2].addEventListener('touchstart', function() {
  //       buttonE = setInterval(function(){ handleKey(69, true); }, 100);
  //   }, false);
  //   button[2].addEventListener('touchend', function() {
  //       clearInterval(buttonQ);
  //       clearInterval(buttonW);
  //       clearInterval(buttonE);
  //       clearInterval(buttonA);
  //       clearInterval(buttonS);
  //       clearInterval(buttonD);
  //       handleKey(69, false);
  //   }, false);
  //   button[2].addEventListener('mousedown', function() {
  //       buttonE = setInterval(function(){ handleKey(69, true); }, 100);
  //   }, false);
  //   button[2].addEventListener('mouseup', function() {
  //       clearInterval(buttonQ);
  //       clearInterval(buttonW);
  //       clearInterval(buttonE);
  //       clearInterval(buttonA);
  //       clearInterval(buttonS);
  //       clearInterval(buttonD);
  //       handleKey(69, false);
  //   }, false);
  //
  //
  // // A
  //   button[3].addEventListener('touchstart', function() {
  //       buttonA = setInterval(function(){ handleKey(65, true); }, 100);
  //   }, false);
  //   button[3].addEventListener('touchend', function() {
  //       clearInterval(buttonQ);
  //       clearInterval(buttonW);
  //       clearInterval(buttonE);
  //       clearInterval(buttonA);
  //       clearInterval(buttonS);
  //       clearInterval(buttonD);
  //       handleKey(65, false);
  //   }, false);
  //   button[3].addEventListener('mousedown', function() {
  //       buttonA = setInterval(function(){ handleKey(65, true); }, 100);
  //   }, false);
  //   button[3].addEventListener('mouseup', function() {
  //       clearInterval(buttonQ);
  //       clearInterval(buttonW);
  //       clearInterval(buttonE);
  //       clearInterval(buttonA);
  //       clearInterval(buttonS);
  //       clearInterval(buttonD);
  //       handleKey(65, false);
  //   }, false);
  //
  // // S
  //   button[4].addEventListener('touchstart', function() {
  //       buttonS = setInterval(function(){ handleKey(83, true); }, 100);
  //   }, false);
  //   button[4].addEventListener('touchend', function() {
  //       clearInterval(buttonQ);
  //       clearInterval(buttonW);
  //       clearInterval(buttonE);
  //       clearInterval(buttonA);
  //       clearInterval(buttonS);
  //       clearInterval(buttonD);
  //       handleKey(83, false);
  //   }, false);
  //   button[4].addEventListener('mousedown', function() {
  //       buttonS = setInterval(function(){ handleKey(83, true); }, 100);
  //   }, false);
  //   button[4].addEventListener('mouseup', function() {
  //       clearInterval(buttonQ);
  //       clearInterval(buttonW);
  //       clearInterval(buttonE);
  //       clearInterval(buttonA);
  //       clearInterval(buttonS);
  //       clearInterval(buttonD);
  //       handleKey(83, false);
  //   }, false);
  //
  // // D
  //   button[5].addEventListener('touchstart', function() {
  //       buttonD = setInterval(function(){ handleKey(68, true); }, 100);
  //   }, false);
  //   button[5].addEventListener('touchend', function() {
  //       clearInterval(buttonQ);
  //       clearInterval(buttonW);
  //       clearInterval(buttonE);
  //       clearInterval(buttonA);
  //       clearInterval(buttonS);
  //       clearInterval(buttonD);
  //       handleKey(68, false);
  //   }, false);
  //   button[5].addEventListener('mousedown', function() {
  //       buttonD = setInterval(function(){ handleKey(68, true); }, 100);
  //   }, false);
  //   button[5].addEventListener('mouseup', function() {
  //       clearInterval(buttonQ);
  //       clearInterval(buttonW);
  //       clearInterval(buttonE);
  //       clearInterval(buttonA);
  //       clearInterval(buttonS);
  //       clearInterval(buttonD);
  //       handleKey(68, false);
  //   }, false);


    

  // // handle the key
  // var body = document.getElementsByTagName('body')[0];
  // body.addEventListener('keydown', function(e) {
  //   handleKey(e.keyCode, true);
  // }, false);
  // body.addEventListener('keyup', function(e) {
  //   handleKey(e.keyCode, false);
  // }, false);
};
KEYBOARDTELEOP.Teleop.prototype.__proto__ = EventEmitter2.prototype;
