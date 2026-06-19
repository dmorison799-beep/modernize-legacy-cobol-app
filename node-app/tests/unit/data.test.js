'use strict';

const data = require('../../src/data');

describe('Data Module', () => {
  beforeEach(() => {
    data.resetBalance();
  });

  describe('readBalance', () => {
    it('should return the initial balance of 1000.00', () => {
      expect(data.readBalance()).toBe(1000.00);
    });

    it('should return updated balance after writeBalance', () => {
      data.writeBalance(500.00);
      expect(data.readBalance()).toBe(500.00);
    });
  });

  describe('writeBalance', () => {
    it('should persist a new balance value', () => {
      data.writeBalance(2500.50);
      expect(data.readBalance()).toBe(2500.50);
    });

    it('should overwrite previous balance', () => {
      data.writeBalance(100.00);
      data.writeBalance(999.99);
      expect(data.readBalance()).toBe(999.99);
    });

    it('should handle zero balance', () => {
      data.writeBalance(0);
      expect(data.readBalance()).toBe(0);
    });
  });

  describe('resetBalance', () => {
    it('should reset balance to initial value', () => {
      data.writeBalance(0);
      data.resetBalance();
      expect(data.readBalance()).toBe(data.INITIAL_BALANCE);
    });
  });

  describe('INITIAL_BALANCE', () => {
    it('should be 1000.00', () => {
      expect(data.INITIAL_BALANCE).toBe(1000.00);
    });
  });
});
