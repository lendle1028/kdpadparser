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
        this.ownerBlock=block;
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
        return this.getOwnerBlock().get(this.name);
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
    constructor(name=null, parameters=null, subExpressions=null, ownerBlock=null){
        super(Expression.TYPE_COMMAND, ownerBlock);
        this.name=name;
        this.parameters=parameters;
        this.subExpressions=subExpressions;
    }

    getName(){
        return this.name;
    }

    evaluate(){
        //eval subExpressions at first
        if(this.subExpressions!=null){
            for(let e of this.subExpressions){
                e.evaluate();
            }
        }
        return this.executeCommand();
    }

    /**
     * must be overridden by implementations
     */
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
            if(typeof(value)=="string"){
                newExpression=newExpression.replace(v, "\""+super.getOwnerBlock().get(v)+"\"");
            }else{
                newExpression=newExpression.replace(v, super.getOwnerBlock().get(v));
            }
            
        }
        console.log(newExpression);
        return eval(newExpression);
    }
}