"use strict"

module.exports = pmc;

//road must be a function of the form road(x,y,z,sx,sy,sz,ex,ey,ez,w,h)

function pmc(x,y,z,lines, road)
{
	var approxdist = Infinity
	
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