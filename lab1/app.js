"use strict"; 
var near = 0.5;
var far = 10.0;
var radius = 4.0;
var theta = 0.3; //chnage to 0
var phi = 0.0;
var dr = 5.0 * Math.PI / 180.0;

var fovy = 55.0;
var aspect = 1.0;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var xAxis = 0;
var yAxis = 0;
var zAxis = 0;

var axis = 0;
var thetaRot = [0,0,0];
var thetaLoc;

var trCoeff;
var trCoeffLoc;


var canvas;
var gl;
var program;
var objectsArray = [];
var translation = [-1, 0, 0];
    // initialization of the data arrays!!!!

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
var idForObjects = 0;
var cone_vals = [];
var ConeVertices = [];
var n = 360;
var r = 1;
var h = 1;
window.onload = init; // CALL INIT AFTER THE PAGE (all html body) HAS BEEN LOADED!!!!

function addElement(){
	//adds a new option to the scene button
	var select = document.getElementById("list");
	select.options[select.options.length] = new Option(objectsArray[objectsArray.length - 1].name, (idForObjects - 1));
	console.log(select);
}

function deleteOption(){
	//deletes the option from html page
	var select= document.getElementById("list");
	var i;
	console.log(select);
	for(i = 0; i < select.options.length; i++){
		if(select.options[i].selected)
			select.remove(i);
	}
	console.log(objectsArray);
	//deletes the object from array of objects
	objectsArray.splice(i - 1, 1);
}
class Drawable {
	constructor(vertices, program, name){
		this.name = name;
		this.program = program;
		this.vertices = vertices;
		
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
		
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length);
	}
}

function addCube() {
	let name = "Cube" + (idForObjects++);

	var Cube = new Drawable(CubeVertices, program, name);
	objectsArray.push(Cube);
	addElement();
	console.log(objectsArray);
}

function addCone() {
	for(var i = 0; i < n; i++){
		cone_vals.push(vec3(r * Math.sin(i * Math.PI / 180), r * Math.cos(i * Math.PI / 180), 0));
	}
	
	for(var i = 1; i < n; i++){
		ConeVertices.push(cone_vals[i]);
		ConeVertices.push(cone_vals[i - 1]);
		ConeVertices.push(vec3(-1,0,0));
	}
	
	ConeVertices.push(cone_vals[359]);
	ConeVertices.push(cone_vals[0]);
	ConeVertices.push(vec3(-1,0,0));
	
	for(var i = 1; i < n; i++){
		ConeVertices.push(cone_vals[i]);
		ConeVertices.push(cone_vals[i - 1]);
		ConeVertices.push(vec3(0,0,1));
	}
	
	ConeVertices.push(cone_vals[359]);
	ConeVertices.push(cone_vals[0]);
	ConeVertices.push(vec3(0,0,1));

	let name = "Cone" + (idForObjects++);

	var ConeObject = new Drawable(ConeVertices, program, name);
	objectsArray.push(ConeObject);
	addElement();
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
	
	modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
	projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
	
	thetaLoc = gl.getUniformLocation(program, "theta");
	
	eye = vec3(radius * Math.sin(theta) * Math.cos(phi), 
		radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(theta));
	modelViewMatrix = lookAt(eye, at, up);
	projectionMatrix = perspective(fovy, aspect, near, far);
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	
	trCoeff = [0, 0, 0];

	//translate cube
	//console.log(Cube.vertices);
	//for(var i = 0; i < Cube.vertices.length; i++){
	//	Cube.vertices[i][0] += 2.5;
	//}
	
    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
	
	thetaRot[axis] += 0.3;
	gl.uniform3fv(thetaLoc, thetaRot);
	
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	trCoeffLoc = gl.getUniformLocation(program, "trCoeff");
	gl.uniform3fv(trCoeffLoc, trCoeff);
    for(var i = 0; i < objectsArray.length; i++){
		objectsArray[i].draw();
	}
    requestAnimFrame(render); // updating the image, will be used for dynamic display
}
