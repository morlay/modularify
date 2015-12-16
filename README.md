## modularify

[![Build Status](https://img.shields.io/travis/morlay/modularify.svg?style=flat-square)](https://travis-ci.org/morlay/modularify)
[![NPM](https://img.shields.io/npm/v/modularify.svg?style=flat-square)](https://npmjs.org/package/modularify)
[![Dependencies](https://img.shields.io/david/morlay/modularify.svg?style=flat-square)](https://david-dm.org/morlay/modularify)
[![License](https://img.shields.io/npm/l/modularify.svg?style=flat-square)](https://npmjs.org/package/modularify)

`global is eval` so this tool will transform window assignment to commonjs way

from

```js
(function(win){
  var Button = 1;
  document;
  window['Button'] = Button;
})(window)
```
to

```js
var document = require('global/document');
var window = require('global');

var win = window;
var Button = 1;
document;
exports['Button'] = Button;
```

### Options

Could work with babel and could pass [babel options](https://babeljs.io/docs/usage/options/);
Two more options

* Options.globals
* Options.exports

```js
import * as modularify from 'modularify'; // babel 6 issue

modularify.transform('<codeString>', {
        globals: {
          window: 'global',
          document: ['global', 'document']
        },
        exports: {
          window: 'exports'
        }
      });
```
