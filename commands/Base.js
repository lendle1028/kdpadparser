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
        if(this.loopCondition && this.loopCondition.evaluate()){
            let array=[];
            if(super.getSubExpressions()){
                for(let exp of super.getSubExpressions()){
                    //super.getGlobalContext().submitCommand(exp);
                    array.push(exp);
                    //exp.evaluate();
                }
            }
            array.push(this);
            super.getGlobalContext().insertCommands(array);
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

    isConditionMeet(){
        return this.conditionExpression!=null && this.conditionExpression.evaluate();
    }

    executeCommand(){
        if(this.isConditionMeet()){
            if(super.getSubExpressions()){
                let array=[];
                for(let exp of super.getSubExpressions()){
                    //exp.executeCommand();
                    array.push(exp);
                }
                super.getGlobalContext().insertCommands(array);
            }
            return true;
        }else if(this.subConditions){
            for(let s of this.subConditions){
                if(s.isConditionMeet()){
                    super.getGlobalContext().insertCommands([s]);
                    return;
                }
            }
        }
        if(this.elseCondition){
            super.getGlobalContext().insertCommands([this.elseCondition]);
            //this.elseCondition.executeCommand();
            return;
        }
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
        let array=[];
        for(let exp of super.getSubExpressions()){
            array.push(exp);
            //super.getGlobalContext().submitCommand(exp);
            //exp.executeCommand();
        }
        super.getGlobalContext().insertCommands(array);
        return true;
    }
}