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