(function(){

//fill random array before load so can use psuedo randomint
let randoms= new Float32Array(1000).fill(0);
for(let z=0;z<1000;z++)
{  
    randoms[z]=Math.random();
}   


function draw(ctx,cols,rows,blocks){
    //let a=drawFewer(ctx);
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

function cls(ctx,width,height){//clear screen
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

//other useful functions not used for this project////////////////////////////////////////////
function drawRandomRect(ctx){
    drawRectangle(ctx,getRandomInt(0,canvasWidth),getRandomInt(0,canvasHeight),getRandomInt(drawParams.minRectWidth,drawParams.maxRectWidth),getRandomInt(drawParams.minRectWidth,drawParams.maxRectWidth),edsLIB.getRandomColor(),edsLIB.getRandomInt(drawParams.minStrokeWidth,drawParams.maxStrokeWidth),edsLIB.getRandomColor());
}

function drawRandomCircle(ctx){
    drawCircle(ctx,getRandomInt(0,canvasWidth),getRandomInt(0,canvasHeight),getRandomInt(20,300),getRandomColor(),getRandomInt(drawParams.minStrokeWidth,drawParams.maxStrokeWidth),edsLIB.getRandomColor()); 
}

function drawRandomLine(ctx){
    drawLine(ctx,getRandomInt(0,canvasWidth),getRandomInt(0,canvasWidth),getRandomInt(0,canvasWidth),getRandomInt(0,canvasWidth),getRandomInt(drawParams.minStrokeWidth,drawParams.maxStrokeWidth),edsLIB.getRandomColor())
}

function drawCircle(ctx,x,y,radius, fillStyle="black",lineWidth=0,strokeStyle="black")
{
    ctx.fillStyle=fillStyle;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x,y,radius,0,Math.PI*2,false); 
    ctx.closePath();
    ctx.fill();
    if(lineWidth>0)
    {
        ctx.lineWidth=lineWidth;
        ctx.strokeStyle=strokeStyle;
        ctx.stroke();
    }
    ctx.restore();
}
function drawLine(ctx,x1,y1,x2,y2,lineWidth=1,strokeStyle="black")
{
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.closePath(); 
    if(lineWidth<=0)
    {
        lineWidth=1;
    }
    ctx.lineWidth=lineWidth;
    ctx.strokeStyle=strokeStyle
    ctx.stroke();
    ctx.restore();
}

function GetRandomIntegerArr()
{
    return randoms;
}
window.edsLIB={getRandomInt,GetRandomIntegerArr,cls,draw,drawRandomRect,drawRandomCircle,drawRandomLine,drawLine,drawCircle};
})()