class Parser{
    static parse(codeStringList){
        let codeContainerStack=new Array();
        let blockStack=new Array();
        this.codeStringList=codeStringList;
    }

    /**
     * @returns a list of expressions in this block
     * @param {*} currentCodeString 
     * @param {*} remainingCodeString 
     */
    static _parse(currentCodeString, remainingCodeString){
        let exp=null;//parse currentCodeString to an expression
        let nextLine=remainingCodeString[0];
        if(Parser.countPrefixWhiteSpaces(currentCodeString)<Parser.countPrefixWhiteSpaces(nextLine)){
            //then a new block is generated

        }
    }

    static countPrefixWhiteSpaces(line){
        let count=0;
        for(let c of line){
            if(c==' '){
                count++;
            }else if(c=='\t'){
                count=count+4;
            }
        }
        return count;
    }
}