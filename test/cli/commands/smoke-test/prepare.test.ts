const mockExistsSync = jest.fn();
const mockMkdirSync = jest.fn();
const mockWriteFileSync = jest.fn();
const mockRunCommand = jest.fn();
const mockParseCdkDiff = jest.fn();
const mockParseTerraformDiff = jest.fn();

jest.mock('fs', () => ({
  existsSync: mockExistsSync,
  mkdirSync: mockMkdirSync,
  writeFileSync: mockWriteFileSync
}));

jest.mock('../../../../src/cli/utils/os', () => ({
  runCommand: mockRunCommand
}));

jest.mock('../../../../src/cli/commands/smoke-test/parser.ts', () => ({
  parseCdkDiff: mockParseCdkDiff,
  parseTerraformDiff: mockParseTerraformDiff
}));

import {
  prepareForSmokeTest
} from '../../../../src/cli/commands/smoke-test/prepare';
import { IacFormat, OsOutput } from '../../../../src/cli/types';

describe('prepare', () => {
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });

  describe('prepareForSmokeTest', () => {
    it('creates tmp directory if it does not exist', async () => {
      mockExistsSync.mockReturnValueOnce(false);

      const result = await prepareForSmokeTest('mock-format' as IacFormat);

      expect(mockExistsSync).toBeCalled();
      expect(mockMkdirSync).toBeCalled();
      expect(mockMkdirSync).toBeCalledWith('/tmp/iac-utils/tmp', { recursive: true });
      expect(result).toEqual([]);
    });
    it('runs cdk diff and calls parse for cdk format', async () => {
      const mockCdkDiffOutput: OsOutput = {
        exitCode: 0,
        stderr: 'mock cdk diff',
        stdout: ''
      };
      mockExistsSync.mockReturnValueOnce(true);
      mockRunCommand.mockResolvedValueOnce(mockCdkDiffOutput)

      await prepareForSmokeTest(IacFormat.awsCdk);

      expect(mockExistsSync).toBeCalled();
      expect(mockMkdirSync).not.toBeCalled();
      
      expect(mockRunCommand).toBeCalled();
      expect(mockRunCommand).toBeCalledWith('cdk diff');

      expect(mockWriteFileSync).toBeCalled();
      expect(mockWriteFileSync).toBeCalledWith(`/tmp/iac-utils/tmp/diff.txt`, 'mock cdk diff');

      expect(mockParseCdkDiff).toBeCalled();
      expect(mockParseCdkDiff).toBeCalledWith(`/tmp/iac-utils/tmp/diff.txt`);
    });
    it('throws on non-zero exit code', async () => {
      const mockCdkDiffOutput: OsOutput = {
        exitCode: 1,
        stderr: 'mock cdk diff',
        stdout: ''
      };
      mockExistsSync.mockReturnValueOnce(true);
      mockRunCommand.mockResolvedValueOnce(mockCdkDiffOutput)

      let thrownError;
      try {
        await prepareForSmokeTest(IacFormat.awsCdk);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockExistsSync).toBeCalled();
        expect(mockMkdirSync).not.toBeCalled();
        
        expect(mockRunCommand).toBeCalled();
        expect(mockRunCommand).toBeCalledWith('cdk diff');

        expect(thrownError).toHaveProperty('name', 'CustomError');
        expect(thrownError).toHaveProperty('message', 'cdk diff failed with exit code 1');
  
        expect(mockWriteFileSync).not.toBeCalled();  
        expect(mockParseCdkDiff).not.toBeCalled();
      }

    });
    it('runs terraform init, plan, and show and calls parse for terraform format', async () => {
      const mockOsOutput: OsOutput = {
        exitCode: 0,
        stderr: '',
        stdout: ''
      };
      mockExistsSync.mockReturnValueOnce(true);
      mockRunCommand.mockResolvedValueOnce(mockOsOutput)
      mockRunCommand.mockResolvedValueOnce(mockOsOutput)
      mockRunCommand.mockResolvedValueOnce(mockOsOutput)

      await prepareForSmokeTest(IacFormat.tf);

      expect(mockExistsSync).toBeCalled();
      expect(mockMkdirSync).not.toBeCalled();
      
      expect(mockRunCommand).toBeCalled();
      expect(mockRunCommand).toBeCalledTimes(3);
      expect(mockRunCommand).toBeCalledWith('terraform init');
      expect(mockRunCommand).toBeCalledWith('terraform plan -out=/tmp/iac-utils/tmp/tfplan');
      expect(mockRunCommand).toBeCalledWith('terraform show -no-color -json /tmp/iac-utils/tmp/tfplan > /tmp/iac-utils/tmp/plan.json');

      expect(mockParseTerraformDiff).toBeCalled();
      expect(mockParseTerraformDiff).toBeCalledWith(`/tmp/iac-utils/tmp/plan.json`);
    });
  });
});