import { kebabCase } from '../../src';

describe('kebabCase', () => {
  it('converts a string to kebab case and returns it', () => {
    const expectedResponse = 'input-one';
    
    const response1 = kebabCase('input-one');
    expect(response1).toEqual(expectedResponse);
    
    const response2 = kebabCase('inputOne');
    expect(response2).toEqual(expectedResponse);
    
    const response3 = kebabCase('input_one');
    expect(response3).toEqual(expectedResponse);
    
    const response4 = kebabCase('INPUT_ONE');
    expect(response4).toEqual(expectedResponse);
  });
  it('doesn\'t split on numbers', () => {
    const uuidV4 = 'e36108d8-5fe3-4da2-91d9-d93a49c6d1fd';
    const response = kebabCase(uuidV4);
    expect(response).toEqual(uuidV4);
  });
  it('returns empty string if the input is undefined', () => {
    const response = kebabCase();
    expect(response).toEqual('');
  });
});