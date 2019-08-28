class ConstExpression extends Expression{
    constructor(value=null, ownerBlock=null){
        super(Expression.TYPE_CONST, ownerBlock)
        this.value=value;
    }
}