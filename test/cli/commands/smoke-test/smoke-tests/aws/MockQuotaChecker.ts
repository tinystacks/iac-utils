import QuotaChecker from "../../../../../../src/cli/abstracts/quota-checker";

const mockCheckQuotas = jest.fn()
class MockQuotaChecker extends QuotaChecker {
  checkQuota = mockCheckQuotas;
}

export {
  mockCheckQuotas,
  MockQuotaChecker
};
export default MockQuotaChecker;