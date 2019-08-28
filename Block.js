class Block{
    static UNDEFINED=new Object();
    constructor(){
        this.variables={};
        this.expressions=new Array();
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
}