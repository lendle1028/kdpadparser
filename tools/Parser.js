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
        let emptyRoot=new ParserTreeNode(null);
        let codeTree=this.parseCodeTree(codeStringList, emptyRoot);
        console.log(codeTree.toString());
        let ret=new Array();
        for(let c of codeTree.getChildNodes){
            let exp=this.parseCommandExpression(c);
            ret.push(exp);
        }
        return ret;
    }

    parseCommandExpression(codeTreeNode){
        
        return null;
    }

    parseCodeTree(codeLines, rootNode){        
        let currentLine=codeLines[0];
        if(currentLine.trim().length==0){
            return null;
        }
        let node=new ParserTreeNode(currentLine.trim());
        rootNode.getChildNodes().push(node);
        node.setParentNode(rootNode);
        let level=this.countPrefixWhiteSpaces(currentLine);
        codeLines.splice(0, 1);
        while(codeLines.length>0){
            let nextLine=codeLines[0];
            if(nextLine.trim().length==0){
                codeLines.splice(0, 1);//consume empty line
                continue;
            }
            let nextLevel=this.countPrefixWhiteSpaces(nextLine);
            if(nextLevel>level){
                //go to the next level
                this.parseCodeTree(codeLines, node);
            }else if(nextLevel==level){
                this.parseCodeTree(codeLines, rootNode);
            }else{
                //this is the end of this block
                break;
            }
        }
        return node;
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
        this.line=line;
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

    toString(){
        return this._toString(0);
    }

    _toString(level){
        let str="";
        for(let i=0; i<level; i++){
            str=str+"  ";
        }
        str=str+this.line;
        for(let c of this.childNodes){
            str=str+"\n"+c._toString(level+1);
        }
        return str;
    }
}