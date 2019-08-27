class Environment{
    static UNDEFINED=new Object();
    constructor(){
        this.variables={};
    }

    get(varName){
        return this.variables[varName];
    }

    set(varName, value=Environment.UNDEFINED){
        this.variables[varName]=value;
    }
}