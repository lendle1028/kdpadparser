class FillCommand extends CommandExpression{
    constructor(x, y, color, ownerBlock){
        super("着色", ownerBlock);
        this.x=x;
        this.y=y;
        this.color=color;
    }

    executeCommand(){
        let table=$("#mainTable").get(0);
        $(table.rows.item(this.y.evaluate()).cells.item(this.x.evaluate())).css("background", this.color.evaluate());
    }
}