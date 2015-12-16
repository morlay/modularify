export default function ({ types: t, template }) {
  const visitor = {
    CallExpression: {
      enter(path) {
        const { node, parent, parentPath } = path;
        if (!this.shouldSkip && t.isFunctionExpression(node.callee)) {
          const calleeParams = [].concat(node.callee.params);
          const expressionArguments = [].concat(node.arguments);

          const newBody = calleeParams.reduce((body, expressionParamItem, idx) => {
            if (expressionParamItem.name === (expressionArguments[idx] || {}).name) {
              return body;
            }
            const newNode = template(`var VAR_NAME = ORIGIN_VAR_NAME;`)({
              VAR_NAME: t.identifier(expressionParamItem.name),
              ORIGIN_VAR_NAME: t.identifier((expressionArguments[idx] || {}).name)
            });
            return [].concat(newNode).concat(body);
          }, [].concat(node.callee.body.body));


          if (t.isExpressionStatement(parent) && t.isProgram(parentPath.parent)) {
            parentPath.replaceWithMultiple(newBody);
          }

          if (t.isUnaryExpression(parent) && t.isProgram(parentPath.parentPath.parent)) {
            parentPath.parentPath.replaceWithMultiple(newBody);
          }

          this.shouldSkip = true;
        }
      }
    }
  };

  return {
    visitor
  };
}
