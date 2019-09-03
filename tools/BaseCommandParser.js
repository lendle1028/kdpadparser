class BaseCommandParser{
    parseCommandExpression(codeString, valueExpressionParser){
        if(codeString.indexOf("設定 ")==0){
            return this.parseSetVar(codeString, valueExpressionParser);
        }
    }
}