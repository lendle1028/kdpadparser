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
}