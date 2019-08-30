class PrintCommand extends CommandExpression{
    constructor(message=null, ownerBlock=null){
        super("印出", new Array(message), null, ownerBlock);
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

class SetVarCommand extends CommandExpression{
    constructor(varName=null, value=null, ownerBlock=null){
        super("設定", new Array(value), null, ownerBlock);
        this.value=value;
        this.varName=varName;
    }

    executeCommand(){
        this.ownerBlock.set(this.varName, this.value);
    }
}