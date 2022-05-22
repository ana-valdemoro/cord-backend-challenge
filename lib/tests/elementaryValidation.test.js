/* eslint-disable no-undef */
import { checkIntegerType } from '../middleware/elementaryValidaton.js';

describe('Check if value is type integer', () =>{
  test('Integer value expect to return true', () =>{
    expect(checkIntegerType(1)).toBe(true);
  });

  test('Float value expect to return false', () =>{
    expect(checkIntegerType(1.4)).toBe(false);
  });

  test('String value expect to return false', () =>{
    expect(checkIntegerType('Hellou')).toBe(false);
  });

});