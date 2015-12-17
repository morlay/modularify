export default function () {
  function shouldRemove(path, callers = []) {
    return callers.reduce((result, caller) => {
      return result || path.get('callee').matchesPattern(caller, true);
    }, false);
  }

  return {
    visitor: {
      CallExpression(path, { opts }) {
        if (shouldRemove(path, [].concat(opts.callers))) {
          path.remove();
        }
      }
    }
  };
}
