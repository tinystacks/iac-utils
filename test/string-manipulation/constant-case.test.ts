import { constantCase } from '../../src';

describe('constantCase', () => {
  it('converts a string to constant case and returns it', () => {
    const expectedResponse = 'INPUT_ONE';
    
    const response1 = constantCase('input-one');
    expect(response1).toEqual(expectedResponse);
    
    const response2 = constantCase('inputOne');
    expect(response2).toEqual(expectedResponse);
    
    const response3 = constantCase('input_one');
    expect(response3).toEqual(expectedResponse);
    
    const response4 = constantCase('InputOne');
    expect(response4).toEqual(expectedResponse);
  });
  it('returns empty string if the input is undefined', () => {
    const response = constantCase();
    expect(response).toEqual('');
  });
});