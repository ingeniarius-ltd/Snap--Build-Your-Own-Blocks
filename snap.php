<?php

// Include secret_hash, the same file included in ROS Robot
$secret_hash = file_get_contents('.secret_hash');

$client = "127.0.0.1";
$dest = "127.0.0.1";
$rand = "random";
$t = time();
$end = $t+120;
$level = "admin";

$string_hash = $secret_hash.$client.$dest.$rand.$t.$level.$end;
$hash = hash('sha512', $string_hash, false);

// ros service call local
//  $t = $t * 1000000000;
//  $end = $end * 1000000000;
//  echo 'rosservice call /ros_mac_authentication/authenticate "'.$hash.'" "'.$client.'" "'.$dest.'" "'.$rand.'" '.$t.' "'.$level.'" '.$end;

?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>Snap! Build Your Own Blocks</title>
		<link rel="shortcut icon" href="favicon.ico">
		<script type="text/javascript" src="morphic.js"></script>
		<script type="text/javascript" src="widgets.js"></script>
		<script type="text/javascript" src="blocks.js"></script>
		<script type="text/javascript" src="threads.js"></script>
		<script type="text/javascript" src="objects.js"></script>
		<script type="text/javascript" src="gui.js"></script>
		<script type="text/javascript" src="paint.js"></script>
		<script type="text/javascript" src="lists.js"></script>
		<script type="text/javascript" src="byob.js"></script>
		<script type="text/javascript" src="tables.js"></script>
		<script type="text/javascript" src="symbols.js"></script>
		<script type="text/javascript" src="xml.js"></script>
		<script type="text/javascript" src="store.js"></script>
		<script type="text/javascript" src="locale.js"></script>
		<script type="text/javascript" src="cloud.js"></script>
		<script type="text/javascript" src="sha512.js"></script>
		<script type="text/javascript" src="FileSaver.min.js"></script>
		<script type="text/javascript">
			var world;
			window.onload = function () {
				world = new WorldMorph(document.getElementById('world'));
                world.worldCanvas.focus();
				new IDE_Morph().openIn(world);
        loop();
			};
			function loop() {
        requestAnimationFrame(loop);
				world.doOneCycle();
			}
		</script>

        <script type="text/javascript" src="/ros/easeljs.min.js"></script>
        <script type="text/javascript" src="/ros/eventemitter2.min.js"></script>
        <script type="text/javascript" src="/ros/roslib.min.js"></script>
        <script type="text/javascript" src="/ros/keyboardteleop.js"></script>
        <script type="text/javascript" src="/ros/ros2d.min.js"></script>
        <script type="text/javascript" src="/ros/mjpegcanvas.min.js"></script>
        <script type="text/javascript" src="/ros/nav2d.min.js"></script>

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js"></script>

        <script>

            var hash = "<?php echo $hash; ?>";
            var client = "<?php echo $client; ?>";
            var dest = "<?php echo $dest; ?>";
            var rand = "<?php echo $rand; ?>";
            var t = <?php echo $t; ?>;
            var level = "<?php echo $level; ?>";
            var end = <?php echo $end; ?>;

            var blnStatus = false;
            var blnCamera = false;
            var ros = new ROSLIB.Ros();
            var teleop;

            function rosConnection() {

                if (!blnStatus) {
                    blnStatus = true;

//                    document.getElementById('map').style.display = '';
//                    document.getElementById('camera').style.display = '';
//
//                    document.getElementById('box_map').style.display = 'none';

                    // If there is an error on the backend, an 'error' emit will be emitted.
                    ros.on('error', function(error) {
                        console.log(error);
                    });

                    // Find out exactly when we made a connection.
                    ros.on('connection', function() {
                        console.log('Connection made!');

                    });

                    ros.on('close', function() {
                        console.log('Connection closed.');

                    });

                    // Create a connection to the rosbridge WebSocket server.
                    ros.connect('ws://172.16.1.126:9090');


                    // (mac, client, dest, rand, t, level, end)
                    ros.authenticate(hash, client, dest, rand, t, level, end );


                    /****************************
                     ********** TELEOP **********
                     ****************************/
                    teleop = new KEYBOARDTELEOP.Teleop({
                        ros : ros,
                        topic : '/cloud_cmd_vel'
                    });

//                    // Create a UI slider using JQuery UI.
//                    $('#speed-slider').slider({
//                        range : 'min',
//                        min : 0,
//                        max : 100,
//                        value : 25,
//                        slide : function(event, ui) {
//                            // Change the speed label.
//                            $('#speed-label').html('Speed: ' + ui.value + '%');
//                            // Scale the speed.
//                            teleop.scale = (ui.value / 100.0);
//                        }
//                    });
//
//                    // Set the initial speed .
//                    $('#speed-label').html('Speed: ' + ($('#speed-slider').slider('value')) + '%');
//                    teleop.scale = ($('#speed-slider').slider('value') / 100.0);


                    /*************************
                     ********** MAP **********
                     *************************/

//                var viewer_map = new ROS2D.Viewer({
//                    divID : 'map',
//                    width : 1020,
//                    height : 199
//                });
//
//                var gridClient = new ROS2D.OccupancyGridClient({
//                    ros : ros,
//                    rootObject : viewer_map.scene
//                });
//
//                gridClient.on('change', function(){
//                    viewer_map.scaleToDimensions(gridClient.currentGrid.width, gridClient.currentGrid.height);
//                });

//
//                        // Create the main viewer.
//                    var viewer = new ROS2D.Viewer({
//                            divID : 'map',
//                            width : 800,
//                            height : 199
//                        });
//
//
//                    // Setup the nav client.
//                    var nav = NAV2D.OccupancyGridClientNav({
//                        ros : ros,
//                        rootObject : viewer.scene,
//                        viewer : viewer,
//                        serverName : '/move_base'
//                    });


                    /*******************************
                     ********** LISTERNER **********
                     *******************************/
                    var listener = new ROSLIB.Topic({
                        ros : ros,
                        name : '/listener',
                        messageType : 'std_msgs/String'
                    });

                    listener.subscribe(function(message) {
                        console.log('Received message on ' + listener.name + ': ' + message.data);
                        //listener.unsubscribe();
                    });


                }
                else {
                    blnStatus = false;

                    // Close a connection to the rosbridge WebSocket server.
                    ros.close();

                    blnCamera = false;

//                    document.getElementById('map').innerHTML = '';
//                    document.getElementById('camera').src = '';
//
//                    document.getElementById('box_map').style.display = '';
//                    document.getElementById('box_camera').style.display = '';
//
//                    document.getElementById("buttonConnect").classList.remove('btn-danger');
//                    document.getElementById("buttonConnect").classList.add('btn-success');
//                    document.getElementById("buttonConnect").innerHTML="Connect";
                }

            }


            $( document ).ready(function() {
                rosConnection();
            });

        </script>

	</head>
	<body style="margin: 0;">
		<canvas id="world" tabindex="1" style="position: absolute;" />
	</body>
</html>
