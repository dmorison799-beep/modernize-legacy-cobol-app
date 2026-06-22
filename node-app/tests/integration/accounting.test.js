'use strict';

const Operations = require('../../src/operations');
const DataStore = require('../../src/data');

describe('Accounting System - Integration Tests', () => {
  let operations;
  let dataStore;

  beforeEach(() => {
    dataStore = new DataStore(1000.00);
    operations = new Operations(dataStore);
  });

  describe('Full workflow scenarios', () => {
    // TC-1.1 + TC-2.1 + TC-3.1: Complete transaction flow
    it('should handle a complete credit-debit workflow', () => {
      // View initial balance
      let result = operations.viewBalance();
      expect(result.balance).toBe(1000.00);

      // Credit 200
      result = operations.credit(200.00);
      expect(result.balance).toBe(1200.00);

      // Debit 300
      result = operations.debit(300.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(900.00);

      // View final balance
      result = operations.viewBalance();
      expect(result.balance).toBe(900.00);
    });

    // TC-3.2: Insufficient funds after transactions
    it('should prevent overdraft after multiple transactions', () => {
      // Credit 500
      operations.credit(500.00);
      // Debit 1400 (balance is now 1500)
      const result1 = operations.debit(1400.00);
      expect(result1.success).toBe(true);
      expect(result1.balance).toBe(100.00);

      // Try to debit 200 (only 100 left)
      const result2 = operations.debit(200.00);
      expect(result2.success).toBe(false);
      expect(result2.balance).toBe(100.00);
      expect(result2.message).toBe('Insufficient funds for this debit.');
    });

    it('should handle multiple consecutive credits', () => {
      operations.credit(100.00);
      operations.credit(200.00);
      operations.credit(300.00);

      const result = operations.viewBalance();
      expect(result.balance).toBe(1600.00);
    });

    it('should handle multiple consecutive debits', () => {
      operations.debit(100.00);
      operations.debit(200.00);
      operations.debit(300.00);

      const result = operations.viewBalance();
      expect(result.balance).toBe(400.00);
    });

    it('should maintain data consistency across operations', () => {
      // Perform various operations and verify the data store stays consistent
      operations.credit(500.00);
      expect(dataStore.read()).toBe(1500.00);

      operations.debit(250.00);
      expect(dataStore.read()).toBe(1250.00);

      // Failed debit should not change the store
      operations.debit(5000.00);
      expect(dataStore.read()).toBe(1250.00);

      const result = operations.viewBalance();
      expect(result.balance).toBe(dataStore.read());
    });
  });

  describe('Edge cases', () => {
    it('should handle very small amounts', () => {
      const result = operations.credit(0.01);
      expect(result.balance).toBeCloseTo(1000.01, 2);
    });

    it('should handle large amounts', () => {
      const result = operations.credit(999999.99);
      expect(result.balance).toBeCloseTo(1000999.99, 2);
    });
  });
});
