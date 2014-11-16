window.onload = function (){
	var r = new X.renderer3D();
	r.init();


//NOTE**** transforms are currently hacked to accomodate this specific dataset. eventually will need to read and apply arbitrary matrix transforms.
//right hemisphere pial surface
	var meshright = new X.mesh();
	meshright.color = [0.2, 0.5, 0.4];
	meshright.file = 'rh.pial';
	meshright.transform.flipY();
	meshright.transform.flipX();
	//meshright.type = "LINES";

	//var colortrans = [255,255,255];
//left hemisphere pial surface
	var meshleft = new X.mesh();
	meshleft.color = [0.6, 0.1, 0.1];
	meshleft.file = 'lh.pial';
	meshleft.transform.flipY();
	meshleft.transform.flipX();
	//meshleft.type = "LINES";

//.nii volume 
	var brainvol = new X.volume();
	var actvol = new X.volume();
	actvol.file = 'tstat_only.nii';

	brainvol.file = 'T1High_allmerge+tlrc.nii';

	actvol.minColor = [0, 0.06666666666666667, 1];
	actvol.maxColor = [0.5843137254901961, 1, 0];
	actvol.volumeRendering = true;
	actvol.opacity=0.2;
	actvol.lowerThreshold=5;
	actvol.upperThreshold=6;

	//brainvol.volumeRendering = true;
	//brainvol.magicmode = true;
	r.add(meshright);
	r.add(meshleft);
	r.add(actvol);
	r.add(brainvol);

	var gui = null;

	r.onShowtime = function() {

		//onshowtime is loading too quickly	
        //if (gui) return;
		
		if(gui){
			gui.destroy();
			gui = null;
		}
		
		//GUI Panel


		//var meshWasLoaded = false;
		gui = new dat.GUI();

		var volumegui = gui.addFolder('Volume'); //this is the problem line!!! causes 2 windows to open?
		
		
		//slice controls
		var sliceXController = volumegui.add(brainvol, 'indexX', 0, brainvol.dimensions[0] - 1);
		var sliceYController = volumegui.add(brainvol, 'indexY', 0, brainvol.dimensions[1] - 1);
		var sliceZController = volumegui.add(brainvol, 'indexZ', 0, brainvol.dimensions[2] - 1);
		var volumeOpacity = volumegui.add(brainvol, 'opacity', 0,1);
		
		//threshold controls
		var lowerVolThresholdController = volumegui.add(brainvol, 'lowerThreshold', brainvol.min, brainvol.max);
		var upperVolThresholdController = volumegui.add(brainvol, 'upperThreshold', brainvol.min, brainvol.max);
		
		var actgui = gui.addFolder('Activation');
		var lowerActThresholdController = actgui.add(actvol, 'lowerThreshold', actvol.min, actvol.max).step(0.05);
		var upperActThresholdController = actgui.add(actvol, 'upperThreshold', actvol.min, actvol.max).step(0.05);
		var actOpacity = actgui.add(actvol, 'opacity', 0,0.5);


		var rightmeshgui = gui.addFolder('Right Mesh');
		var meshOpacityRight = rightmeshgui.add(meshright, 'opacity', 0,1);
		var meshColorRight = rightmeshgui.addColor(meshright, 'color');
		//.onChange(function(value){alert(value)});
		rightmeshgui.open();

		var leftmeshgui = gui.addFolder('Left Mesh');
		var meshOpacityLeft = leftmeshgui.add(meshleft, 'opacity', 0,1);
		var meshColorLeft = leftmeshgui.addColor(meshleft, 'color');
		leftmeshgui.open();
		//var meshgui = gui.addFolder('Mesh');

		actgui.open();

		volumegui.open();
		//color values coming from controller are 255 scaled, causing assignment error.
		/*
		
		meshColorRight.onChange(function(value){
			meshright.color = [value[0]/255,value[1]/255,value[3]/255];
			meshright.modified();
		});
		*/
	};



/*	
  	if(!meshWasLoaded){

		r.add(meshright);
		r.add(meshleft);

		r.onShowtime = function(){

		}	
	};
*/
	r.onShowtime();
	r.render();


};