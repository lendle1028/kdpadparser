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

class ConditionalCommand extends CommandExpression{
    constructor(conditionExpression, ownerBlock=null, subExpressions=null, subConditions=null, elseCondition=null, name="假若"){
        super(name, null, null, ownerBlock);
        this.conditionExpression=conditionExpression;
        this.subExpressions=subExpressions;
        this.subConditions=subConditions;
        this.elseCondition=elseCondition;
    }
    /**
     * return true if the condition of this command
     * is true
     */
    executeCommand(){
        if(this.conditionExpression!=null && this.conditionExpression.evaluate()){
            if(this.subExpressions){
                for(let exp of this.subExpressions){
                    exp.executeCommand();
                }
            }
            return true;
        }else if(this.subConditions){
            for(let s of this.subConditions){
                if(s.executeCommand()){
                    return false;
                }
            }
        }
        if(this.elseCondition){
            this.elseCondition.executeCommand();
        }
        return false;
    }
}

class SubConditionalCommand extends ConditionalCommand{
    constructor(conditionExpression, ownerBlock=null, subExpressions=null, subConditions=null){
        super(conditionExpression, ownerBlock, subExpressions, subConditions, null, "又假若");
    }
}

class ElseConditionalCommand extends CommandExpression{
    constructor(ownerBlock=null, subExpressions=null){
        super("否則", null, subExpressions, ownerBlock);
        this.subExpressions=subExpressions;
    }

    executeCommand(){
        for(let exp of this.subExpressions){
            exp.executeCommand();
        }
        return true;
    }
}