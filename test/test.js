"use strict"

var imroad = require("gcode-implicit")
var isosurface = require("isosurface")
var gc = require('gcode-parser')
var sl = require("gcode-lines")
var fs = require("fs")
var pmc = require("../index.js");

//convert gcode to lines

//var data = fs.readFileSync("test.gcode") ???????? not sure why this isn't working?
var data = "G90 ; use absolute coordinates\n"+
"G1 F100\n"+
"G1 X0 Y0 Z1 E0\n"+
"G1 X5 Y0 Z1 E1.5\n"+
"G1 X5 Y5 Z1 E3\n"+
"G1 X0 Y5 Z1 E4.5\n"+
"G1 X0 Y0 Z1 E7";


var fileContent = data.toString()
var states = gc(fileContent)
var lines = sl(states)

/*
var x = 0; var y = 0; var z = 0;
var approxdist = pmc(x,y,z,lines, imroad);
console.log(approxdist)
*/

function implicitwrapper(x,y,z)
{
	//return x*x+y*y+z*z-50;
	return pmc(x,y,z,lines, imroad);
}

//console.log(implicitwrapper(0,0,0));
//console.log(implicitwrapper(0,0,1));


//visualize
var mymesh = isosurface.surfaceNets([64,64,64], implicitwrapper, [[-11,-11,-11], [11,11,11]])
var shell = require("mesh-viewer")()
var mesh

shell.on("viewer-init", function() {
  mesh = shell.createMesh(mymesh)
})

shell.on("gl-render", function() {
  mesh.draw()
})
