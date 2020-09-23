(function(){

//fill random array before load so can use psuedo randomint
let randoms= new Float32Array(1000).fill(0);
for(let z=0;z<1000;z++)
{  
    randoms[z]=Math.random();
}   


window.onload = init;
let width=640;//canvas height and width
let height=480;
let rows=height/5;
let cols=width/5;
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

let basetime=Date.now();
let fpsCap=1000/60;//denominator is fps

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

    cls(ctx);
    setupUI();
    update(ctx);
}

let play=true;
//core drive functions aka update/draw
function update(){
    let now=Date.now();
    let check=now-basetime;
    if(check/fpsCap>=1){
        basetime=now;
        if(play){
            cls(ctx); 
            index.physics();
            draw(ctx);
        }
    }
    requestAnimationFrame(update);
}
function draw(ctx){
    //let a=drawFewer(ctx);
    let blocks=index.GetBlocks();
    for(let i=0;i<cols;i++)
    {
        for(let z=0;z<rows;z++)
        {
            switch(blocks[i+z*cols]){
                case 1:
                drawRectangle(ctx,i*5,z*5,5,5,"yellow");//sand
                break;
                case 2:
                drawRectangle(ctx,i*5,z*5,5,5,"blue");//water
                break;
                case 3:
                drawRectangle(ctx,i*5,z*5,5,5,"white");//salt
                break;
                case 4:
                drawRectangle(ctx,i*5,z*5,5,5,"rgba(220,220,220,0.1)");//smoke
                break;
                case 5:
                drawRectangle(ctx,i*5,z*5,5,5,"gray");//solid block
                break;
                case 6://salt water
                drawRectangle(ctx,i*5,z*5,5,5,"cyan");
                break;
                case 7://oil
                drawRectangle(ctx,i*5,z*5,5,5,"brown");
                break;
                case 8://acid
                drawRectangle(ctx,i*5,z*5,5,5,"#90ee90");//light green
                break;
                case 9:
                drawRectangle(ctx,i*5,z*5,5,5,"#BBBBBB");//mercury
                break;
                case 10:
                drawRectangle(ctx,i*5,z*5,5,5,"red");//fire
                break;
                case 11:
                drawRectangle(ctx,i*5,z*5,5,5,"red");//fire
                break;
                case 12:
                drawRectangle(ctx,i*5,z*5,5,5,"orange");//fire
                break;
                break;
                default:
            }
        }
    }	
}

function cls(ctx){//clear screen
    ctx.clearRect(0,0,width,height);
    drawRectangle(ctx,0,0,width,height);
}


//psuedo random got a bunch of randoms before window loaded and iterates through
//not used here but useful as a library tool
let posRand=0;
function getRandomInt(min, max) {
    if(posRand>=1000){posRand=0;}
    let temp=Math.floor(randoms[posRand] * (max - min + 1)) + min;
    posRand++;
    return temp;
}

function drawRectangle(ctx,x,y,width,height,fillStyle="black",lineWidth=0,strokeStyle="black")
{
    ctx.fillStyle=fillStyle;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x,y,width,height);
    ctx.closePath(); 
    ctx.fill();
    if(lineWidth>0){
        ctx.lineWidth=lineWidth;
        ctx.strokeStyle=strokeStyle;
        ctx.stroke();
    }
    ctx.restore();
}


//click and drag functionality
let timer;//time id for click and hold
let xClient=0;
let yClient=0;    
function addBlocks(e)
{
    let blocks=index.GetBlocks();
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
        index.WipeBlocks();
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

function GetRandomIntegerArr()
{
    return randoms;
}

window.edsLIB={GetRandomIntegerArr,GetGravity,GetSlide,GetFlowSpeed,GetFlowChance,GetRising};
})()