class PrintCommand extends CommandExpression{
    constructor(message=null, ownerBlock=null){
        super("print", new Array(message), null, ownerBlock);
        this.message=message;
    }

    executeCommand(){
        console.log(this.message);
        if(document){
            document.write(this.message);
        }
        return null;
    }
}