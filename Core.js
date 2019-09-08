function sleep(ms) {
    return new Promise((resolve) =>
      setTimeout(resolve, ms)
    );
}

class GlobalContext{
    constructor(){
        this.interval=10;
        this.executionQueue=[];
    }

    setInterval(interval){
        this.interval=interval;
    }

    submitCommand(command){
        this.executionQueue.push(command);
    }

    insertCommands(commandArray){
        this.executionQueue=[...commandArray, ...this.executionQueue];
    }

    startExecution(){
        let self=this;
        setTimeout(function(){
            self._execute();
        }, this.interval);
    }

    _execute(){
        let self=this;
        if(this.executionQueue.length>0){
            let command=this.executionQueue[0];
            //console.log(command);
            this.executionQueue.splice(0, 1);
            command.evaluate();
            if(command.getName()!="停止"){
                setTimeout(function(){
                    self._execute();
                }, this.interval);
            }
        }else{
            setTimeout(function(){
                self._execute();
            }, this.interval);
        }
        // this.count++;
        // if(this.count>100){
        //     return;
        // }
        // console.log(this.count);
        // let self=this;
        // if(this.executionQueue.length>0){
        //     let command=this.executionQueue[0];
        //     console.log(command);
        //     this.executionQueue.splice(0, 1);
        //     command.evaluate();
        //     if(command.getName()!="停止"){
        //         setTimeout(function(){
        //             self._execute();
        //         }, this.interval);
        //     }
        // }else{
        //     setTimeout(function(){
        //         self._execute();
        //     }, this.interval);
        // }
    }
}

let globalContext=new GlobalContext();

class Block{
    static UNDEFINED=new Object();
    constructor(parentBlock=null){
        this.variables={};
        this.expressions=new Array();
        this.parentBlock=parentBlock;
    }

    get(varName){
        if(!this.variables[varName] && this.parentBlock){
            return this.parentBlock.get(varName);
        }
        return this.variables[varName];
    }

    set(varName, value=Environment.UNDEFINED){
        this.variables[varName]=value;
    }

    getExpressions(){
        return this.expressions;
    }

    getParentBlock(){
        return this.parentBlock;
    }

    getAllVariableNames(){
        let array=[];
        for(let k in this.variables){
            array.push(k);
        }
        if(this.parentBlock){
            for(let k of this.parentBlock.getAllVariableNames()){
                array.push(k);
            }
        }
        return array;
    }
}

class Expression{
    static TYPE_VAR=0;
    static TYPE_CONST=1;
    static TYPE_COMMAND=2;
    static TYPE_MATH=3;

    constructor(type=Expression.TYPE_VAR, ownerBlock=null){
        this.type=type;
        this.ownerBlock=ownerBlock;
    }

    getType(){
        return this.type;
    }

    getOwnerBlock(){
        return this.ownerBlock;
    }
    /**
     * should be overridden by sub classes
     */
    evaluate(){
        return null;
    }
}

class VarExpression extends Expression{
    constructor(name=null, ownerBlock=null){
        super(Expression.TYPE_VAR, ownerBlock)
        this.name=name;
    }

    getName(){
        return this.name;
    }

    evaluate(){
        return this.getOwnerBlock().get(this.name).evaluate();
    }
}

class ConstExpression extends Expression{
    constructor(value=null, ownerBlock=null){
        super(Expression.TYPE_CONST, ownerBlock)
        this.value=value;
    }

    evaluate(){
        return this.value;
    }
}

class CommandExpression extends Expression{
    constructor(name=null, ownerBlock=null){
        super(Expression.TYPE_COMMAND, ownerBlock);
        this.name=name;
        this.subExpressions=[];
        this.globalContext=globalContext;
    }

    getGlobalContext(){
        return this.globalContext;
    }

    getName(){
        return this.name;
    }

    getSubExpressions(){
        return this.subExpressions;
    }

    evaluate(){
        //eval subExpressions at first
        // if(this.subExpressions!=null){
        //     for(let e of this.subExpressions){
        //         e.evaluate();
        //     }
        // }
        return this.executeCommand();
    }

    /**
     * must be overridden by implementations
     */
    executeCommand(){
    }
}

class MainCommand extends CommandExpression{
    constructor(ownerBlock=null){
        super("主程式", ownerBlock);
    }

    executeCommand(){
        let self=this;
        this.getGlobalContext().startExecution();
        if(super.getSubExpressions()){
            for(let s of this.subExpressions){
                this.getGlobalContext().submitCommand(s);
                //s.executeCommand();
            }
        }
    }
}

class StopCommand extends CommandExpression{
    constructor(ownerBlock=null){
        super("停止", ownerBlock);
    }

    executeCommand(){
    }
}

class MathExpression extends Expression{
    constructor(expression, ownerBlock=null){
        super(Expression.TYPE_MATH, ownerBlock);
        this.mathExpression=expression;
    }

    getMathExpression(){
        return this.mathExpression; 
    }

    evaluate(){
        //replace variables to their values
        let newExpression=this.mathExpression;
        for(let v of super.getOwnerBlock().getAllVariableNames()){
            let value=super.getOwnerBlock().get(v);
            if(value==this){
                continue;//skip self
            }else{
                if(value.evaluate){
                    value=value.evaluate();
                }
            }
            if(typeof(value)=="string"){
                newExpression=newExpression.replace(v, "\""+value+"\"");
            }else{
                newExpression=newExpression.replace(v, value);
            }
            
        }
        return eval(newExpression);
    }
}