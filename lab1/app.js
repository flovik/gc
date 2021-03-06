"use strict"; 
var near = 0.5;
var far = 10.0;
var radius = 4.0;
var theta = 0; //chnage to 0.3
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
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var thetaRot = [0,0,0];
var thetaLoc;

var canvas;
var gl;
var program;
var objectsArray = [];
    // initialization of the data arrays!!!!

var idForObjects = 0;
window.onload = init; // CALL INIT AFTER THE PAGE (all html body) HAS BEEN LOADED!!!!

function addElement(){
	//adds a new option to the scene button
	var select = document.getElementById("list");
	select.options[select.options.length] = new Option(objectsArray[objectsArray.length - 1].name, objectsArray[objectsArray.length - 1].name);
}

function moveX(value){
	//move an object by the range slider value
	var select = document.getElementById("list"); //search the name from the select-option
	var val = select.options[select.selectedIndex].value;
	for(var i = 0; i < objectsArray.length; i++){
		if(objectsArray[i].name === val){ //search for it in the objectsArray
			objectsArray[i].trCoeff[0] = value; //assign that value to trCoeff of an object
		}
	}
}

function moveY(value){
	var select = document.getElementById("list");
	var val = select.options[select.selectedIndex].value;
	for(var i = 0; i < objectsArray.length; i++){
		if(objectsArray[i].name === val){
			objectsArray[i].trCoeff[1] = value;
		}
	}
}

function moveZ(value){
	var select = document.getElementById("list");
	var val = select.options[select.selectedIndex].value;
	for(var i = 0; i < objectsArray.length; i++){
		if(objectsArray[i].name === val){
			objectsArray[i].trCoeff[2] = value;
		}
	}
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
		
		gl.uniform3fv(this.trCoeffLoc, this.trCoeff);

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
	
	
	modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
	projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
	
	thetaLoc = gl.getUniformLocation(program, "theta");
	
	eye = vec3(radius * Math.sin(theta) * Math.cos(phi), 
		radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(theta));
	modelViewMatrix = lookAt(eye, at, up);
	projectionMatrix = perspective(fovy, aspect, near, far);
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	
    render();
};
function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
	
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    for(var i = 0; i < objectsArray.length; i++){
		objectsArray[i].draw();
	}

    requestAnimFrame(render); // updating the image, will be used for dynamic display
}
