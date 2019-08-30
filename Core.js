class Block{
    static UNDEFINED=new Object();
    constructor(parentBlock=null){
        this.variables={};
        this.expressions=new Array();
        this.parentBlock=parentBlock;
    }

    get(varName){
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
}

class Expression{
    static TYPE_VAR=0;
    static TYPE_CONST=1;
    static TYPE_COMMAND=2;

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
    eval(){
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

    eval(){
        return this.getOwnerBlock().get(this.name);
    }
}

class ConstExpression extends Expression{
    constructor(value=null, ownerBlock=null){
        super(Expression.TYPE_CONST, ownerBlock)
        this.value=value;
    }

    eval(){
        return this.value;
    }
}

class CommandExpression extends Expression{
    constructor(name=null, parameters=null, subExpressions=null, ownerBlock=null){
        super(Expression.TYPE_COMMAND, ownerBlock)
        this.name=name;
        this.parameters=parameters;
        this.subExpressions=subExpressions;
    }

    getName(){
        return this.name;
    }

    eval(){
        //eval subExpressions at first
        if(this.subExpressions!=null){
            for(let e of this.subExpressions){
                e.eval();
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