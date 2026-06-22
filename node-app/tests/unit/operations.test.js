'use strict';

const Operations = require('../../src/operations');
const DataStore = require('../../src/data');

describe('Operations', () => {
  let operations;
  let dataStore;

  beforeEach(() => {
    dataStore = new DataStore(1000.00);
    operations = new Operations(dataStore);
  });

  describe('viewBalance()', () => {
    // TC-1.1: View Current Balance
    it('should return the current balance', () => {
      const result = operations.viewBalance();
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Current balance: 1000.00');
    });

    it('should reflect balance changes', () => {
      dataStore.write(2500.50);
      const result = operations.viewBalance();
      expect(result.balance).toBe(2500.50);
      expect(result.message).toBe('Current balance: 2500.50');
    });
  });

  describe('credit()', () => {
    // TC-2.1: Credit Account with Valid Amount
    it('should credit the account with a valid amount', () => {
      const result = operations.credit(100.00);
      expect(result.balance).toBe(1100.00);
      expect(result.message).toBe('Amount credited. New balance: 1100.00');
    });

    // TC-2.2: Credit Account with Zero Amount
    it('should handle zero credit amount (balance unchanged)', () => {
      const result = operations.credit(0);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Amount credited. New balance: 1000.00');
    });

    it('should handle decimal credit amounts', () => {
      const result = operations.credit(50.75);
      expect(result.balance).toBeCloseTo(1050.75, 2);
    });
  });

  describe('debit()', () => {
    // TC-3.1: Debit Account with Valid Amount
    it('should debit the account with a valid amount', () => {
      const result = operations.debit(50.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(950.00);
      expect(result.message).toBe('Amount debited. New balance: 950.00');
    });

    // TC-3.2: Debit Account with Amount Greater Than Balance
    it('should reject debit when amount exceeds balance', () => {
      const result = operations.debit(2000.00);
      expect(result.success).toBe(false);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Insufficient funds for this debit.');
    });

    // TC-3.3: Debit Account with Zero Amount
    it('should handle zero debit amount (balance unchanged)', () => {
      const result = operations.debit(0);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Amount debited. New balance: 1000.00');
    });

    it('should allow debiting the exact balance', () => {
      const result = operations.debit(1000.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(0);
    });
  });
});
