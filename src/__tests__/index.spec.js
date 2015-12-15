import * as modularify from '../index';
import expectCodeEql from './helpers/expectCodeEql';

describe(__filename, () => {
  describe('#modularify', () => {
    it('should works', () => {
      const code = modularify.transform(`
        (function(win){
          var Button = 1;
          document;
          window['Button'] = Button;
        })(window)
      `, {
        globals: {
          window: 'global',
          document: 'global/document'
        },
        exports: {
          window: 'exports'
        }
      });

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
