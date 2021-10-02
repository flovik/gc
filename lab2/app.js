"use strict"; 
var near = 1;
var far = 4;
var radius = 3.0;
var theta = 0.0; 
var phi = 0.0;
var dr = 5.0 * Math.PI / 180.0;
var fov = 65.0;
var aspect = 1.0;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var canvas;
var gl;
var program;
var objectsArray = [];
var idForObjects = 0;
window.onload = init; // CALL INIT AFTER THE PAGE (all html body) HAS BEEN LOADED!!!!

function getObject() {
	//move an object by the range slider value
	//search the name from the select-option
	for(var i = 0; i < objectsArray.length; i++){//search for it in the objectsArray
		if(objectsArray[i].name === document.getElementById("list").options[document.getElementById("list").selectedIndex].value)//assign that value to trCoeff of an object
			return objectsArray[i];	
	}
}

function addElement(){
	//adds a new option to the scene button
	var select = document.getElementById("list");
	select.options[select.options.length] = new Option(objectsArray[objectsArray.length - 1].name, objectsArray[objectsArray.length - 1].name);
}

function moveX(value){
	var val = getObject();
	val.trCoeff[0] = value; 
	document.getElementById("movex_value").innerHTML = value;
}

function moveY(value){
	var val = getObject();
	val.trCoeff[1] = value;
	document.getElementById("movey_value").innerHTML = value;
}

function moveZ(value){
	var val = getObject();
	val.trCoeff[2] = value;
	document.getElementById("movez_value").innerHTML = value;
}

function rotateX() {
	var val = getObject();
	val.enableRotation = true;
	val.axis = 0;
}

function rotateY() {
	var val = getObject();
	val.enableRotation = true;
	val.axis = 1;
}

function rotateZ() {
	var val = getObject();
	val.enableRotation = true;
	val.axis = 2;
}

function scaleX(value){
	var val = getObject();
	val.sc[0] = value;
	document.getElementById("scalex_value").innerHTML = value;
}

function scaleY(value){
	var val = getObject();
	val.sc[1] = value;
	document.getElementById("scaley_value").innerHTML = value;
}

function scaleZ(value){
	var val = getObject();
	val.sc[2] = value;
	document.getElementById("scalez_value").innerHTML = value;
}

function increaseZNear(value){ 
	//from where camera starts to see the scene
	near += 0.2;
	document.getElementById("zNear_value").innerHTML = near.toFixed(1);
}

function decreaseZNear(value){ 
	//from where camera starts to see the scene
	near -= 0.2;
	document.getElementById("zNear_value").innerHTML = near.toFixed(1);
}

function increaseZFar(){
	//the furthest point where the camera can see
	far += 0.2;
	document.getElementById("zFar_value").innerHTML = far.toFixed(1);
}

function decreaseZFar(){
	//the furthest point where the camera can see
	far -= 0.2;
	document.getElementById("zFar_value").innerHTML = far.toFixed(1);
}

function Radius(value){
	//how far is the camera from the center of the scene
	radius = value;
	document.getElementById("radius_value").innerHTML = value;
}

function Theta(value){
	//moves the camera to left or right
	theta = value * Math.PI / 180.0;
	document.getElementById("theta_value").innerHTML = value;
}

function Phi(value){
	//how high or low the camera is from the ground, like goes up or down
	phi = value * Math.PI / 180.0;
	document.getElementById("phi_value").innerHTML = value;
}

function Fov(value){
	//how wide you can see the scene
	fov = value;
	document.getElementById("fov_value").innerHTML = value;
}

function Aspect(value){
	//width/height
	aspect = value;
	document.getElementById("aspect_value").innerHTML = value;
}


function stopRotation() {
	var val = getObject();
	val.enableRotation = false;
}

function deleteOption(){
	//deletes the option from html page
	var select = document.getElementById("list");
	var i;
	
	for(i = 0; i < select.options.length; i++){
		if(select.options[i].selected)
			select.remove(i);
	}
	
	//deletes the object from array of objects
	objectsArray.splice(i - 1, 1);
}

function addCube() {
	var CubeVertices = [
		vec3( -0.5, -0.5,  0.5),//0
		vec3( -0.5,  0.5,  0.5),//1
		vec3(  0.5,  0.5,  0.5),//2
		vec3( -0.5, -0.5,  0.5),//0
		vec3(  0.5,  0.5,  0.5),
		vec3(  0.5, -0.5,  0.5),
		
		vec3( -0.5, -0.5, -0.5),
		vec3( -0.5,  0.5, -0.5),
		vec3(  0.5,  0.5, -0.5),
		vec3( -0.5, -0.5, -0.5),
		vec3(  0.5,  0.5, -0.5),
		vec3(  0.5, -0.5, -0.5),
		
		vec3( -0.5, -0.5,  0.5),
		vec3(  0.5, -0.5,  0.5),
		vec3(  0.5, -0.5, -0.5),
		vec3( -0.5, -0.5,  0.5),
		vec3( -0.5, -0.5, -0.5),
		vec3(  0.5, -0.5, -0.5),
		
		vec3( -0.5,  0.5,  0.5),
		vec3(  0.5,  0.5,  0.5),
		vec3(  0.5,  0.5, -0.5),
		vec3( -0.5,  0.5,  0.5),
		vec3( -0.5,  0.5, -0.5),
		vec3(  0.5,  0.5, -0.5),
		
		vec3(  0.5,  0.5,  0.5),
		vec3(  0.5, -0.5,  0.5),
		vec3(  0.5,  0.5, -0.5),
		vec3(  0.5, -0.5,  0.5),
		vec3(  0.5, -0.5, -0.5),
		vec3(  0.5,  0.5, -0.5),
		
		vec3( -0.5, -0.5,  0.5),
		vec3( -0.5,  0.5,  0.5),
		vec3( -0.5,  0.5, -0.5),
		vec3( -0.5, -0.5,  0.5),
		vec3( -0.5, -0.5, -0.5),
		vec3( -0.5,  0.5, -0.5)
	];
	let name = "Cube" + (idForObjects++); //give the object a name
	var Cube = new Drawable(CubeVertices, program, name);
	objectsArray.push(Cube);
	addElement(); //add the object to the options
}

function addCone() {
	let ConeVertices = [];
	var startAngle = 0;
	var r = 0.75;
	while(startAngle < 360) {
		let i1 = (vec3(r * Math.cos(startAngle * Math.PI / 180), 0, r * Math.sin(startAngle * Math.PI / 180))); //calculate the circle triangles
		ConeVertices.push(i1);
		startAngle += 0.5;
		ConeVertices.push(vec3(0, 0, 0));
		let i2 = (vec3(r * Math.cos(startAngle * Math.PI / 180), 0, r * Math.sin(startAngle * Math.PI / 180))); //connect dots in circle triangle
		ConeVertices.push(i2);

		ConeVertices.push(i1); //connect the dots to the top of the cone
		ConeVertices.push(vec3(0, 1, 0));
		ConeVertices.push(i2);
	}
	
	let name = "Cone" + (idForObjects++);
	var ConeObject = new Drawable(ConeVertices, program, name);
	objectsArray.push(ConeObject);
	addElement();
}

function addPyramid() {
	let PyramidVertices = [
		vec3( -0.5, -0.5,  0.5), //base
		vec3(  0.5, -0.5,  0.5),
		vec3(  0.5, -0.5, -0.5),
		vec3( -0.5, -0.5,  0.5),
		vec3( -0.5, -0.5, -0.5),
		vec3(  0.5, -0.5, -0.5),
		
		vec3( -0.5, -0.5,  0.5),//sides
		vec3(  0.5, -0.5,  0.5),
		vec3( 0.0, 0.5, 0.0),
		
		vec3( -0.5, -0.5,  0.5),
		vec3( -0.5, -0.5, -0.5),
		vec3( 0.0, 0.5, 0.0),

		vec3(  0.5, -0.5,  0.5),
		vec3(  0.5, -0.5, -0.5),
		vec3( 0.0, 0.5, 0.0),

		vec3( -0.5, -0.5, -0.5),
		vec3(  0.5, -0.5, -0.5),
		vec3( 0.0, 0.5, 0.0)
	];
	let name = "Pyramid" + (idForObjects++); //give the object a name
	var Pyramid = new Drawable(PyramidVertices, program, name);
	objectsArray.push(Pyramid);
	addElement(); //add the object to the options
}

class Drawable {
	constructor(vertices, program, name){
		this.name = name;
		this.program = program;
		this.vertices = vertices;
		this.trCoeff = [0, 0, 0];
		this.theta = [0, 0, 0];
		this.enableRotation = false;
		this.axis = 0;
		this.sc = [0.5, 0.5, 0.5];
		//position
		this.vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW);
		this.vAttributeLocation = gl.getAttribLocation(program, 'vPosition');

		var i;
		this.colors = [];
		var rand_color = vec3(Math.floor(Math.random() * 256) / 256, Math.floor(Math.random() * 256) / 256, Math.floor(Math.random() * 256) / 256);
		for(i = 0; i < this.vertices.length; i++){
			this.colors.push(vec4(rand_color, 1.0));
		}
		
		this.trCoeffLoc = gl.getUniformLocation(program, "trCoeff");
		this.thetaLoc = gl.getUniformLocation(program, "theta");
		this.scLoc = gl.getUniformLocation(program, "sc");
		//color 
		this.colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(this.colors), gl.STATIC_DRAW);
		
		this.cAttributeLocation = gl.getAttribLocation(program, 'vColor');
	}
	
	draw() {
		//position
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.vAttributeLocation);
		gl.vertexAttribPointer(this.vAttributeLocation, 3, gl.FLOAT, false, 0, 0);
		
		//color
		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
		gl.enableVertexAttribArray(this.cAttributeLocation);
		gl.vertexAttribPointer(this.cAttributeLocation, 4, gl.FLOAT, false, 0, 0 );
		
		//at render it will rotate the cube at each frame, when the rotate button is pressed the enable Rotation goes to true and changes the theta by the value
		//from the pressed button (x, y or z)
		if(this.enableRotation){
			this.theta[this.axis] += 2;
		}

		gl.uniform3fv(this.trCoeffLoc, this.trCoeff);
		gl.uniform3fv(this.thetaLoc, this.theta);
		gl.uniform3fv(this.scLoc, this.sc);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length);
	}
}

function init() {    
    canvas = document.getElementById( "gl-canvas" ); // getting the canvas element
    gl = WebGLUtils.setupWebGL( canvas ); // setting up webgl with the canvas
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    // the size of the viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
    // the color of background!
    gl.clearColor(0.88, 1.0, 0.0, 0.1);
	gl.enable(gl.DEPTH_TEST);

    program = initShaders( gl, "vertex-shader", "fragment-shader" ); // initializing shaders
    gl.useProgram( program );
	
	aspect = canvas.width / canvas.height;

	modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
	projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
	
	eye = vec3(radius * Math.sin(theta) * Math.cos(phi), 
		radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(theta));//calculates the position of the viewer
	modelViewMatrix = lookAt(eye, at, up); //position of the viewer, point the viewer is looking at, which way is up
	projectionMatrix = perspective(fov, aspect, near, far);
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    render();
};
function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
	
	eye = vec3(radius * Math.sin(theta) * Math.cos(phi), 
		radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(theta));
	modelViewMatrix = lookAt(eye, at, up);
	projectionMatrix = perspective(fov, aspect, near, far);

	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    for(var i = 0; i < objectsArray.length; i++){
		objectsArray[i].draw();
	}

    requestAnimFrame(render); // updating the image, will be used for dynamic display
}