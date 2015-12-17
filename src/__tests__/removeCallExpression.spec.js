import * as babel from 'babel-core';

import removeCallExpression from '../removeCallExpression';
import expectCodeEql from './helpers/expectCodeEql';

describe(__filename, () => {
  describe('#removeCallExpression', () => {
    it('should remove call expression by callers', () => {
      const code = babel.transform(`
        componentHandler.call();
        componentHandler.register();
      `, {
        plugins: [
          [removeCallExpression, {
            callers: [
              'componentHandler'
            ]
          }]
        ]
      }).code;

      expectCodeEql(`
      `, code);
    });

    it('should remove call expression by callers but ignore similar', () => {
      const code = babel.transform(`
        componentHandler.call({});
        other.componentHandler.register();
      `, {
        plugins: [
          [removeCallExpression, {
            callers: [
              'componentHandler'
            ]
          }]
        ]
      }).code;

      expectCodeEql(`
        other.componentHandler.register();
      `, code);
    });

    it('should remove call expression by multi callers', () => {
      const code = babel.transform(`
        componentHandler.call({});
        other.componentHandler.register();
      `, {
        plugins: [
          [removeCallExpression, {
            callers: [
              'other',
              'componentHandler'
            ]
          }]
        ]
      }).code;

      expectCodeEql(`
      `, code);
    });
  });
});
