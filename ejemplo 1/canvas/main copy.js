
//canvas configuration
var canvas =document.getElementById("canvas-pend");
var c= canvas.getContext("2d");

//Resize canvas
// canvas.width = window.innerWidth-20; //redefinimos el tamaño del canvas con algun margen
// canvas.height= window.innerHeight-100;
if(window.innerWidth-20>1500){
    canvas.width = 1500;
}else{
    canvas.width = window.innerWidth-20; //redefinimos el tamaño del canvas con algun margen
}

canvas.height= canvas.width/2;
//Coordinates transformation from canvas coordinates to simulation coordinates 
var simMinWidth = 1;//ancho del canvas en metros
var cScale =Math.min(canvas.width,canvas.height)/simMinWidth; //factor que sirve para escalar valores a nuestra simulacion
var simWidth = canvas.width/cScale;
var simHeight = canvas.height/cScale;

function cX(pos)//funcion para escalar coordenadas x
{
  return pos *cScale;//funcion para escalar coordenadas y
}
function cY(pos)
{
  return canvas.height-pos*cScale; //because the y=0 is at the top in the canvas, ahora mi y=0 esta abajo a la izquierda
}
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//scene
var l=0.4; //lenght of the pendulums (En metros)
var g=9.81; //(m/s2)
var h=1/60.0; //incremento h
var A0=0.0,A1=0.04;//Amplitud que se le da a las masas (A0=masa 1 , A1=masa 2)  (en metros) A1=0.04
var k=100,t0=0.0,sep=0.3,q=1;  
var eq1=0.2,eq2=eq1+sep;//posicion de equilibrio de cada masa, se define como el centro sobre el cual oscila
var x1=eq1+A0,x2=eq2+A1,v1=0.0,v2=0.0,m=5,r=0.025,y=0.5; //condiciones de borde
var mass_1 ={
            m:m,//en kg
            radio: r, //en m
            pos : {x: x1, y: y}, //en m
            v: v1,
          };
var mass_2 ={
            m:m,//en kg
            radio: r, //en m 
            pos : {x: x2, y: y}, //en m
            v: v2,
          };
var arm1={
            pos_inicio : {x: eq1, y: mass_1.pos.y + l}, //en m (parte de arriba del pendulo)
            pos_final : {x: x1, y: mass_1.pos.y}, //en m (parte de abajo del pendulo)
          };
var arm2={
            pos_inicio : {x: eq2, y: mass_2.pos.y + l}, //en m (parte de arriba del pendulo)
            pos_final : {x: x2, y: mass_2.pos.y}, //en m (parte de abajo del pendulo)
          };
var path1=[],path2=[],path3=[],path4=[];
var omega1=Math.sqrt(g/l);
var omega2=Math.sqrt(g/l+(2*k)/m);
var omega_sum=(omega1+omega2)/2;
var omega_dif=(omega1-omega2)/2;
var inicio=false;
function InicioPausa(){
  if(inicio==true){
    inicio=false;
  }else{
    inicio=true;
  }
  return inicio;
}
function StartValue(){
l=0.4; //lenght of the pendulums (En metros)
A0=0;
A1=0.04;//Amplitud que se le da a las masas (A0=masa 1 , A1=masa 2)  (en metros)
k=10.0;
sep=0.3;  
eq2=eq1+sep;
x1=eq1+A0;
x2=eq2+A1;
v1=0.0;
v2=0.0;
m=5;
r=0.025;
y=0.5; //condiciones de borde
}
function Restart(){
  t0=0;
  path1=[];
  path2=[];
  path3=[];
  path4=[];
  mass_1 ={
    m:m,
    radio: r, 
    pos : {x: x1, y: y}, 
    v: v1,
  };
  mass_2 ={
    m:m,
    radio: r, 
    pos : {x: x2, y: y}, 
    v: v2,
  };
  arm1={
    pos_inicio : {x: eq1, y: mass_1.pos.y + l}, 
    pos_final : {x: x1, y: mass_1.pos.y}, 
  };
  arm2={
    pos_inicio : {x: eq2, y: mass_2.pos.y + l}, 
    pos_final : {x: x2, y: mass_2.pos.y}, 
  };
}
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//--------------------------------------------------------------------------


function todegree(radians){return radians * (180 / Math.PI);}

function spring(x0, y0, x1, y1) {
// Calculate the difference in x and y coordinates between the two points
var dx = x1 - x0, dy = y1 - y0;
// Calculate the total length between the two points
var L = Math.sqrt(dx * dx + dy * dy);
// If the length is very small, return (no need to draw a spring)
if (L < 0.01) return;
// Calculate the factor for the distance between windings
var q = 0.005 / L;
// Calculate the coordinates of the start of the wound part (left side)
var u0 = x0 + q * dx;
var v0 = y0 + q * dy;
// Calculate the coordinates of the end of the wound part (right side)
var u1 = x1 - q * dx; // Use x1 instead of x2
var v1 = y1 - q * dy; // Use y1 instead of y0
// Calculate the differences in x and y coordinates for the wound part
var du = u1 - u0, dv = v1 - v0;
// Calculate the total length of the wound part
L = Math.sqrt(du * du + dv * dv);
// Set the number of windings
var n = 20;
// Set the angular increment for each winding
var m = 60;
// Calculate the maximum number of iterations (points) for winding
var iMax = n * 360 / m;
// Set the width of the spring (half-width)
var br = 0.01;
// Begin drawing the spring
c.beginPath();
// Move the drawing cursor to the start of the spring
c.moveTo(cX(x0), cY(y0));
// Draw the line from the start point to the beginning of the wound part
c.lineTo(cX(u0), cY(v0));
// Iterate through each winding
for (var i = 1; i <= iMax; i++) {
  // Calculate the relative position along the winding (a)
  var a = i / iMax;
  // Calculate the displacement perpendicular to the spring (b)
  var b = (br / L) * Math.sin(todegree(i * m));
  // Calculate the new x and y coordinates of the point along the winding
  var u = u0 + a * du + b * dv; // Use u0 and dv instead of x0 and dy
  var v = v0 + a * dv - b * du; // Use v0 and du instead of y0 and dx
  // Add a line segment to the spring's path
  c.lineTo(cX(u), cY(v));
}
// Draw the final line segment from the last point of the winding to the end point of the spring
c.lineTo(cX(x1), cY(y1));
// Stroke (draw) the spring path
c.stroke();
// Log the x0 coordinate (for debugging or tracking)

}


//x1,y1 -> initial point of the arrow
//x2,y2 -> final point of the arrow
function arrow(x1, y1, x2, y2, w) {
if (!w) w = 1;                         // If line width is not defined, set a default value
var dx = x2 - x1, dy = y2 - y1;         // Calculate vector coordinates
var length = Math.sqrt(dx * dx + dy * dy); // Calculate length of the vector
if (length == 0) return;                // If length is zero, return (no arrow to draw)
dx /= length; dy /= length;             // Calculate unit vector
var s = 2.5 * w + 7.5;                  // Length of the arrowhead
var xSp = x2 - s * dx, ySp = y2 - s * dy; // Calculate arrowhead starting point
var h = 0.5 * w + 3.5;                  // Half width of the arrowhead
var xSp1 = xSp - h * dy, ySp1 = ySp + h * dx; // Calculate one corner of the arrowhead
var xSp2 = xSp + h * dy, ySp2 = ySp - h * dx; // Calculate the other corner of the arrowhead
xSp = x2 - 0.6 * s * dx; ySp = y2 - 0.6 * s * dy; // Calculate the corner of the arrowhead
c.beginPath();                        // Start a new path
c.lineWidth = w;                      // Set line width
c.moveTo(x1, y1);                     // Move to the starting point
if (length < 5) c.lineTo(x2, y2);     // If arrow is short, go directly to the end point
else c.lineTo(xSp, ySp);              // Otherwise, go to the indented corner
c.stroke();                           // Draw the line
if (length < 5) return;                 // If arrow is short, no arrowhead
c.beginPath();                        // Start a new path for the arrowhead
c.lineWidth = 1;                      // Reset line width
c.fillStyle = c.strokeStyle;        // Set fill color to match line color
c.moveTo(xSp, ySp);                   // Move to the starting point of the arrowhead
c.lineTo(xSp1, ySp1);                 // Go to one corner of the arrowhead
c.lineTo(x2, y2);                     // Go to the tip of the arrow
c.lineTo(xSp2, ySp2);                 // Go to the other corner of the arrowhead
c.closePath();                        // Close the path
c.fill();                             // Fill the arrowhead
}


// y0,x0= inicio cuadro
function diagram(x0, y0,masa1,path,eq) {
var width = cX(0.4), height = width/3; // Dimensions in pixels
var pixT = 2 / (20 * h); // Conversion factor for horizontal axis --> x_graph =pixT * X_function(t)
var dt=width*4.5/5+x0;
var A= Math.max(Math.abs(A0),Math.abs(A1));
var pixY = height/(A*1.25); // Conversion factor for vertical axis --> y_graph =pixY* y_function(t)
var t=[t0];  
// Draw Vertical axis
arrow(x0, y0 + height, x0 , y0 - height);
c.font = "10px arial";
c.fillText("Amplitud", x0 - 50, y0 - height + 8); // Label the horizontal axis
// Draw horizontal axis
arrow(x0, y0, x0 + width, y0);
c.fillText("Tiempo", x0 + width - 8, y0 + 14); // Label the horizontal axis
// Add the current position to the path array
t.push(t0*pixT);
path.push({ x: x0+t0*pixT, y: pixY*(masa1-eq)+y0});
// Draw the path of the particle
c.beginPath();

if(x0+t0*pixT>dt){
// Erase the initial part of the path when particle path is in the 3/4 of the canvas
c.moveTo(path[1].x-path[0].x+x0, path[1].y);
for (var i = 2; i < path.length; i++) {
    c.lineTo(path[i].x-path[0].x+x0, path[i].y);
  }
path.shift();
}else{
  c.moveTo(path[0].x, path[0].y);
  for (var i = 1; i < path.length; i++) {
        c.lineTo(path[i].x, path[i].y);
    }  
}
c.strokeStyle = "gray";
c.stroke();
// Draw the particle at the current position
c.beginPath();
c.strokeStyle = 'black';
if(x0+t0*pixT>dt){
c.arc(dt, pixY*(masa1-eq)+y0, 3, 0, Math.PI * 2);
}else{
c.arc(x0+t0*pixT, pixY*(masa1-eq)+y0, 3, 0, Math.PI * 2);
}
c.stroke();
}


//Graficas de velocidad
//y0,x0= inicio cuadro
function diagram1(x0, y0,masa1,path,eq) {
var width = cX(0.4), height = width/3; // Dimensions in pixels
var pixT = 2 / (20 * h); // Conversion factor for horizontal axis --> x_graph =pixT * X_function(t)
var dt=width*4.5/5+x0;
var A= 0.2;
var pixY = height/(A*1.25) ; // Conversion factor for vertical axis --> y_graph =pixY* y_function(t)
var t=[t0];  
// Draw Vertical axis
arrow(x0, y0 + height, x0 , y0 - height);
c.font = "10px arial";
c.fillText("Velocidad", x0 - 50, y0 - height + 8); // Label the horizontal axis
// Draw horizontal axis
arrow(x0, y0, x0 + width, y0);
c.fillText("Tiempo", x0 + width - 8, y0 + 14); // Label the horizontal axis
// Add the current position to the path array
t.push(t0*pixT);
path.push({ x: x0+t0*pixT, y: pixY*(masa1-eq)+y0});
// Draw the path of the particle
c.beginPath();
if(x0+t0*pixT>dt){
// Erase the initial part of the path when particle path is in the 3/4 of the canvas

c.moveTo(path[1].x-path[0].x+x0, path[1].y);
for (var i = 2; i < path.length; i++) {
    c.lineTo(path[i].x-path[0].x+x0, path[i].y);
  }
path.shift();
}else{
  c.moveTo(path[0].x, path[0].y);
  for (var i = 1; i < path.length; i++) {
        c.lineTo(path[i].x, path[i].y);
    }  
}
c.strokeStyle = "gray";
c.stroke();
// Draw the particle at the current position
c.beginPath();
c.strokeStyle = 'black';
if(x0+t0*pixT>dt){
c.arc(dt, pixY*(masa1-eq)+y0, 3, 0, Math.PI * 2);
}else{
c.arc(x0+t0*pixT, pixY*(masa1-eq)+y0, 3, 0, Math.PI * 2);
}
c.strokeStyle = 'black';
c.stroke();
}



//drawing............................................................................
//...................................................................................
//...................................................................................
//...................................................................................
//...................................................................................
function draw(){
c.clearRect(0,0,canvas.width,canvas.height);//clear the canvas
//Spring
spring(arm1.pos_final.x,arm1.pos_final.y,arm2.pos_final.x,arm1.pos_final.y);
//Diagrama de posicion
//Diagrama masa 1
c.font = "20px arial";
c.fillText("Masa 1 (izquierda)", cX(arm1.pos_inicio.x+0.5), cY(0.95));
diagram(cX(arm1.pos_inicio.x+0.6),cY(0.8),mass_1.pos.x,path1,eq1);
diagram1(cX(arm1.pos_inicio.x+1.1),cY(0.8),mass_1.v,path3,0);
//Diagrama masa 2
c.font = "20px arial";
c.fillText("Masa 2 (derecha)", cX(arm1.pos_inicio.x+0.5), cY(0.55));
diagram(cX(arm1.pos_inicio.x+0.6),cY(0.4),mass_2.pos.x,path2,eq2);
diagram1(cX(arm1.pos_inicio.x+1.1),cY(0.4),mass_2.v,path4,0);
// Draw the pendulum's A mass
c.beginPath();
c.strokeStyle = 'black';
c.arc(cX(mass_1.pos.x), cY(mass_1.pos.y), mass_1.radio*cScale, 0, Math.PI * 2);
c.closePath();
c.fill();
//Arm of the pendulum A
c.beginPath();
c.strokeStyle = 'black';
c.moveTo(cX(arm1.pos_inicio.x), cY(arm1.pos_inicio.y));
c.lineTo(cX(arm1.pos_final.x), cY(arm1.pos_final.y));
c.stroke();

//Base
c.beginPath();
c.strokeStyle = 'black';
// c.fillRect(cX(arm1.pos_inicio.x-0.1),cY(arm1.pos_inicio.y+0.01),cX(arm2.pos_inicio.x), 10);
c.fillRect(cX(arm1.pos_inicio.x-0.1),cY(arm1.pos_inicio.y+0.01),cX(arm2.pos_inicio.x-arm1.pos_inicio.x+0.2), 10);

// Draw the pendulum's B mass
c.beginPath();
c.strokeStyle = 'black';
c.arc(cX(mass_2.pos.x), cY(mass_2.pos.y), mass_2.radio*cScale, 0, Math.PI * 2);
c.closePath();
c.fill();
//Arm of the pendulum B
c.beginPath();
c.strokeStyle = 'black';
c.moveTo(cX(arm2.pos_inicio.x), cY(arm2.pos_inicio.y));
c.lineTo(cX(arm2.pos_final.x), cY(arm2.pos_final.y));
c.stroke();
//...............................................................................................
//...............................................................................................
}

//simulate
function simulate()
{
  //Runge-Kutta para determinar las coordenadas de la masa
// Define the ODEs
function odeX(t, xa, va, xb, vb) {
    
  return va;
}

function odeVa(t, xa, va, xb, vb) {
  return (-((k + (mass_1.m * g) / l) * xa + k * xb) / mass_1.m);
}

function odeY(t, xa, va, xb, vb) {
  return vb;
}

function odeVb(t, xa, va, xb, vb) {
  return (-(k * xa + (k + (mass_2.m * g) / l) * xb) / mass_2.m);;
}

// Runge-Kutta 4th Order Method for System of ODEs
function rungeKuttaSystem(t0, xa0, va0, xb0, vb0, h) {
  let t = t0;
  let xa = xa0-eq1;
  let va = va0;
  let xb = xb0-eq2;
  let vb = vb0;

  let k1xa = h * odeX(t, xa, va, xb, vb);
  let k1va = h * odeVa(t, xa, va, xb, vb);
  let k1xb = h * odeY(t, xa, va, xb, vb);
  let k1vb = h * odeVb(t, xa, va, xb, vb);

  let k2xa = h * odeX(t + h / 2, xa + k1xa / 2, va + k1va / 2, xb + k1xb / 2, vb + k1vb / 2);
  let k2va = h * odeVa(t + h / 2, xa + k1xa / 2, va + k1va / 2, xb + k1xb / 2, vb + k1vb / 2);
  let k2xb = h * odeY(t + h / 2, xa + k1xa / 2, va + k1va / 2, xb + k1xb / 2, vb + k1vb / 2);
  let k2vb = h * odeVb(t + h / 2, xa + k1xa / 2, va + k1va / 2, xb + k1xb / 2, vb + k1vb / 2);

  let k3xa = h * odeX(t + h / 2, xa + k2xa / 2, va + k2va / 2, xb + k2xb / 2, vb + k2vb / 2);
  let k3va = h * odeVa(t + h / 2, xa + k2xa / 2, va + k2va / 2, xb + k2xb / 2, vb + k2vb / 2);
  let k3xb = h * odeY(t + h / 2, xa + k2xa / 2, va + k2va / 2, xb + k2xb / 2, vb + k2vb / 2);
  let k3vb = h * odeVb(t + h / 2, xa + k2xa / 2, va + k2va / 2, xb + k2xb / 2, vb + k2vb / 2);

  let k4xa = h * odeX(t + h, xa + k3xa, va + k3va, xb + k3xb, vb + k3vb);
  let k4va = h * odeVa(t + h, xa + k3xa, va + k3va, xb + k3xb, vb + k3vb);
  let k4xb = h * odeY(t + h, xa + k3xa, va + k3va, xb + k3xb, vb + k3vb);
  let k4vb = h * odeVb(t + h, xa + k3xa, va + k3va, xb + k3xb, vb + k3vb);

  xa =  xa + (k1xa + 2 * k2xa + 2 * k3xa + k4xa) / 6;
  va = va + (k1va + 2 * k2va + 2 * k3va + k4va) / 6;
  xb = xb + (k1xb + 2 * k2xb + 2 * k3xb + k4xb) / 6;
  vb = vb + (k1vb + 2 * k2vb + 2 * k3vb + k4vb) / 6;
  t = t + h;
  let resu=[xa,va,xb,vb];
  return resu;
  }

//funciones analiticas que describen las coordenada x de las masas
// function xa(t){
//   // let x=-A0*Math.sin(omega_sum*t)*Math.sin(omega_dif*t)+x1;
//   let x=((A1+A0)/2)*Math.cos(omega1*t)+((A0-A1)/2)*Math.cos(omega2*t)+eq1;
//   return x;
// }
// function xb(t){
//   // let x=A0*Math.cos(omega_sum*t)*Math.cos(omega_dif*t)+x2;
//   let x=((A1+A0)/2)*Math.cos(omega1*t)-((A0-A1)/2)*Math.cos(omega2*t)+eq2;
//   return x;
// }
// if(inicio==true)//VER VARIABLE inicio, hace que se mueva el diagrama
// {

// //actualizacion de las coordenadas x de las masas
// mass_1.pos.x=xa(t0);
// mass_2.pos.x=xb(t0);
// arm1.pos_final.x=mass_1.pos.x;
// arm2.pos_final.x=mass_2.pos.x;
// t0+=h;


var resul=rungeKuttaSystem(t0, mass_1.pos.x, mass_1.v, mass_2.pos.x, mass_2.v, h);
mass_1.pos.x = resul[0]+eq1;
mass_1.v = resul[1];
mass_2.pos.x = resul[2]+eq2;
mass_2.v = resul[3];
arm1.pos_final.x = mass_1.pos.x;
arm2.pos_final.x = mass_2.pos.x;
t0 += h;


}
// }

//make browser to call new state
function update() {
simulate();
draw();
requestAnimationFrame(update);
}
update();