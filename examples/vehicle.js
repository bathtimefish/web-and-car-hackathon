
var roomID = "hogehogehoge"; //ユニークな文字列に変更して下さい

var logPaneSelector = '#log';

window.onload = function () {
  $("#room-id").text(roomID);
  var msg = {"roomID":roomID, "data":"NOT REQUIRED"};
  socket.emit('joinRoom', JSON.stringify(msg));
};

var buffers = [];

var setBuffer = function(v) {
    buffers.unshift(v);
    $(logPaneSelector).text(buffers.join(", "));
};

var convert = {
    'speed' : function(v) {
        if(v > 0) setBuffer('speed is ' + v);
        if(v <= 0) setBuffer('car stopped');
    },
    'engine' : function(v) {
        if(v > 0) setBuffer('engine speed is ' + v);
        if(v <= 0) setBuffer('engine stopped');
    },
    'accel' : function(v) {
        if(v > 0) setBuffer('accel value is ' + v);
        if(v <= 0) setBuffer('accel is free');
    },
    /*
    'brakeOp' : function(v) {
        setBuffer('brake operation is ' + v);
        if(v) setBuffer('brake is on');
        if(!v) setBuffer('brake is off');
    },
    */
    /*
    'wheel' : function(v) {
        setBuffer('brake operation is ' + v);
        if(v) setBuffer('brake is on');
        if(!v) setBuffer('brake is off');
    }
    */
};


/* スピード */
var vehicleSpeedSub = navigator.vehicle.vehicleSpeed.subscribe(function(e) {
  console.log("vehicle speed changed to: " + e.speed);
  convert.speed(e.speed);
});

/* タコ */
var engineSpeedSub = navigator.vehicle.engineSpeed.subscribe(function(e) {
  console.log("engine speed changed to: " + e.speed);
  convert.engine(e.speed);
});

/* アクセルペダル */
var accelerationPedalPositionSub = navigator.vehicle.acceleratorPedalPosition.subscribe(function(e) {
  console.log("accel value changed to: " + e.value);
  convert.accel(e.value);
});

/* ブレーキ操作 */
/*
var brakeOperationSub = navigator.vehicle.brakeOperation.subscribe(function(e) {
  console.log("brakeOperation changed to: " + e.brakePedalDepressed);
  convert.brakeOp(e.e.brakePedalDepressed);
});
*/

/* ハンドル */
/*
var steeringWheelSub = navigator.vehicle.steeringWheel.subscribe(function(e) {
  console.log("whieel --");
  console.log(e);
});
*/

