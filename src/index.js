(function(){

    window.onload = init;
    let canvas;
    let ctx;
    let blockType=1;//current type of block on click placed
    let penSize=2;
    
    //a values aka speed values
    let gravitySpeed=1;//constant vel going downward
    let slideSpeed=1;//constant vel going downward
    let risingSpeed=1;//amount gas is allowed to rise upward per frame
    let flowSpeed=1;//current flow speed of water
    let flowChance=1
    
    let width=640;//canvas height and width
    let height=480;
    let rows=height/5;
    let cols=width/5;


    let basetime=Date.now();
    let fpsCap=1000/60;//denominator is fps
    
    let play=true;
//intialize
function init(){
    
    // #2 Now that the page has loaded, start drawing!
    console.log('init called');
    
    // A - canvas variable points at <canvas> tag
    canvas= document.querySelector("canvas");
    canvas.height=height;
    canvas.width=width;
    // B - the ctx variable points at a "2D drawing context"
    ctx=canvas.getContext("2d");
    

    //event listeners
    canvas.addEventListener('mousedown',addBlocks,false);
    canvas.addEventListener('click',mouseClick,false);
    canvas.addEventListener('mouseleave',mouseClick,false);
    canvas.addEventListener('mousemove',mouseMove,false);

    edsLIB.cls(ctx,width,height);
    setupUI();
    update(ctx);
}

//core drive functions aka update/draw
function update(){
    let now=Date.now();
    let check=now-basetime;
    if(check/fpsCap>=1){
        basetime=now;
        if(play){
            edsLIB.cls(ctx,width,height); 
            physics.physics();
            edsLIB.draw(ctx,cols,rows,physics.GetBlocks());
        }
    }
    requestAnimationFrame(update);
}

//click and drag functionality
let timer;//time id for click and hold
let xClient=0;
let yClient=0;    
function addBlocks(e)
{
    if(play){
    let blocks=physics.GetBlocks();
    let rect=canvas.getBoundingClientRect();
    let centerX=Math.round((xClient-rect.left)/5)*5;
    let centerY=Math.round((yClient-rect.top)/5)*5;
    for(let c=-1;c<penSize;c++)
    {
        for(let a=-1;a<penSize;a++)
        {
            if(centerX+(c*5)<640&&centerX+(c*5)>=0){
                blocks[((centerX+(c*5))/5)+(((centerY+(a*5))/5))*cols]=blockType;
            }
        }
    }
    }
    //console.log(x+","+y);
    timer=setTimeout(function(){addBlocks(e)},0);
}
function mouseMove(e){
    xClient=e.clientX;
    yClient=e.clientY;
}
function mouseClick(e)
{
    clearTimeout(timer);
}

//setup button events
function setupUI()
{
    //block section
    document.querySelector("#Void").onclick=function()
    {
        blockType=0;
    };
    document.querySelector("#Sand").onclick=function()
    {
        blockType=1;
    };
    document.querySelector("#Water").onclick=function()
    {
        blockType=2;
    };
    document.querySelector("#Salt").onclick=function()
    {
        blockType=3;
    };
    document.querySelector("#Smoke").onclick=function()
    {
        blockType=4;
    };
    document.querySelector("#Wall").onclick=function()
    {
        blockType=5;
    };
    document.querySelector("#SaltWater").onclick=function()
    {
        blockType=6;
    };
    document.querySelector("#Oil").onclick=function()
    {
        blockType=7;
    };
    document.querySelector("#Acid").onclick=function()
    {
        blockType=8;
    };
    document.querySelector("#Mercury").onclick=function()
    {
        blockType=9;
    };
    document.querySelector("#Fire").onclick=function()
    {
        blockType=10;
    };
    //slider section
    document.querySelector("#gravitySpeed").oninput = function() {
        gravitySpeed = this.value;
    }		
    document.querySelector("#flowChance").oninput = function() {
        flowChance = this.value;
    }	
    document.querySelector("#flowSpeed").oninput = function() {
        flowSpeed = this.value;
    }	
    document.querySelector("#penSize").oninput = function() {
        penSize = this.value;
    }
    //other
    document.querySelector("#Reset").onclick=function()
    {
        physics.WipeBlocks();
        edsLIB.cls(ctx,width,height);
    };
    document.querySelector("#PausePlay").onclick=function()
    {
        play=!play;
    };
}


//speed getters//////////////////////////
function GetGravity()
{
    return gravitySpeed;
}

function GetSlide()
{
    return slideSpeed;
}

function GetFlowSpeed()
{
    return flowSpeed;
}

function GetRising()
{
    return risingSpeed;
}

function GetFlowChance()
{
    return flowChance;
}
window.index={GetGravity,GetSlide,GetFlowSpeed,GetFlowChance,GetRising};
})()