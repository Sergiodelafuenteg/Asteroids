var Fin = false;
var shapes = [];
var asteroids = [];
var lasers = [];
var canvas;
var ctx;
var points=0;
const imgsize = {
  x: 60,
  y: 48
};
var desp = 0;
var rot = (0 * Math.PI)/180;
var desp_laser = desp;
var despla = 0;
var clock = {
  msec: 0%999,
  sec: 0%9,
  min: 0%59
}
var marcador = 0;
var vidas = "$$$";
var level = 1;
var indint;

/*Funcion random*/
function Rand_pix(numbers) {
    var ran_pix = Math.floor((Math.random() * numbers) + 1);
    return ran_pix-1;
}

function RND_Asteroid() {
  var x = Rand_pix(2);

  switch (x) {
    case 0:
      asteroids.push(new Asteroid("A" + asteroids.length, 1, Rand_pix(canvas.height),0));
      break;
    case 1:
      asteroids.push(new Asteroid("A" + asteroids.length, Rand_pix(canvas.width), 1,1));
      break;

    default:

  }


}

function Clock() {
  clock.msec = (clock.msec%1000) + 20;
  if (clock.msec == 1000){
    clock.sec = (clock.sec) + 1;
    clock.sec = clock.sec%60;
    if (clock.sec%20 == 0) {
      if (level < 8) {
          level += 1;
      }
    }
    if (clock.sec == 0) {
      clock.min = clock.min + 1;
    }
  }

  var coef = [1,2,4,5,10,25,50]
  if (clock.msec%(1000/coef[level - 1]) == 0) {
    RND_Asteroid();
  }
}

function DelShape(shape,arrayshape) {
  for (var i = 0; i < arrayshape.length; i++) {
    if (arrayshape[i].id == shape) {
      if (shape == "Nave" ) {
        //delete arrayshape[1];
      }
      arrayshape.splice(i,1);
    }
  }
}

function Background(id, x, y) {
  var Fondo = new Image();
  Fondo.src = "Fondo.jpg"

  this.draw = function(){
    ctx.drawImage(Fondo, 0,0);
  }
  this.update = function () {
    ;
  }

}

function Nave(id, x, y, ang) {
  var Img = new Image("1px", "1px");
  Img.src = "nave.png"
  //Img.style.width = "33px";

  this.id = id;
  this.x = x;
  this.y = y;
  this.angle = (ang * Math.PI)/180;


  this.draw = function() {
    ctx.save();
    //ctx.drawImage(Img, -30, -24);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    //ctx.translate(+30,+24);
    ctx.drawImage(Img, -(imgsize.x/2), -(imgsize.y/2));
    ctx.restore();
  }

  this.move = function(despla) {

    var deg_angle = (this.angle*180)/Math.PI;

    dspy = despla * Math.sin(this.angle)
    dspx = despla * Math.cos(this.angle)
    if (this.x > 0) {
        this.x = this.x % canvas.width + dspx;
    }else {
      this.x = canvas.width-1;
    }
    if (this.y > 0) {
        this.y = this.y % canvas.height + dspy;
    }else {
      this.y = canvas.height-1;
    }

    //console.log(Math.cos(deg_angle));
    //console.log(deg_angle);
    //console.log(this.x);
    //console.log(this.y);

    drawShapes();
  }
  this.rotate = function(rotang) {

      this.angle += rotang;


    drawShapes();
  }
  this.update = function () {
    this.move(desp);
    this.rotate(rot);
  }

}

function Shoot(id,x,y,angle) {
  var laser = new Image("1px", "1px");
  laser.src = "las.png";

  this.id = id;
  this.x = x;
  this.y = y;
  this.angle = angle;

  this.draw = function() {
    ctx.save();
    //ctx.drawImage(Img, -30, -24);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    //ctx.translate(+30,+24);
    ctx.drawImage(laser, 0, 0);
    ctx.restore();
  }
  this.move = function(despla) {

    var deg_angle = (this.angle*180)/Math.PI;
    dspy = despla * Math.sin(this.angle)
    dspx = despla * Math.cos(this.angle)
    if (this.x > 0 && this.x < canvas.width) {
      if (this.y > 0 && this.y < canvas.height) {
        this.x = this.x % canvas.width + dspx;
        this.y = this.y % canvas.height + dspy;
      }else {
          DelShape(this.id,shapes);
      }
    }else {
      DelShape(this.id,shapes);

      //console.log(shapes[2]);
    }
    drawShapes();
  }
  this.update = function () {
    this.move(desp + 19);
  }

}

function Asteroid(id,x,y,angle) {
  var asteroid = new Image("1px", "1px");
  asteroid.src = "asteroid.png";

  this.id = id;
  this.x = x;
  this.y = y;
  this.angle = angle;

  this.draw = function() {
    ctx.save();
    //ctx.drawImage(Img, -30, -24);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    //ctx.translate(+30,+24);
    ctx.drawImage(asteroid, 0, 0);
    ctx.restore();
  }
  this.move = function(despla) {

    var deg_angle = (this.angle*180)/Math.PI;
    dspy = despla * Math.sin(this.angle)
    dspx = despla * Math.cos(this.angle)
    if (this.x > 0 && this.x < canvas.width) {
      if (this.y > 0 && this.y < canvas.height) {
        this.x = this.x % canvas.width + dspx;
        this.y = this.y % canvas.height + dspy;
      }else {
          DelShape(this.id,asteroids);
      }
    }else {
      DelShape(this.id,asteroids);

      //console.log(shapes[2]);
    }


    drawShapes();
  }
  this.rotate = function(rotang) {

      this.angle += rotang;
    drawShapes();
  }
  this.update = function () {
    this.move(12);
    this.rotate(0.0008);
  }

}

function Circle(id, x, y, radious, color) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.radious = radious;
  this.color = color;

  this.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radious, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  this.move = function(despx) {

    this.x = this.x + despx;

    if((this.x - this.radious)<0)
      this.x = this.radious;
    if((this.x + this.radious)>=canvas.width)
      this.x = canvas.width - this.radious;

    drawShapes();

  }
  this.movey = function(despy) {

    this.y = this.y + despy;

    if((this.y - this.radious)<0)
      this.y = this.radious;
    if((this.y + this.radious)>=canvas.width)
      this.y = canvas.width - this.radious;

    drawShapes();

  }
}

function Rectangle(id, x, y, sx, sy, color) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.sx = sx;
  this.sy = sy;
  this.color = color;

  this.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.sx, this.sy);
  }

  this.move = function(despx) {
      this.x = this.x + despx;
      drawShapes();
  }
  this.move = function(despx) {
      this.x = this.x + despx;
      drawShapes();
  }
}

function hit(x1,x2,y1,y2) {
  if ((x1 + 10 > x2 && x1 - 60 < x2) && (y1 + 16 > y2 && y1 - 60 < y2)) {
    return true
  }else {
    return false
  }
}

function kill() {
  switch (vidas) {
    case "$$$":
      vidas = "$$"
      //main();
      break;
    case "$$":
      vidas = "$"
      //main();
      break;
    case "$":
      vidas = "";
      End_game();
      Fin = true;
      break;
    default:

  }
}

function checkhit(){
  var killed = false;
  for (var i = 1; i < shapes.length; i++) {
    shapes[i]
    for (var j = 0; j < asteroids.length; j++) {
      asteroids[j]
      //console.log(asteroids[j]);
        if (hit(shapes[i].x,asteroids[j].x,shapes[i].y,asteroids[j].y)) {
            Explode(asteroids[j].id);
            if (shapes[i].id == "Nave") {
              console.log("tocado");
              killed = true;
            }else {
              DelShape(shapes[i].id,shapes);
            }
            DelShape(asteroids[j].id,asteroids);
            if (killed) {
              kill();
            }
            //console.log("hit");
        }else {
          //console.log("nothit");
        }
      }
    }
}

function Explode(shape) {
  var obj;
  var i = 0;
  obj = getAsteroid(shape);
  if(obj === undefined)
    return;
  shapes.push(new Explosion("exp" + shapes.length, obj.x, obj.y,obj.angle));

  marcador += 1;
}

function Explosion(id,x,y,angle) {
  var explosion = new Image("1px", "1px");
  var cont = 0;
  explosion.src = "exp.png";
  explosion.opacity = 0.1;

  this.id = id;
  this.x = x;
  this.y = y;
  this.angle = angle;


  this.draw = function() {
    ctx.save();
    //ctx.drawImage(Img, -30, -24);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    //ctx.translate(+30,+24);
    ctx.drawImage(explosion, 0, 0);
    ctx.restore();
  }
  this.update = function () {

    cont += 1
    this.draw();
    if (cont == 60) {
      DelShape(this.id,shapes)
    }

  }
}

function drawShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(x in shapes) {
      shapes[x].draw();
    }
    for(x in asteroids) {
        //console.log(shapes[x]);
      asteroids[x].draw();
    }


}

function Update() {

  var x = 1;
  Clock();
  for(x in shapes) {
    //console.log(shapes[x]);
    shapes[x].update();
  }
  for(x in asteroids) {
      //console.log(shapes[x]);
    asteroids[x].update();
  }

}

function getShape(id) {
  for(x in shapes) {
    if(shapes[x].id === id)
      return shapes[x];
  }
}

function getAsteroid(id) {
  for(x in asteroids) {
    if(asteroids[x].id === id)
      return asteroids[x];
  }
}

function keyHandler(event) {
  var obj;
  var i = 0;
  obj = getShape("Nave");
  if(obj === undefined)
    return;
  //console.log(event);
  switch(event.key) {

    case "ArrowUp":
      if (desp<18) {
          desp += 3;
      }
      break;
    case "ArrowDown":
    if (desp>-18) {
        desp -= 3;
    }
      break;
    case "ArrowLeft":
      rot = -0.15;
      break;
    case "ArrowRight":
      rot = 0.15;
      break;
    case " ":
      shapes.push(new Shoot("L" + shapes.length, obj.x, obj.y, obj.angle))
      break;

    default:
      //console.log("Key not handled");
  }
}

function keyHandler2(event) {
  var obj;
  obj = getShape("Nave");
  if(obj === undefined)
    return;
  //  console.log(event.key + "up");

  switch(event.key) {

    case "ArrowUp":
      desp = desp/3;
      break;
    case event.keys && "ArrowDown":
      obj.move(-desp+1);
      break;
    case "ArrowLeft":
      rot = 0;
      break;
    case "ArrowRight":
      rot = 0;
      break;
    default:
      console.log("Key not handled");
  }
}
function Refreshclock() {
  var s, m;
  s = clock.sec;
  m = clock.min;
  if (m >= 10) {
    if (s >= 10) {
        document.getElementById("clock").innerHTML = m + ":" + s;
    }else {
        document.getElementById("clock").innerHTML = m + ":0" + s;
    }
  }else {
    if (s >= 10) {
        document.getElementById("clock").innerHTML = "0" + m + ":" + s;
    }else {
        document.getElementById("clock").innerHTML = "0" + m + ":0" + s;
    }
  }

}

function render() {

  checkhit();
  //console.log(asteroids);
  Update();

  document.getElementById("score").innerHTML = "score: " + marcador;
  document.getElementById("lifes").innerHTML = "lifes: " + vidas;
  document.getElementById("level").innerHTML = "level: " + level;
  Refreshclock();
  drawShapes();
}

function End_game() {
  //Fin = true;
  var highscore = marcador * level;
  clearInterval(indint);
  document.getElementById("game").style.display = 'none';
  document.getElementById("lifes").style.display = 'none';
  document.getElementById("clocklevel").style.display = 'none';
  document.getElementById("score").style.display = 'none';
  document.getElementById("level").style.display = 'none';
  document.getElementById("explicar").style.display = 'none';
  document.getElementById("Gameover").innerHTML = "total score: " + marcador;

}

function main() {
  canvas = document.getElementById('canvas');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return false;
  }

  ctx = canvas.getContext('2d');



    shapes.push(new Background("Fondo", 0,0));
    //shapes.push(new Circle("c1", 100, 110, 50, 'rgba(255, 0, 0, 0.5)'));
    shapes.push(new Nave("Nave", 300, 240,0));
    //shapes.push(new Asteroid(shapes.length, 100, 140,0));

    document.addEventListener('keydown', keyHandler);
    // accelerate
    //document.addEventListener("keydown", keyHandler3,true);
    document.addEventListener('keyup', keyHandler2);
    indint = (setInterval(render, 20));
    if (Fin !== true) {
      console.log(Fin);

    }


}
