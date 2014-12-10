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

var data = fs.readFileSync(__dirname + "/5mmpartial.gcode")
//var data = fs.readFileSync(__dirname + "/test.gcode")

var fileContent = data.toString()
var states = gc(fileContent)
var lines = sl(states)
var layers = lines2layers(lines)

/*
for(var ze=-0.1; ze<0.6; ze=ze+0.1)
{
	console.log(ze +":\t" + pmc(0,0,ze,lines, imroad, layers));
}
*/



//console.log(layers);
//console.log(lines);
function implicitwrapper(x,y,z)
{
	//return x*x+y*y+z*z-50;
	//return Math.min(pmc(x,y,z,lines, imroad, layers), z);
	return pmc(x+100,y+100,z,lines, imroad, layers);
}

//visualize
var mymesh = isosurface.surfaceNets([64,64,64], implicitwrapper, [[-7,-7,-0.12], [7,7,10]])
var shell = require("mesh-viewer")()
var mesh

shell.on("viewer-init", function() {
  mesh = shell.createMesh(mymesh)
})

shell.on("gl-render", function() {
  mesh.draw()
})

