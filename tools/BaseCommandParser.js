class BaseCommandParser extends AbstractCommandParser{
    accepts(commandString){
        return "設定"==commandString || "假如"==commandString ||
            "又假如"==commandString ||
            "否則"==commandString ||
            "印出"==commandString ||
            "主程式"==commandString;
    }
    /**
     * 
     * @param {*} commandArray the the first element is always the command itself and the remaining elements are the args
     * @param {*} valueExpressionParser 
     * @param parserTreeNode the corresponding parser tree node
     * @param indexInChildNodes the index number of the corresponding parserTreeNode in the child node array of its parent node
     */
    parse(commandArray, parentParser, valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock){
        let command=null;
        if(commandArray[0]=="設定"){
            command=this.parseSetVar(commandArray, parentParser,valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock);
        }else if(commandArray[0]=="假如"){
            command=this.parseIf(commandArray, parentParser,valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock);
        }else if(commandArray[0]=="又假如"){
            command=this.parseElseIf(commandArray, parentParser,valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock);
        }else if(commandArray[0]=="否則"){
            command=this.parseElse(commandArray, parentParser,valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock);
        }else if(commandArray[0]=="印出"){
            command=this.parsePrint(commandArray, parentParser,valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock);
        }else if(commandArray[0]=="主程式"){
            command=this.parseMain(commandArray, parentParser,valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock);
        }
        return command;
    }

    parseMain(commandArray, parentParser, valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock){
        let command=new MainCommand(ownerBlock);
        parserTreeNode.setParsed(true);
        return command;
    }

    parseSetVar(commandArray, parentParser, valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock){
        let command=new SetVarCommand(commandArray[1], valueExpressionParser.parseValueExpression(commandArray[2], ownerBlock), ownerBlock);
        parserTreeNode.setParsed(true);
        return command;
    }

    parseIf(commandArray, parentParser, valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock){
        let command=new ConditionalCommand(valueExpressionParser.parseValueExpression(commandArray[1], ownerBlock), ownerBlock);
        parserTreeNode.setParsed(true);
        let parentNode=parserTreeNode.getParentNode();
        for(let i=indexInChildNodes+1; i<parentNode.getChildNodes().length; i++){
            let node=parentNode.getChildNodes()[i];
            let _commandArray=node.getCommandArray();
            if(_commandArray[0]=="又假如"){
                let _command=this.parseCommandExpression(_commandArray, parentParser, valueExpressionParser, node, i, ownerBlock);
                command.getSubConditions().push(_command);
            }else if(_commandArray[0]=="否則"){
                let _command=this.parseCommandExpression(_commandArray, parentParser, valueExpressionParser, node, i, ownerBlock);
                command.setElseCondition(_command);
                break;
            }else{
                break;
            }
        }
        return command;
    }

    parseElseIf(commandArray, parentParser, valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock){
        let command=new SubConditionalCommand(valueExpressionParser.parseValueExpression(commandArray[1], ownerBlock), ownerBlock);
        parserTreeNode.setParsed(true);
        return command;
    }

    parseElse(commandArray, parentParser, valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock){
        let command=new ElseConditionalCommand(ownerBlock);
        parserTreeNode.setParsed(true);
        return command;
    }

    parsePrint(commandArray, parentParser, valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock){
        let command=new PrintCommand(valueExpressionParser.parseValueExpression(commandArray[1], ownerBlock), ownerBlock);
        parserTreeNode.setParsed(true);
        return command;
    }
}