import {
  getOrdinalSuffix
} from '../../../../src/cli/utils/grammar';

describe('grammar utils', () => {
  describe('getOrdinalSuffix', () => {
    it('returns "st" for 1\'s but "th" for 11\'s', () => {
      const result1 = getOrdinalSuffix(1);
      expect(result1).toEqual('st');
      const result11 = getOrdinalSuffix(11);
      expect(result11).toEqual('th');
      
      const result21 = getOrdinalSuffix(21);
      expect(result21).toEqual('st');
      
      const result101 = getOrdinalSuffix(101);
      expect(result101).toEqual('st');
      const result111 = getOrdinalSuffix(111);
      expect(result111).toEqual('th');
    });
    
    it('returns "nd" for 2\'s but "th" for 12\'s', () => {
      const result2 = getOrdinalSuffix(2);
      expect(result2).toEqual('nd');
      const result12 = getOrdinalSuffix(12);
      expect(result12).toEqual('th');
      
      const result22 = getOrdinalSuffix(22);
      expect(result22).toEqual('nd');
      
      const result202 = getOrdinalSuffix(202);
      expect(result202).toEqual('nd');
      const result212 = getOrdinalSuffix(212);
      expect(result212).toEqual('th');
    });
    
    it('returns "rd" for 3\'s but "th" for 13\'s', () => {
      const result3 = getOrdinalSuffix(3);
      expect(result3).toEqual('rd');
      const result13 = getOrdinalSuffix(13);
      expect(result13).toEqual('th');
      
      const result33 = getOrdinalSuffix(33);
      expect(result33).toEqual('rd');
      
      const result303 = getOrdinalSuffix(303);
      expect(result303).toEqual('rd');
      const result313 = getOrdinalSuffix(313);
      expect(result313).toEqual('th');
    });
    
    it('returns "th" for everything else', () => {
      const result4 = getOrdinalSuffix(4);
      expect(result4).toEqual('th');
      const result15 = getOrdinalSuffix(15);
      expect(result15).toEqual('th');
      const result26 = getOrdinalSuffix(26);
      expect(result26).toEqual('th');
      const result37 = getOrdinalSuffix(37);
      expect(result37).toEqual('th');
      const result48 = getOrdinalSuffix(48);
      expect(result48).toEqual('th');
      const result59 = getOrdinalSuffix(59);
      expect(result59).toEqual('th');
    });
  });
});