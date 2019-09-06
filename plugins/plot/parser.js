class PlotCommandParser extends AbstractCommandParser{
    accepts(commandString){
        return "着色"==commandString;
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
        if(commandArray[0]=="着色"){
            command=this.parseFill(commandArray, parentParser,valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock);
        }
        return command;
    }

    parseFill(commandArray, parentParser, valueExpressionParser, parserTreeNode, indexInChildNodes, ownerBlock){
        let command=new FillCommand(
            valueExpressionParser.parseValueExpression(commandArray[1], ownerBlock),
            valueExpressionParser.parseValueExpression(commandArray[2], ownerBlock),
            valueExpressionParser.parseValueExpression(commandArray[3], ownerBlock),
            ownerBlock);
        parserTreeNode.setParsed(true);
        return command;
    }
}