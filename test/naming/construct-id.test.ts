import { constructId } from '../../src';

describe('constructId', () => {
  it('takes n string arguments and returns the standard construct id format (TitleCase)', () => {
    const response1 = constructId('test', 'construct', 'ids', 'once');
    expect(response1).toEqual('TestConstructIdsOnce');

    const response2 = constructId('test', 'construct', 'ids', 'once', 'again');
    expect(response2).toEqual('TestConstructIdsOnceAgain');
  });
});