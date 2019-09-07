class MoveCommand extends CommandExpression{
    constructor(direction, distance, ownerBlock){
        super("移動", ownerBlock);
        this.direction=direction;
        this.distance=distance;
    }

    executeCommand(){
        let player=$("#player").get(0);
        let currentX=parseInt($(player).attr("cell_x"));
        let currentY=parseInt($(player).attr("cell_y"));
        let newX=currentX;
        let newY=currentY;
        let direction=this.direction.evaluate();
        let distance=this.distance.evaluate();
        if(direction=="左"){
            newX=newX-distance;
        }else if(direction=="右"){
            newX=newX+distance;
        }else if(direction=="上"){
            newY=newY-distance;
        }else if(direction=="下"){
            newY=newY+distance;
        }
        let id="cell_"+newX+"_"+newY;
        let newCell=document.getElementById(id);
        if(newCell){
            //then we can move to the cell
            let rect=newCell.getBoundingClientRect();
            $(player).css("top", rect.top+"px");
            $(player).css("left", rect.left+"px");
            $(player).attr("cell_x", ""+newX);
            $(player).attr("cell_y", ""+newY);
        }
    }
}

class SleepCommand extends CommandExpression{
    constructor(seconds, ownerBlock){
        super("睡覺", ownerBlock);
        this.seconds=seconds;
    }

    async executeCommand(){
        await sleep(this.seconds.evaluate()*1000);
    }
}