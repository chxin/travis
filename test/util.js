
import Immutable from 'immutable';
import {expect} from 'chai';


export function immutableEqual(a, b){
  return Immutable.is(a,b);
}

export function expectImmutableEqual(a, b){
  expect(
    immutableEqual(a,b)
  ).to.be.true;
}
