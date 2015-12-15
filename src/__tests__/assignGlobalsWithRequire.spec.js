import * as babel from 'babel-core';

import assignGlobalsWithRequire from '../assignGlobalsWithRequire';
import expectCodeEql from './helpers/expectCodeEql';

describe(__filename, () => {
  describe('#assignGlobalsWithRequire', () => {
    it('should re assign global identifier with template', () => {
      const code = babel.transform(`
        window;
        const doc = () => {
          addListener;
          document.addListener;
        }
      `, {
        plugins: [
          [assignGlobalsWithRequire, {
            globals: {
              window: 'global',
              addListener: ['global', 'document', 'addListener'],
              document: ['global', 'document']
            }
          }]
        ]
      }).code;

      expectCodeEql(`
        var window = require("global");
        var addListener = require("global")["document"]["addListener"];
        var document = require("global")["document"];
        window;
        const doc = () => {
          addListener;
          document.addListener;
        }
      `, code);
    });
  });
});
