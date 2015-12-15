import removeRootCallExpression from './removeRootCallExpression';
import exportsReplace from './exportsReplace';
import assignGlobalsWithRequire from './assignGlobalsWithRequire';
import * as babel from 'babel-core';

export function transform(code, options = {}) {
  const opts = {
    ...options,
    plugins: [
      ...(options.plugins || []),
      removeRootCallExpression,
      [assignGlobalsWithRequire, {
        globals: options.globals
      }],
      [exportsReplace, {
        exports: options.exports
      }]
    ]
  };

  delete opts.globals;
  delete opts.exports;

  return babel.transform(code, opts).code;
}
