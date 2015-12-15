export default function ({ types: t, template }) {
  const visitor = {
    ExpressionStatement(path) {
      const { node, parent } = path;

      if (!this.shouldSkip && t.isProgram(parent)) {
        if (t.isCallExpression(node.expression) || t.isUnaryExpression(node.expression)) {
          // +function(){}() ==> (function(){})()
          if (t.isUnaryExpression(node.expression)) {
            node.expression = node.expression.argument;
          }

          const expressionParams = [].concat(node.expression.callee.params);
          const expressionArguments = [].concat(node.expression.arguments);

          const newBody = expressionParams.reduce((body, expressionParamItem, idx) => {
            if (expressionParamItem.name === (expressionArguments[idx] || {}).name) {
              return body;
            }
            const newNode = template(`var VAR_NAME = ORIGIN_VAR_NAME;`)({
              VAR_NAME: t.identifier(expressionParamItem.name),
              ORIGIN_VAR_NAME: t.identifier((expressionArguments[idx] || {}).name)
            });
            return body.concat(newNode);
          }, []);

          path.replaceWithMultiple(newBody.concat(node.expression.callee.body.body));
          this.shouldSkip = true;
        }
      }
    }
  };

  return {
    visitor
  };
}
