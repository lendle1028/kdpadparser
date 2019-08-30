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