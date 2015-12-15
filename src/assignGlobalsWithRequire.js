export default function ({ types: t, template }) {
  const visitor = {
    ExpressionStatement(path, { opts }) {
      const globalPaths = opts.globals || {};
      const { parent, scope, parentPath } = path;
      if (!this.shouldSkip && t.isProgram(parent)) {
        const globals = scope.globals;
        const newBody = Object.keys(globals).reduce((body, globalKey) => {
          if (!globalPaths[globalKey]) {
            console.log(`Identifier '${globalKey}' is still in global`);
            return body;
          }

          const globalPath = [].concat(globalPaths[globalKey]);
          let baseTemp = 'var VAR_NAME = require(SOURCE_PATH)';

          const baseReplace = {
            VAR_NAME: t.identifier(globalKey),
            SOURCE_PATH: t.stringLiteral(globalPath[0])
          };

          if (globalPath.length > 1) {
            for (let i = 1; i < globalPath.length; i++) {
              const keyName = 'PROP_KEY_' + i;
              baseTemp += `[${keyName}]`;
              baseReplace[keyName] = t.stringLiteral(globalPath[i]);
            }
          }

          return body.concat(template(baseTemp)(baseReplace));
        }, []);

        parentPath.replaceWith(t.program(newBody.concat(parent.body)));
        this.shouldSkip = true;
      }
    }
  };

  return {
    visitor
  };
}
