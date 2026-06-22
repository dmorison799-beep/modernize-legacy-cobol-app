'use strict';

const data = require('../../src/data');

describe('Data Module', () => {
  beforeEach(() => {
    data.resetBalance();
  });

  describe('INITIAL_BALANCE', () => {
    it('should be 1000.00', () => {
      expect(data.INITIAL_BALANCE).toBe(1000.00);
    });
  });

  describe('readBalance', () => {
    it('should return the initial balance on startup', () => {
      expect(data.readBalance()).toBe(1000.00);
    });
  });

  describe('writeBalance', () => {
    it('should persist a new balance', () => {
      data.writeBalance(2500.00);
      expect(data.readBalance()).toBe(2500.00);
    });

    it('should overwrite previous value', () => {
      data.writeBalance(500.00);
      data.writeBalance(750.00);
      expect(data.readBalance()).toBe(750.00);
    });

    it('should handle zero balance', () => {
      data.writeBalance(0);
      expect(data.readBalance()).toBe(0);
    });
  });

  describe('resetBalance', () => {
    it('should restore the initial balance', () => {
      data.writeBalance(9999.99);
      data.resetBalance();
      expect(data.readBalance()).toBe(1000.00);
    });
  });
});
