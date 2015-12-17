import * as modularify from '../index';
import expectCodeEql from './helpers/expectCodeEql';

describe(__filename, () => {
  describe('#modularify', () => {
    it('should works', () => {
      const opts = {
        plugins: [
          [modularify.removeCallExpression, {
            callers: [
              'componentHandler'
            ]
          }],
          modularify.removeRootCallExpression,
          [modularify.assignGlobalsWithRequire, {
            globals: {
              window: 'global',
              document: 'global/document'
            },
            ignores: [
              'componentHandler'
            ]
          }],
          [modularify.exportsReplace, {
            exports: {
              window: 'exports'
            }
          }]
        ]
      };

      const code = modularify.transform(`
        (function(win){
          var Button = 1;
          document;
          window['Button'] = Button;
          componentHandler.caller();
        })(window)
      `, opts);

      expectCodeEql(`
        var document = require('global/document');
        var window = require('global');

        var win = window;
        var Button = 1;
        document;
        exports['Button'] = Button;
      `, code);
    });
  });
});
