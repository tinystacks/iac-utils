import { AwsCdkParser } from "../../../../../../src/cli/abstracts";

const mockParseResource = jest.fn();

class MockParser extends AwsCdkParser {
  constructor() { super(); };
  parseResource = mockParseResource
}

export {
  MockParser
};
export default MockParser;