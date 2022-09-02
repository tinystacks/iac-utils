import { titleCase } from '../../src';

describe('titleCase', () => {
  it('converts a string to constant case and returns it', () => {
    const expectedResponse = 'InputOne';
    
    const response1 = titleCase('input-one');
    expect(response1).toEqual(expectedResponse);
    
    const response2 = titleCase('inputOne');
    expect(response2).toEqual(expectedResponse);
    
    const response3 = titleCase('input_one');
    expect(response3).toEqual(expectedResponse);
    
    const response4 = titleCase('INPUT_ONE');
    expect(response4).toEqual(expectedResponse);
  });
  it('returns empty string if the input is undefined', () => {
    const response = titleCase();
    expect(response).toEqual('');
  });
});