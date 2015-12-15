export default function ({ types: t }) {
  const visitor = {
    MemberExpression: {
      exit(path, { opts }) {
        const targets = opts.exports || {};
        const name = path.get('object').node.name;
        if (targets[name]) {
          path.get('object').replaceWith(t.identifier(targets[name]));
        }
      }
    }
  };

  return {
    visitor
  };
}
