import removeCallExpression from './removeCallExpression';
import removeRootCallExpression from './removeRootCallExpression';
import exportsReplace from './exportsReplace';
import assignGlobalsWithRequire from './assignGlobalsWithRequire';
import * as babel from 'babel-core';

export {
  removeCallExpression,
  removeRootCallExpression,
  exportsReplace,
  assignGlobalsWithRequire
};

export function transform(code, babelOptions = {}) {
  return babel.transform(code, babelOptions).code;
}
