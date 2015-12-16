import * as babel from 'babel-core';

import removeRootCallExpression from '../removeRootCallExpression';
import expectCodeEql from './helpers/expectCodeEql';

describe(__filename, () => {
  describe('#removeRootCallExpression', () => {
    it('should remove root call expression', () => {
      const code = babel.transform(`
        (function(a,b){
          const test = 1;
        })(a,b,c)
      `, {
        plugins: [
          removeRootCallExpression
        ]
      }).code;

      expectCodeEql(`
        const test = 1;
      `, code);
    });

    it('should ignore other call expression', () => {
      const code = babel.transform(`
        componentHandle = (function(a,b){
          const test = 1;
        })(a,b,c)
        componentHandler.register({});
      `, {
        plugins: [
          removeRootCallExpression
        ]
      }).code;

      expectCodeEql(`
        componentHandle = (function(a,b){
          const test = 1;
        })(a,b,c)
        componentHandler.register({});
      `, code);
    });

    it('should remove root call expression and re-assign variable names', () => {
      const code = babel.transform(`
        (function(aaa, b){
          const test = 1;
        })(a,b,c)
      `, {
        plugins: [
          removeRootCallExpression
        ]
      }).code;

      expectCodeEql(`
        var aaa = a;
        const test = 1;
      `, code);
    });

    it('should remove root call expression with unary expression', () => {
      const code = babel.transform(`
        +function(a,b){
          const test = 1;
        }(a,b,c)
      `, {
        plugins: [
          removeRootCallExpression
        ]
      }).code;

      expectCodeEql(`
        const test = 1;
      `, code);
    });

    it('should only remove root call expression', () => {
      const code = babel.transform(`
        +function(a,b){
          (function(a){})(a);
        }(a,b,c)
      `, {
        plugins: [
          removeRootCallExpression
        ]
      }).code;

      expectCodeEql(`
        (function(a){})(a);
      `, code);
    });
  });
});
