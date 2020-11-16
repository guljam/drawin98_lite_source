var unsmoothedCanvas = document.getElementById("unsmoothed");
var smoothedCanvas = document.getElementById("smoothed");
var expsmoothedCanvas = document.getElementById("expsmoothed");
var smoothLength = 4;
 function drawLine(canvas, points) {
  var ctx = canvas.getContext("2d");
  var p0 = points[0];
  ctx.fillStyle = "black"
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  for(var i = 1; i < points.length; ++i) {
    var p = points[i];
    ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
}
 function clear(canvas) {
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
 function setupCanvas(canvas, smoothingFn, minDist) {
  var getPos = function(e) { return {x: e.pageX -canvas.offsetLeft, y: e.pageY -canvas.offsetTop}; }
  var dist = function(a,b) { var x = a.x-b.x; var y = a.y-b.y; return x*x+y*y; }
  clear(canvas);
  canvas.onmousedown = function (edown) {
    canvas.points = [];
    for(var i = 0; i < smoothLength+1; ++i) canvas.points.push(getPos(edown));
    canvas.onmousemove = function(e) {
      var p = getPos(e)
      var last = canvas.points[canvas.points.length-1];
      if(dist(p,last) > minDist) {
        canvas.points.push(p);
        smoothingFn(canvas.points);
        clear(canvas);
        drawLine(canvas, canvas.points);
      }
    }
  }
  canvas.onmouseup = function(e) {
    canvas.onmousemove = null;
  }
}
 setupCanvas(unsmoothedCanvas, function(ps) { }, 8);
setupCanvas(expsmoothedCanvas, function(ps) {
  var a = 0.2;
  var p = ps[ps.length-1]
  var p1 = ps[ps.length-2];
  ps[ps.length-1] = {x:p.x * a + p1.x * (1-a), y:p.y * a + p1.y * (1-a) }
}, 8);
 setupCanvas(smoothedCanvas, function(ps) {
  for(var i = 0; i < smoothLength; ++i) {
    var j = ps.length-i-2;
    var p0 = ps[j]
    var p1 = ps[j+1]
    var a = 0.2;
    var p = {x:p0.x * (1-a) + p1.x * a, y:p0.y * (1-a) + p1.y * a };
    ps[j] = p;
  }
}, 8);