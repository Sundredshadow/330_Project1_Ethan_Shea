// self.onmessage=function(e){
//     console.log("loaded web worker");
//     physics();
//     this.postMessage(blocks);
// }
(function(){
'use strict';

let width=640;//canvas height and width
let height=480;
let rows=height/5;
let cols=width/5;

//populates a 2 dimensional array
let blocks= new Uint8Array(cols*rows).fill(0);//contains all blocks
let movedAlready=new Uint8Array(cols*rows).fill(0);//skips over already moved through blocks


//worker
let worker;
if(window.Worker){
    worker=new Worker('src/physicsWorker.js');
    worker.addEventListener("message",(d)=>{
        blocks=d.data.physicsDataResult.blocks;
        movedAlready=d.data.physicsDataResult.movedAlready;
    });
}
//getRandomInt,GetGravity,GetSlide,GetFlowSpeed,GetFlowChance,GetRising
//physics functions//////////////////////////////////////////////////////////////////////////
function physics(){
    //worker code
    let message={physicsData:{blocks:blocks,movedAlready:movedAlready,
        gravitySpeed:edsLIB.GetGravity(),
        slideSpeed:edsLIB.GetSlide(),
        flowSpeed:edsLIB.GetFlowSpeed(),
        flowChance:edsLIB.GetFlowChance(),
        randomInts:edsLIB.GetRandomIntegerArr()}}
    worker.postMessage(message);
}

function GetBlocks()
{
    return blocks;
}

//functionality for reset with reload page
function WipeBlocks(){
    blocks= new Uint8Array(cols*rows).fill(0);//contains all blocks
    movedAlready=new Uint8Array(cols*rows).fill(0);//skips over already moved through blocks
}

window.index={physics,GetBlocks,WipeBlocks};
})()
