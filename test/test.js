"use strict"

var imroad = require("gcode-implicit")
var isosurface = require("isosurface")
var gc = require('gcode-parser')
var sl = require("gcode-lines")
var fs = require("fs")
var pmc = require("../index.js")
var lines2layers = require("gcode-layers")
var path = require("path")

//convert gcode to lines

var data = fs.readFileSync(__dirname + "/test.gcode")

var fileContent = data.toString()
var states = gc(fileContent)
var lines = sl(states)
var layers = lines2layers(lines)


/*
var x = 0; var y = 0; 

var z = 1.1;
//for(var z = 0; z<2.2; z=z+0.1)
//{
	var approxdist = pmc(x,y,z,lines, imroad, layers);
	console.log(z+":\t\t\t "+approxdist);
//}
*/


console.log(layers);
function implicitwrapper(x,y,z)
{
	//return x*x+y*y+z*z-50;
	return Math.min(pmc(x,y,z,lines, imroad, layers), z);
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

