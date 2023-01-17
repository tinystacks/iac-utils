import ResourceTester from "../../../../../../src/cli/abstracts/resource-tester";

const mockTestResource = jest.fn();
class MockResourceTester extends ResourceTester {
  testResource = mockTestResource;
}

export {
  mockTestResource,
  MockResourceTester
};
export default MockResourceTester;