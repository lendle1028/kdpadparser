class Parser{
    constructor(){
        this.block=new Block();
        this.commandParsers=[];
        //this.baseCommandParser=new BaseCommandParser();
        this.registerCommandParser(new BaseCommandParser());
    }

    registerCommandParser(commandParser){
        this.commandParsers.push(commandParser);
    }

    /**
     * @returns a list of top-level expression instance
     */
    parse(codeString){
        let codeStringList=codeString.split(/\n/);
        let emptyRoot=new ParserTreeNode(null);
        let codeTree=this.parseCodeTree(codeStringList, emptyRoot);
        //console.log(codeTree.toString());
        let ret=new Array();
        let index=0;
        for(let c of emptyRoot.getChildNodes()){
            let exp=this.parseCommandExpression(c, index++, this.block);
            ret.push(exp);
        }
        //console.log(ret);
        return ret;
    }

    parseCommandExpression(codeTreeNode, indexInChildNodes, ownerBlock){
        for(let p of this.commandParsers){
            if(p.accepts(codeTreeNode.getCommandArray()[0])){
                return p.parseCommandExpression(
                    codeTreeNode.getCommandArray(), this, this, codeTreeNode, indexInChildNodes, ownerBlock
                );        
            }
        }
    }

    parseValueExpression(code, ownerBlock){
        code=code.trim();
        let exp=null;
        let math=!(code.indexOf("+")==-1 && code.indexOf("-")==-1 &&
            code.indexOf("*")==-1 && code.indexOf("/")==-1 &&
            code.indexOf("=")==-1 && code.indexOf(">")==-1 &&
            code.indexOf("<")==-1 && code.indexOf("true")==-1 &&
            code.indexOf("false")==-1);
        if(code.indexOf("\"")==0){
            exp=new ConstExpression(code.substring(1, code.length-1), ownerBlock);
        }else if(!math && !isNaN(parseFloat(code))){
            exp=new ConstExpression(code, ownerBlock);
        }else if(!math){
            exp=new VarExpression(code, ownerBlock);
        }
        //console.log("ownerBlock="+ownerBlock);
        exp=new MathExpression(code, ownerBlock);
        console.log(code);
        console.log(exp);
        return exp;
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
        this.parsed=false;
        this.commandArray=this.toCommandAndArgs(line);
    }

    /**
     * separate a codeString into an array in which
     * the first element is always the command itself
     * and the remaining elements are the args
     * @param {*} codeString 
     */
    toCommandAndArgs(codeString){
        if(codeString==null){
            return [];
        }
        let index=codeString.indexOf(" ");
        let ret=(index!=-1)?[codeString.substring(0, index)]:[codeString];
        let remaining=(index!=-1)?codeString.substring(index+1):"";
        if(remaining){
            remaining=remaining.trim();
        }
        let args=remaining.split(",");
        for(let arg of args){
            ret.push(arg.trim());
        }
        return ret;
    }

    getCommandArray(){
        return this.commandArray;
    }

    isParsed(){
        return this.parsed;
    }

    setParsed(parsed){
        this.parsed=parsed;
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

class AbstractCommandParser{
    accepts(commandString){
        return false;
    }

    /**
     * 
     * @param {*} commandArray the the first element is always the command itself and the remaining elements are the args
     * @param {*} valueExpressionParser 
     * @param parserTreeNode the corresponding parser tree node
     * @param indexInChildNodes the index number of the corresponding parserTreeNode in the child node array of its parent node
     */
    parseCommandExpression(commandArray, parentParser, valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock){
        let command=this.parse(commandArray, parentParser, valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock);
        parserTreeNode.setParsed(true);
        if(command==null){
            return null;
        }
        if(parserTreeNode.getChildNodes() && parserTreeNode.getChildNodes().length>0){
            let childBlock=new Block(ownerBlock);
            let index=0;
            for(let childNode of parserTreeNode.getChildNodes()){
                if(childNode.isParsed()){
                    index++;
                    continue;
                }
                command.getSubExpressions().push(parentParser.parseCommandExpression(childNode, index++, childBlock));
            }
        }
        return command;
    }

    /**
     * sub classes should override this method
     * @param {*} commandArray 
     * @param {*} parentParser 
     * @param {*} valueExpressionParser 
     * @param {*} parserTreeNode 
     * @param {*} indexInChildNodes 
     * @param {*} ownerBlock 
     */
    parse(commandArray, parentParser, valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock){

    }
}