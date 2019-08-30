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