"use strict"

module.exports = pmc_optimized;

//road must be a function of the form road(x,y,z,sx,sy,sz,ex,ey,ez,w,h)

function pmc(x,y,z,lines, road, layers)
{
	//var approxdist = Infinity
	var approxdist = 10000;
	
	for(var i=0; i<lines.lines.length; i++)
	{
		if(lines.extruded[i] > 0) //find extrusion moves
		{
			
			var sp = lines.lines[i][0]	//start point
			var ep = lines.lines[i][1]	//end point

			var w = 2;		// !!!TODO!!!! need to actually figure these out!!!
			var h = 1;		// !!!TODO!!!! need to actually figure these out!!!
			approxdist = Math.min(approxdist, road(x,y,z,sp[0],sp[1],sp[2],ep[0],ep[1],ep[2],w,h));
		}
	}
	return approxdist;
}

//loop through layers first and then check roads within the correct layers
function pmc_optimized(x,y,z,lines, road, layers)
{
	var approxdist = Infinity
	for(var i=0; i<layers.length; i++)
	{
		if( z >= layers[i].startheight && z <= layers[i].endheight)
		{
			//iterate through lines in this layer
			for(var j = 0; j<layers[i].lineindicies.length; j++)
			{
				var currlineindex = layers[i].lineindicies[j]
				var currline = lines.lines[currlineindex];
				var sp = currline[0];
				var ep = currline[1];
				
				
				
				//TODO NEED TO SEE IF E IS A ZERO(NON EXTRUSION MOVE!!!! ---v
				
				
				var E = lines.extruded[currlineindex]				//length in mm of material extruded		
				var Df = 3											//filament diameter
				var Ve = 3.14159265359/4*Df*Df*E					//volume of extruded material
				var h = layers[i].endheight-layers[i].startheight;	//layer height
				approxdist = Math.min(approxdist, road(x,y,z,sp[0],sp[1],sp[2],ep[0],ep[1],ep[2],Ve,h));
			}
		}
	
	}
	return approxdist;
}