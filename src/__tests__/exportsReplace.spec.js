import * as babel from 'babel-core';

import exportsReplace from '../exportsReplace';
import expectCodeEql from './helpers/expectCodeEql';

describe(__filename, () => {
  describe('#exportsReplace', () => {
    it('should replace to assignment', () => {
      const code = babel.transform(`
        window;
        window.call();
        window['Button'] = Button;
        function a() {
          window.Button = Button;
        }
      `, {
        plugins: [
          [exportsReplace, {
            exports: {
              window: `exports`
            }
          }]
        ]
      }).code;

      expectCodeEql(`
        window;
        window.call();
        exports['Button'] = Button;
        function a() {
          exports.Button = Button;
        }
      `, code);
    });
  });
});
