import { expect } from 'chai';
import * as babel from 'babel-core';

function trimLines(str) {
  return str.replace(/^\n+|\n+$/, '').replace(/\n+/g, '\n');
}

export default function expectCodeEql(expectCode, resultCode) {
  return expect(trimLines(babel.transform(expectCode).code, {
    retainLines: false
  })).to.eql(trimLines(resultCode));
}
