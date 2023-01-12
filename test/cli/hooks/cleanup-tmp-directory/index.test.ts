const mockRmSync = jest.fn();

jest.mock('fs', () => ({
  rmSync: mockRmSync
}));

import {
  cleanupTmpDirectory
} from '../../../../src/cli/hooks/cleanup-tmp-directory';

test('cleanupTmpDirectory', () => {
  cleanupTmpDirectory();
  
  expect(mockRmSync).toBeCalled();
  expect(mockRmSync).toBeCalledWith('/tmp/iac-utils/tmp', { recursive: true, force: true });
});