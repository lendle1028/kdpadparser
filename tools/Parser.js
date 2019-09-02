class Parser{
    constructor(){
        this.codeContainerStack=new Array();
        this.blockStack=new Array();
    }

    /**
     * @returns a list of top-level expression instance
     */
    parse(codeString){
        let codeStringList=codeString.split(/\n/);

    }

    parseCodeTree(codeLines, rootNode){
        let currentLine=codeLines[0];
        let node=new ParserTreeNode(currentLine);
        rootNode.getChildNodes().push(node);
        let level=this.countPrefixWhiteSpaces(currentLine);
        codeLines.splice(0, 1);
        while(codeLines.length>0){
            let nextLine=codeLines[0];
            let nextLevel=this.countPrefixWhiteSpaces(nextLine);
            if(nextLevel>level){
                //go to the next level
                let childNode=this.parseCodeTree(codeLines, node);
                childNode.setParentNode(node);
                node.getChildNodes().push(childNode);
                codeLines.splice(0, 1);//consume the node
            }else if(nextLevel==level){
                let childNode=new ParserTreeNode(nextLine);
                rootNode.getChildNodes().push(childNode);
                codeLines.splice(0, 1);//consume the node
            }else{
                //this is the end of this block
                break;
            }
        }
        return node;
    }

    /**
     * @returns an expression instance
     * @param {*} currentCodeString 
     * @param {*} remainingCodeString 
     */
    _parse(currentCodeString, remainingCodeString){
        let exp=null;//parse currentCodeString to an expression
        let nextLine=remainingCodeString[0];
        if(Parser.countPrefixWhiteSpaces(currentCodeString)<Parser.countPrefixWhiteSpaces(nextLine)){
            //then a new block is generated

        }
    }

    countPrefixWhiteSpaces(line){
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

/**
 * a tree to hold the source codes
 * each node is a line of code
 */
class ParserTreeNode{
    constructor(line){
        this.parentNode=null;
        this.childNodes=[];
        this.line=null;
    }

    getLine(){
        return this.line;
    }

    getParentNode(){
        return this.parentNode;
    }

    setParentNode(node){
        this.parentNode=node;
    }

    getChildNodes(){
        return this.childNodes;
    }
}