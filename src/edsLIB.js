(function(){

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

//core drive functions aka update/draw
function update(){
    requestAnimationFrame(update);
    index.physics();
    draw(ctx);
}
function draw(ctx){
    //let a=drawFewer(ctx);
    for(let i=0;i<cols;i++)
    {
        let blocks=index.GetBlocks();
        for(let z=0;z<rows;z++)
        {
            switch(blocks[i][z]){
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
                drawRectangle(ctx,i*5,z*5,5,5,"#BBBBBB");
                break;
                case 10:
                drawRectangle(ctx,i*5,z*5,5,5,"red");
                break;
                default:
            }
        }
    }	
}

function cls(ctx){//clear screen
    setTimeout(function(){cls(ctx);},1);
    ctx.clearRect(0,0,width,height);
    drawRectangle(ctx,0,0,width,height);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
                blocks[(centerX+(c*5))/5][((centerY+(a*5))/5)]=blockType;
            }
        }
    }
    //console.log(x+","+y);
    timer=setTimeout(function(){addBlocks(e)},1);
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
window.edsLIB={getRandomInt,GetGravity,GetSlide,GetFlowSpeed,GetFlowChance,GetRising};
})()