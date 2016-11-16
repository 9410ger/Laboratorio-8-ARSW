var stompClient = null;

function Point(x,y){
    this.x=x;
    this.y=y;
}

var conectar=false;

function connect() {
    var socket = new SockJS('/stompendpoint');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        
        stompClient.subscribe('/topic/newpolygon', function (data) {
           console.log(data);
           var co=JSON.parse(data.body);
           dibujarPoligono(co);
        });
        stompClient.subscribe('/topic/newpoint', function (data) {
           console.log(data);
           var co=JSON.parse(data.body);
           dibujarCirculo(co.x,co.y);
        });
    });
    conectar=true;
}

sendPoint = function(){
    var x=0;
    var y=0;
    x= parseInt($('#cx').val());
    y= parseInt($('#cy').val());
    var p= new Point(x,y);
    stompClient.send("/topic/newpoint", {}, JSON.stringify(p));
};

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
    conectar=false;
}

dibujarCirculo = function(x,y){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, 2 * Math.PI);
    ctx.stroke();
};


dibujarPoligono = function(arr){
    console.info("Entro a dibujar el poligono");
    var c = document.getElementById("myCanvas");
    var c2 = c.getContext("2d");
    c2.beginPath();
    c2.lineTo(arr[0].x, arr[0].y);
    c2.lineTo(arr[1].x, arr[1].y);
    c2.lineTo(arr[2].x, arr[2].y);
    c2.lineTo(arr[3].x, arr[3].y);
    c2.closePath();
    c2.stroke();
};

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}

 


$(document).ready(
        function () {
            //connect();
            console.info('connecting to websockets');
            var canvas = document.getElementById('myCanvas');
            canvas.addEventListener('mousedown', function (evt) {
                var mousePos = getMousePos(canvas, evt);
                var p = new Point(mousePos.x,mousePos.y);
                if(conectar){
                    stompClient.send("/app/newpoint", {}, JSON.stringify(p));
                    stompClient.send("/app/newpolygon", {}, JSON.stringify(p));
                 }
            }, false);
                canvas.addEventListener("touchsend", function (evt) {
                var mousePos = getTouchPos(canvas, evt);
                var p1 = new Point(mousePos.x,mousePos.y);
                if(conectar){
                    stompClient.send("/app/newpoint", {}, JSON.stringify(p1));
                    stompClient.send("/app/newpolygon", {}, JSON.stringify(p1));
                }
            
        },false);
    }
);
