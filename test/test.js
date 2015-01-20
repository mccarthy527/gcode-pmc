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


function add(x,y){return [x[0]+y[0],x[1]+y[1],x[2]+y[2]];}



//visualize
var bounds = [[-11,-11,0.2], [11,11,11]];				//NEED TO FIX BUG WHERE IF BOUND STARTS AT 0, bottom face is missing!
var center = [100,100,0];
var resolution = [100,100,256];
//var resolution = [64,64,64];
var margin = 0.2;										
// margin is the amount of empty space around object. 
//this is done to ensure a watertight model when only part of the shape will be rendered,
//although it does create rounded edges which is not desireable - probably should look into 
//a better way of doing this
//idea: leave them open in the 3d and then do 2d marching squares on all boundary faces.
bounds = [add(bounds[0],[-margin,-margin,-margin]),add(bounds[1],[margin,margin,margin])];

function implicitwrapper(x,y,z)
{
	//return Math.max(x*x+y*y+z*z-50,-2-z, z-4);
	//return Math.min(pmc(x,y,z,lines, imroad, layers), z);
	
	var model = pmc(x+center[0],y+center[1],z+center[2],lines, imroad, layers);
	//var model = x*x+y*y+z*z-50
	var xmin = bounds[0][0]-x+margin;
	var xmax = x-bounds[1][0]+margin;
	var ymin = bounds[0][1]-y+margin;
	var ymax = y-bounds[1][1]+margin;
	var zmin = bounds[0][2]-z+margin;
	var zmax = z-bounds[1][2]+margin;
	return Math.max(model,xmin,xmax,ymin,ymax,zmin,zmax);
}

/*
for(var ze=-4; ze<6; ze=ze+0.2)
{
	console.log(ze +":\t" + improvedwrapper(0,0,ze));
}
*/

var mymesh = isosurface.surfaceNets(resolution, implicitwrapper, bounds )
var shell = require("mesh-viewer")()
var mesh

shell.on("viewer-init", function() {
  mesh = shell.createMesh(mymesh)
})

shell.on("gl-render", function() {
  mesh.draw()
})