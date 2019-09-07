class MapGameCommandParser extends AbstractCommandParser{
    accepts(commandString){
        return "移動"==commandString ||
            "睡覺"==commandString;
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
        if(commandArray[0]=="移動"){
            command=this.parseMove(commandArray, parentParser,valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock);
        }else if(commandArray[0]=="睡覺"){
            command=this.parseSleep(commandArray, parentParser,valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock);
        }
        return command;
    }

    parseMove(commandArray, parentParser, valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock){
        let command=new MoveCommand(
            valueExpressionParser.parseValueExpression(commandArray[1], ownerBlock),
            valueExpressionParser.parseValueExpression(commandArray[2], ownerBlock),
            ownerBlock);
        parserTreeNode.setParsed(true);
        return command;
    }

    parseSleep(commandArray, parentParser, valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock){
        let command=new SleepCommand(
            valueExpressionParser.parseValueExpression(commandArray[1], ownerBlock),
            ownerBlock);
        parserTreeNode.setParsed(true);
        return command;
    }
}