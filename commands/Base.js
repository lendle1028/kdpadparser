class PrintCommand extends CommandExpression{
    constructor(message=null, ownerBlock=null){
        super("印出", ownerBlock);
        this.message=message;
    }

    executeCommand(){
        /*if(document){
            document.write(this.message.evaluate());
        }*/
        console.log(this.message.evaluate());
        return null;
    }
}

class SetVarCommand extends CommandExpression{
    constructor(varName=null, value=null, ownerBlock=null){
        super("設定", ownerBlock);
        this.value=value;
        this.varName=varName;
    }

    executeCommand(){
        this.ownerBlock.set(this.varName, 
            new ConstExpression((this.value.evaluate)?this.value.evaluate():this.value, super.getOwnerBlock() ));
    }
}

class LoopCommand extends CommandExpression{
    constructor(loopCondition, ownerBlock){
        super("重複", ownerBlock);
        this.loopCondition=loopCondition;
    }

    executeCommand(){
        while(this.loopCondition && this.loopCondition.evaluate()){
            if(super.getSubExpressions()){
                for(let exp of super.getSubExpressions()){
                    exp.evaluate();
                }
            }
        }
    }
}

class ConditionalCommand extends CommandExpression{
    constructor(conditionExpression, ownerBlock=null, /*subExpressions=null, subConditions=null, elseCondition=null,*/name="假如"){
        super(name, ownerBlock);
        this.conditionExpression=conditionExpression;
        // if(subExpressions){
        //     super.getSubExpressions().push(...subExpressions);
        // }
        this.subConditions=[];
        this.elseCondition=null;;
    }

    getSubConditions(){
        return this.subConditions;
    }

    getElseCondition(){
        return this.elseCondition;
    }

    setElseCondition(condition){
        this.elseCondition=condition;
    }

    /**
     * return true if the condition of this command
     * is true
     */
    executeCommand(){
        if(this.conditionExpression!=null && this.conditionExpression.evaluate()){
            if(super.getSubExpressions()){
                for(let exp of super.getSubExpressions()){
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
    constructor(conditionExpression, ownerBlock=null){
        super(conditionExpression, ownerBlock, "又假如");
    }
}

class ElseConditionalCommand extends CommandExpression{
    constructor(ownerBlock=null){
        super("否則", ownerBlock);
    }

    executeCommand(){
        for(let exp of super.getSubExpressions()){
            exp.executeCommand();
        }
        return true;
    }
}