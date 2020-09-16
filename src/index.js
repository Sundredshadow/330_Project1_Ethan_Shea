(function(){
'use strict';

let width=640;//canvas height and width
let height=480;
let rows=height/5;
let cols=width/5;

//populates a 2 dimensional array
let blocks= new Array(cols);//contains all blocks
let movedAlready=new Array(cols);//skips over already moved through blocks
let blockLife=new Array(cols);//skips over blocks that haven't moved in while
let blocksToCheck=[];
for(let i=0;i<cols;i++)
{
    blocks[i]=new Array(rows);
    movedAlready[i]=new Array(rows);
    blockLife[i]=new Array(rows);
}

for(let y=0;y<cols;y++)
{
    for(let z=0;z<rows;z++)
    {
        blocks[y][z]=0;
        movedAlready[y][z]=0;
        blockLife[y][z]=0;
    }
}



//physics functions//////////////////////////////////////////////////////////////////////////
function physics(){
    for(let i=0;i<cols;i++)
    {
        for(let z=0;z<rows;z++)
        {
            if(movedAlready[i][z]==0){
                switch(blocks[i][z]) {
                    case 1:
                    case 3:
                        sandPhysics(i,z,blocks[i][z]);
                    break;
                    case 2:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                        waterPhysics(i,z);
                    break;
                    case 10:
                    case 4:
                        gasPhysics(i,z);
                    break;
                    case 5:break;//no movement aka standing block
                    default:
                    // code block
                }
            }
        }
    }
    for(let y=0;y<cols;y++)
    {
        for(let z=0;z<rows;z++)
        {
            movedAlready[y][z]=0;
        }
    }
}
function sandPhysics(i,z)
{
    //for loop to increase sand particle falling speed
    //uses gravitySpeed as amount allowed to go downward
    for(let a=0;a<edsLIB.GetGravity();a++)
    {
        //gravity also does the check if sand is above a liquid
        if(z+1+a<=rows&&(blocks[i][z+1+a]==0||//empty slot
        (densityCheck(blocks[i][z+a],blocks[i][z+1+a]))||//salt water on water, oil on water,etc
        (interactionCheck(blocks[i][z+a],blocks[i][z+1+a],0,1,i,z,0,a))))//water on salt etc.
        {	
            if(interactionCheck(blocks[i][z+a],blocks[i][z+1+a],0,1,i,z,0,a)==true){}//done inside interaction check
            else{
                let temp=blocks[i][z+1+a];
                blocks[i][z+1+a]=blocks[i][z+a];
                blocks[i][z+a]=temp;
                movedAlready[i][z+a]=1;
                movedAlready[i][z+1+a]=1;
            }
        }
        else{
            a=edsLIB.GetGravity();
        }
    }
    if(movedAlready[i][z]==0)
    {
        //switch the two
        if(z+1<=rows)
        {
            let leftDiag=false;
            let rightDiag=false;
            if(i+1<cols&&(blocks[i+1][z+1]==0||
            densityCheck(blocks[i][z],blocks[i+1][z+1])))//last check is density check//ex:salt water and freshwater
            {
                rightDiag=true;
            }
            if(i-1>=0&&(blocks[i-1][z+1]==0||
            densityCheck(blocks[i][z],blocks[i-1][z+1])))//last check is density check//ex:salt water and freshwater
            {
                leftDiag=true
            }

            if(leftDiag&&rightDiag)
            {
                let x=edsLIB.getRandomInt(0,1);
                if(x==0)
                {
                    rightDiag=false;
                }
                else{
                    leftDiag=false;
                }
            }
            if(rightDiag)
            {
                for(let a=0;a<edsLIB.GetSlide();a++)
                {
                    if(z+1+a<rows&&i+1+a<cols)
                    {
                        if(blocks[i+1+a][z+1+a]!=blocks[i+a][z+a]||
                        interactionCheck(blocks[i+a][z+a],blocks[i+1+a][z+1+a],1,1,i,z,a,a)){
                            if(interactionCheck(blocks[i+a][z+a],blocks[i+1+a][z+1+a],1,1,i,z,a,a)){}
                            else{
                                let temp=blocks[i+1+a][z+1+a];
                                blocks[i+1+a][z+1+a]=blocks[i+a][z+a];
                                blocks[i+a][z+a]=temp;
                                movedAlready[i+1+a][z+1+a]=1;
                                movedAlready[i+a][z+a]=1;
                            }
                        }
                        else{a=edsLIB.GetSlide();}
                    }
                }
            }
            else if(leftDiag)//leftDiag
            {
                for(let a=0;a<edsLIB.GetSlide();a++)
                {
                    if(z+1+a<rows&&i-1-a>=0){
                        if(blocks[i-1][z+1+a]!=blocks[i-a][z+a]||
                        interactionCheck(blocks[i-a][z+a],blocks[i-1-a][z+1+a],-1,1,i,z,-a,a))
                        {
                            if(interactionCheck(blocks[i-a][z+a],blocks[i-1-a][z+1+a],-1,1,i,z,-a,a)){}
                            else{
                                let temp=blocks[i-1-a][z+1];
                                blocks[i-1-a][z+1+a]=blocks[i-a][z+a];
                                blocks[i-a][z+a]=temp;
                                movedAlready[i-1-a][z+1+a]=1;
                                movedAlready[i-a][z+a]=1;
                            }
                        }
                        else{a=edsLIB.GetSlide();}
                    }
                }
            }
        }
    }
}
//since sideMovement is identical for gasPhysics and waterPhysics thus made it a seperate function
function sideMovement(i,z){
    if(movedAlready[i][z]==0)
    {
        //determines which directions are valid
        let left=false;
        let right=false;
        if(i+1<cols&&((blocks[i+1][z]==0)||densityCheck(blocks[i][z],blocks[i+1][z]
        ||interactionCheck(blocks[i][z],blocks[i+1][z],1,0,i,z,0,0))))
        {
            right=true;
        }
        if(i-1>=0&&(blocks[i-1][z]==0||densityCheck(blocks[i][z],blocks[i-1][z]
        ||interactionCheck(blocks[i][z],blocks[i-1][z],-1,0,i,z,0,0))))
        {
            left=true
        }
        //decides which direction left, right, or standstill
        if(left&&right)
        {
            let x=edsLIB.getRandomInt(0,1);
            if(x==0)//1/2 chance right
            {
                left=false;
            }
            else if(x==1)//1/2 chance left
            {
                right=false;
            }
        }
        //carries out those directions according to flowSpeed
        if(right)
        {
            for(let a=0;a<edsLIB.GetFlowSpeed();a++)
            {
                if(i+1+a<cols&&(blocks[i+1+a][z]==0||
                densityCheck(blocks[i][z],blocks[i+1+a][z])||//compare density allow denser liquids flow sideways
                interactionCheck(blocks[i+a][z],blocks[i+1+a][z],1,0,i,z,a,0)))//liquid to liquid interaction. Ex:acid
                {	
                    if(interactionCheck(blocks[i+a][z],blocks[i+1+a][z],1,0,i,z,a,0)==true){}
                    else{
                        let x=edsLIB.getRandomInt(0,edsLIB.GetFlowChance());
                        if(x==0){
                            let temp=blocks[i+1+a][z];
                            blocks[i+1+a][z]=blocks[i+a][z];
                            blocks[i+a][z]=temp;
                            movedAlready[i+1+a][z]=1;
                            movedAlready[i+a][z]=1;
                        }
                    }
                }
                else
                {
                    a=edsLIB.GetFlowSpeed();
                }
            }
        }
        else if(left)//left
        {
            for(let a=0;a<edsLIB.GetFlowSpeed();a++)//check based on a
            {
                if(i-1-a>=0&&(blocks[i-1-a][z]==0||
                densityCheck(blocks[i][z],blocks[i-1][z])||//compare density allow denser liquids flow sideways
                interactionCheck(blocks[i-a][z],blocks[i-1-a][z],-1,0,i,z,-a,0)))//liquid to liquid interaction. Ex:acid
                {
                    if(interactionCheck(blocks[i-a][z],blocks[i-1-a][z],-1,0,i,z,-a,0)==true){}
                    else{
                        let x=edsLIB.getRandomInt(0,edsLIB.GetFlowChance());
                        if(x==0){
                            let temp=blocks[i-1-a][z];
                            blocks[i-1-a][z]=blocks[i-a][z];
                            blocks[i-a][z]=temp;
                            movedAlready[i-1-a][z]=1;
                            movedAlready[i-a][z]=1;
                        }
                    }
                }
                else
                {
                    a=edsLIB.GetFlowSpeed();
                }
            }
        }
        
    }
}
function waterPhysics(i,z)
{
    sandPhysics(i,z);
    sideMovement(i,z);//what seperates water from sand
}
function gasPhysics(i,z)
{
    //for loop to increase gas particle rising speed
    //uses gravitySpeed as amount allowed to go upward
    for(let a=0;a<edsLIB.GetRising();a++)
    {
        //gravity also does the check if sand is above a liquid
        if(z-1-a>=0&&(blocks[i][z-1-a]==0)||
        (densityCheck(blocks[i][z-a],blocks[i][z-1-a]))||
        (interactionCheck(blocks[i][z-a],blocks[i][z-1-a],0,-1,i,z,0,a)))
        {
            let temp=blocks[i][z-1-a];
            blocks[i][z-1-a]=blocks[i][z-a];
            blocks[i][z-a]=temp;
            movedAlready[i][z-a]=1;
            movedAlready[i][z-1-a]=1;
        }
        else{
            a=gravitySpeed;
        }
    }
    if(movedAlready[i][z]==0)
    {
        //switch the two
        if(z-1>=0)
        {
            let leftDiag=false;
            let rightDiag=false;
            if(i+1<cols&&(blocks[i+1][z-1]==0||
            (densityCheck(blocks[i][z],blocks[i+1][z-1]))))
            {
                rightDiag=true;
            }
            if(i-1>=0&&(blocks[i-1][z-1]==0||
            (densityCheck(blocks[i][z],blocks[i-1][z-1]))))
            {
                leftDiag=true
            }

            if(leftDiag&&rightDiag)
            {
                let x=edsLIB.getRandomInt(0,1);
                if(x==0)
                {
                    rightDiag=false;
                }
                else{
                    leftDiag=false;
                }
            }
            if(rightDiag)
            {
                if(blocks[i+1][z-1]!=blocks[i][z]||
                interactionCheck(blocks[i][z],blocks[i+1][z-1],1,-1,i,z,0,0))
                {	if(interactionCheck(blocks[i][z],blocks[i+1][z-1],1,-1,i,z,0,0)){}
                    else{
                        let temp=blocks[i+1][z-1];
                        blocks[i+1][z-1]=blocks[i][z];
                        blocks[i][z]=temp;
                        movedAlready[i+1][z-1]=1;
                        movedAlready[i][z]=1;
                    }
                }
            }
            else if(leftDiag)//leftDiag
            {
                if(blocks[i-1][z-1]!=blocks[i][z]||
                interactionCheck(blocks[i][z],blocks[i-1][z-1],-1,-1,i,z,0,0))
                {
                    if(interactionCheck(blocks[i][z],blocks[i-1][z-1],-1,-1,i,z,0,0)){}
                    else{
                        let temp=blocks[i-1][z-1];
                        blocks[i-1][z-1]=blocks[i][z];
                        blocks[i][z]=temp;
                        movedAlready[i-1][z-1]=1;
                        movedAlready[i][z]=1;
                    }
                }
            }
        }
    }
    sideMovement(i,z);//execute side movement code identical to water so in a seperate function
}

//helpers/////////////////////////////////////////
//allows easy identification of type of physics that needs to be used based on block iD in blocks
//has been rendered obsolete currently. Basically a single get for physics of all types of blocks.
function physicsType(iD)
{
    //1,3 sand//2,6 water//4 gas
    let physicsType
    switch(iD) {
        case 1:
        case 3:
            physicsType=1;
        break;
        case 2:
        case 6:
        case 7:
        case 8:
        case 9:
            physicsType=2;
        break;
        case 4:
        case 10:
            physicsType=3;
        break;
        default:
        // code block
    }
    return physicsType;
}

//returns if iD2 is lower density return true
function densityCheck(iD1,iD2)
{
    switch(iD1)
    {
        case 1: //sand
            if(iD2==2||iD2==6||iD2==7||iD2==8){return true;}
        break;
        case 2://water
            if(iD2==7||iD2==8){return true;}
        break;
        case 3://salt
            if(iD2==2||iD2==6||iD2==7||iD2==8){return true;}
        break;
        case 4://smoke
            if(iD2==10){return true;}
        break;
        case 5://ground
        break;
        case 6://salt water
            if(iD2==2||iD2==7||iD2==8){return true;}
        break;
        case 7://oil
            if(iD2==8){return true;}
        break;
        case 8://acid
        break;
        case 9://mercury
            if((iD2==1||iD2==2||iD2==3||iD2==6||iD2==7||iD2==8)){return true;}
        break;
        case 10://fire
        break;
        default:
        return false;
    }
    return false;
}

//pass in two Ids if interaction valid
//use location of iD2, and i,z//intial location,(a:ax,ay)//speed factors to make stuff happen
function interactionCheck(iD1,iD2,iD2x,iD2y,i,z,ax,ay)
{
    switch(iD1){
        case 2://water
        case 3://salt
            if(iD2+iD1==5)
            {
                if(iD1==3&&iD2==2){
                    blocks[i+iD2x+ax][z+iD2y+ay]=6;//turns into salt water
                    blocks[i+ax][z+ay]=0;
                }
                else{
                    blocks[i+iD2x+ax][z+iD2y+ay]=0;//turns into salt water
                    blocks[i+ax][z+ay]=6;
                }
                movedAlready[i+ax][z+ay]=1;
                movedAlready[i+iD2x+ax][z+iD2y+ay]=1;
                return true;
            }
            if(iD2==8)
            {
                blocks[i+iD2x+ax][z+iD2y+ay]=0;
                blocks[i+ax][z+ay]=0;
                movedAlready[i+ax][z+ay]=1;
                movedAlready[i+iD2x+ax][z+iD2y+ay]=1;
                return true;
            }
            return false;
        break;
        case 1:
        case 4:
        case 6:
        case 7:
        case 9:
        case 10:
            if(iD2==8)
            {
                blocks[i+iD2x+ax][z+iD2y+ay]=0;
                blocks[i+ax][z+ay]=0;
                movedAlready[i+ax][z+ay]=1;
                movedAlready[i+iD2x+ax][z+iD2y+ay]=1;
                return true;
            }
            return false;
        break;
        case 8://acid deletes everything
            if(iD2!=0&&iD2!=8&&iD2!=5){
                blocks[i+iD2x+ax][z+iD2y+ay]=0;
                blocks[i+ax][z+ay]=0;
                movedAlready[i+ax][z+ay]=1;
                movedAlready[i+iD2x+ax][z+iD2y+ay]=1;
                return true;
            }
            return false;
        break;
        case 7:
            if(iD2==10)
            {
                blocks[i+iD2x+ax][z+iD2y+ay]=7;
                blocks[i+ax][z+ay]=7;
                movedAlready[i+ax][z+ay]=1;
                movedAlready[i+iD2x+ax][z+iD2y+ay]=1;
            }
        break;
        case 10:
            if(iD2==7)
            {
                blocks[i+iD2x+ax][z+iD2y+ay]=7;
                blocks[i+ax][z+ay]=7;
                movedAlready[i+ax][z+ay]=1;
                movedAlready[i+iD2x+ax][z+iD2y+ay]=1;
            }
        break;
    }
    return false;
}

function GetBlocks()
{
    return blocks;
}

window.index={physics,GetBlocks};
})()