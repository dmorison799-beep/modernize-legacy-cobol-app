'use strict';

const data = require('../../src/data');
const operations = require('../../src/operations');

describe('Integration Tests - Account Management System', () => {
  beforeEach(() => {
    data.resetBalance();
  });

  describe('TC-4.1: Full workflow simulation', () => {
    it('should handle a complete session: view, credit, debit, view', () => {
      // Step 1: View initial balance
      let result = operations.viewBalance();
      expect(result.balance).toBe(1000.00);

      // Step 2: Credit $200
      result = operations.creditAccount(200.00);
      expect(result.balance).toBe(1200.00);

      // Step 3: Debit $300
      result = operations.debitAccount(300.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(900.00);

      // Step 4: View balance after operations
      result = operations.viewBalance();
      expect(result.balance).toBe(900.00);
    });
  });

  describe('Multiple credits and debits', () => {
    it('should maintain correct balance across many operations', () => {
      operations.creditAccount(500.00);   // 1500
      operations.creditAccount(250.75);   // 1750.75
      operations.debitAccount(100.00);    // 1650.75
      operations.debitAccount(50.25);     // 1600.50

      const result = operations.viewBalance();
      expect(result.balance).toBe(1600.50);
    });
  });

  describe('Insufficient funds then successful debit', () => {
    it('should reject large debit then allow smaller one', () => {
      // Try to debit more than balance
      let result = operations.debitAccount(2000.00);
      expect(result.success).toBe(false);
      expect(result.balance).toBe(1000.00);

      // Now debit valid amount
      result = operations.debitAccount(500.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(500.00);
    });
  });

  describe('Drain account to zero', () => {
    it('should allow draining account completely then reject further debits', () => {
      // Drain account
      let result = operations.debitAccount(1000.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(0.00);

      // Try to debit from empty account
      result = operations.debitAccount(1.00);
      expect(result.success).toBe(false);
      expect(result.balance).toBe(0.00);
      expect(result.message).toBe('Insufficient funds for this debit.');
    });
  });

  describe('Credit after draining', () => {
    it('should allow credits after balance reaches zero', () => {
      operations.debitAccount(1000.00);
      const result = operations.creditAccount(500.00);
      expect(result.balance).toBe(500.00);
    });
  });

  describe('Data persistence between operations', () => {
    it('should persist balance across module calls', () => {
      operations.creditAccount(100.00);
      // Direct read from data module should reflect the change
      expect(data.readBalance()).toBe(1100.00);

      operations.debitAccount(50.00);
      expect(data.readBalance()).toBe(1050.00);
    });
  });
});
