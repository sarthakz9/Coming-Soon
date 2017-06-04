//global variables
//objects in canvas & frames
var dude,dudecopy,skycopy,sky,sky2,sun,suncopy,gate,guard,darksky,bubble,W,H;
var skyimg,darkskyimg,sunimg,gateimg,guardimg,dudeimg,bubbleimg;
var frame=[],text=[];
var dudewidth,sunwidth,control=1,forward=true,lineno=0;
var maxX=20,minX,talkinitiated=false,timecounter=0;
var orgW=1000,orgH=600;
// initialise loaders for each frame, work on loading meter
function checkOrientation()
{
	if(window.matchMedia("(orientation: portrait)").matches) {
		alert("Please switch to Landscape Mode");
	}
}
$(window).on("orientationchange",function(){
  if(window.orientation == 0) // Portrait
  {
	  checkOrientation();
  }
  else // Landscape
  {
	  window.location.reload(false);
  }
});

function init() {
	checkOrientation();
	frame.push(new createjs.Stage("intro1"));
     frame.push(new createjs.Stage("intro2"));
	window.addEventListener("resize", resize);

	 W = window.innerWidth;
   	 H = window.innerHeight-(window.innerHeight*0.1);

	//positionFrame();
     // loading every graphic before hand
	manifest = [
     {src: "../resources/images/skybg_1.png", id: "sky"},
     {src:"../resources/images/skybg2.png",id:"darksky"},
	{src:"../resources/images/moon.png",id:"sun"},
	{src:"../resources/images/mainavatar.png",id:"dude"},
	{src:"../resources/images/guard.png",id:"guard"},
	{src:"../resources/images/gates.png",id:"gates"},
	{src:"../resources/images/talk.png",id:"bubble"}
	];
     loader = new createjs.LoadQueue(false);
	loader.addEventListener("complete", handleComplete);
	loader.loadManifest(manifest);
	createjs.Ticker.addEventListener("tick", counter);
	createjs.Ticker.interval=2000; //in ms
}

//initialise each frame
function handleComplete() {
     initFrameElements();

	frame[0].addChild(sky,dude,sun);
	dudecopy=frame[0].getChildAt(1).clone(true);
	dudecopy.x-=W;
	suncopy=frame[0].getChildAt(2).clone(true);
	suncopy.x-=W;
	frame[1].addChild(sky2,dudecopy,suncopy,gate,guard);
	resize();
	updateAll(event);

}

function initFrameElements()
{
     //=======================================background-sky==================================
     skyimg=loader.getResult("sky");
     sky = new createjs.Shape();
     sky.graphics.beginBitmapFill(skyimg).drawRect(0, 0, W, H);
	//=======================================================================================
	darkskyimg=loader.getResult("darksky");
     sky2 = new createjs.Shape();
     sky2.graphics.beginBitmapFill(darkskyimg).drawRect(0, 0, darkskyimg.width, darkskyimg.height);
	//=====================================background-sun====================================
	sunimg=loader.getResult("sun");
     sun = new createjs.Shape();
     sun.graphics.beginBitmapFill(sunimg).drawCircle(87, 89, 89);
	//=====================================gate=====================================
	gateimg=loader.getResult("gates");
     var gatesheet = new createjs.SpriteSheet({
     framerate: 10,
     images: [gateimg],
     frames: {width:400, height:700, count:5, regX:0, regY:0, spacing:0, margin:0
     },
     // define two animations, run (loops, 1.5x speed) and jump (returns to run):
     animations: {
	"pool":[0,4,"pool",0.1],
     }
     });
	gate = new createjs.Sprite(gatesheet, "pool");
	//=====================================guard=====================================
	guardimg=loader.getResult("guard");
     var guardsheet = new createjs.SpriteSheet({
     framerate: 15,
     images: [guardimg],
     frames: {width:175, height:190, count:4, regX:0, regY:0, spacing:0, margin:0
     },
     // define two animations, run (loops, 1.5x speed) and jump (returns to run):
     animations: {
	"stand":[0,0,"stand"],
     "point":[0,3,"pointpos",0.1],
	"pointpos":[3,3,"pointpos"]
     }
     });
	guard = new createjs.Sprite(guardsheet, "stand");
     //======================================main-Avatar=======================================

     dudeimg=loader.getResult("dude");
     var dudeSheet = new createjs.SpriteSheet({
     framerate: 15,
     images: [dudeimg],
     frames: {width:250, height:190, count:7, regX:0, regY:0, spacing:0, margin:0
     },
     // define two animations, run (loops, 1.5x speed) and jump (returns to run):
     animations: {
     "stand":[6,6,"stand"],
     "runf": [0, 6,"runf",0.2],
     "runb":{
		frames:[6,5,4,3,2,1,0],
		next:"runb",
		speed:0.2
	}
     }
     });
	dude = new createjs.Sprite(dudeSheet, "runf");
	dude.x=-dude.getBounds().width;
	//=============================bubble and text================================
	bubbleimg=loader.getResult("bubble");
     bubble = new createjs.Shape();
     bubble.graphics.beginBitmapFill(bubbleimg).drawRect(0, 0, 206, 150);

	text.push("Its seems like you are Lost kid");
	text.push("I am The Guardian of this\n                    PORTAL.");
 	text.push("\nThis portal will materialize\n           you straight to \n                    J.I.I.T.");
	text.push("    J.I.I.T's technical fest,\n         CYBER SRISHTI \n            is around the corner.");
	text.push("The portal is under construction,\n                See Yaa Soon !!");
	text.push("        Back off !!...\n              ;[ ");
	scaleElements();
}

function scaleElements()
{
	sky.x=0;
     sky.y=0;
     sky.scaleX=W/skyimg.width;
     sky.scaleY=(H)/skyimg.height;
	//================================================================
	sky2.x=0;
     sky2.y=0;
     sky2.scaleX=W/darkskyimg.width;
     sky2.scaleY=(H)/(darkskyimg.height);
	//================================================================
	sunwidth=sunimg.width;
     sun.setTransform(W-W/30-sunwidth,H/30,W/(10*sunimg.width),W/(10*sunimg.width));
	//================================================================
	gatewidth=gate.getBounds().width;
	gate.setTransform(W-W/4 , H/8, W/(4*gatewidth),H/(1.2*gate.getBounds().height));
	//================================================================
	guard.scaleX=W/(6*guard.getBounds().width);
	guard.scaleY=H/(2*guard.getBounds().height)
	guardwidth=guard.getBounds().width; //equal in every frame
	guard.x=gate.x-W/6;
	guard.y= H-guard.scaleY*guard.getBounds().height;
	//================================================================
	dudewidth=dude.getBounds().width; //equal in every frame
	dude.scaleX=W/(6*dude.getBounds().width);
	dude.scaleY=H/(2*dude.getBounds().height)

	dude.y= H-dude.scaleY*dude.getBounds().height;
	//================================================================
	bubble.scaleX=W/(2*bubbleimg.width);
	bubble.scaleY=H/(2.5*bubbleimg.height);
	bubble.x=guard.x-W/2.5;
	bubble.y=H/4;
}

var x=0;
function markThe(event)
{
	if(dudecopy.x<(W/10-100)||(scrolldelta<0 && !talkinitiated))
	{
		play1(event,dude,sun);
		play1(event,dudecopy,suncopy);
		movecontainerbackward=dude.x>W/4?true:false;
		setanimation(guard,"stand",guard.currentAnimation);
		lineno=0;
		talkinitiated=false;
		frame[1].removeChildAt(5,6);
	}
	else
	{

		setanimation(dudecopy,"stand",dudecopy.currentAnimation);
		if(parseInt(document.getElementById("mymain_container").style.left)<=minX)
			movecontainerbackward=false;
		if(guard.currentAnimation!="pointpos")
			setanimation(guard,"point",guard.currentAnimation);

		if(dudecopy.currentAnimation=="stand"&&guard.currentAnimation=="pointpos")
		{
			//initiate talk
			talkinitiated=true;
			if(x!=timecounter && lineno<text.length)
			{
				var mytext=text[ lineno ];
	  			var writetext = new createjs.Text(mytext, "40px Book Antiqua bold", "rgba(0,0,0,1)");
				writetext.scaleX=W/(3*writetext.getBounds().width);
				writetext.scaleY=H/(5*writetext.getBounds().height);
				writetext.x=bubble.x+(W/2-W/3)/2;//2.5*parseFloat($("body").css("font-size"));
				writetext.y=bubble.y+0.800*parseFloat($("body").css("font-size"));
				frame[1].removeChildAt(5,6);
				frame[1].addChild(bubble,writetext);
				lineno++;
				x=timecounter;
			}
		}
		if(scrolldelta<0 && talkinitiated)
			lineno--;

		if(lineno<0||lineno>=text.length-1)
			talkinitiated=false;

	}
	updateAll(event);
}

function updateAll(event)
{
	frame[0].update(event);
	frame[1].update(event);
}

function play1(event,dudeobj,sunobj)
{
	var pos=dudeobj.x+(scrollsenstivity*scrolldelta);
	if(dude.x>=-dudewidth)
	{
		dudeobj.x=pos;
		if(scrolldelta>0)
			{setanimation(dudeobj,"runf",dudeobj.currentAnimation);}
		else
			{setanimation(dudeobj,"runb",dudeobj.currentAnimation);}
	}
	else
		dude.x=-dudewidth;
	sunobj.x=dudeobj.x+(W/2);
}

function setanimation(obj,set,old)
{
	if(set!=old)
	{
		obj.gotoAndPlay(set);
	}
}

function positionFrame()
{
	var x=(window.innerHeight-H)/2;
	document.getElementById("mymain_container").style.top = x+"px";
	document.getElementById("intro1").width = W;
	document.getElementById("intro1").height = H;
	document.getElementById("intro2").width = W;
	document.getElementById("intro2").height = H;
	//intro image
	document.getElementById("introimg").style.width =(window.innerWidth)+"px";
	document.getElementById("introimg").style.height =(window.innerHeight) +"px";
	minX=(window.innerWidth-(2*(W+maxX)));

	dudecopy.y=dude.y;
	dudecopy.x=dude.x-W;
	scaleElements();
	updateAll();
}

//resize event
function resize() {

    W = window.innerWidth/parseFloat($("body").css("font-size"));
    W*=15;
    H = window.innerHeight-(window.innerHeight*0.1);
    positionFrame();
    //alert("coming "+W+" "+H+" "+window.innerWidth+" "+$(window).width());

}

function counter()
{
	timecounter++;
}
