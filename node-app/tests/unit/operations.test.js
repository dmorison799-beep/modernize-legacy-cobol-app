'use strict';

const data = require('../../src/data');
const operations = require('../../src/operations');

describe('Operations Module', () => {
  beforeEach(() => {
    data.resetBalance();
  });

  describe('TC-1.1: viewBalance', () => {
    it('should display the current balance', () => {
      const result = operations.viewBalance();
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Current balance: 1000.00');
    });

    it('should reflect balance changes', () => {
      data.writeBalance(1500.00);
      const result = operations.viewBalance();
      expect(result.balance).toBe(1500.00);
      expect(result.message).toBe('Current balance: 1500.00');
    });
  });

  describe('TC-2.1: creditAccount with valid amount', () => {
    it('should credit the account and return new balance', () => {
      const result = operations.creditAccount(100.00);
      expect(result.balance).toBe(1100.00);
      expect(result.message).toBe('Amount credited. New balance: 1100.00');
    });

    it('should handle decimal credit amounts', () => {
      const result = operations.creditAccount(200.50);
      expect(result.balance).toBe(1200.50);
      expect(result.message).toBe('Amount credited. New balance: 1200.50');
    });

    it('should accumulate multiple credits', () => {
      operations.creditAccount(100.00);
      const result = operations.creditAccount(200.00);
      expect(result.balance).toBe(1300.00);
    });
  });

  describe('TC-2.2: creditAccount with zero amount', () => {
    it('should not change balance when credited with zero', () => {
      const result = operations.creditAccount(0.00);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Amount credited. New balance: 1000.00');
    });
  });

  describe('TC-3.1: debitAccount with valid amount', () => {
    it('should debit the account and return new balance', () => {
      const result = operations.debitAccount(50.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(950.00);
      expect(result.message).toBe('Amount debited. New balance: 950.00');
    });

    it('should handle decimal debit amounts', () => {
      const result = operations.debitAccount(100.50);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(899.50);
    });

    it('should allow debiting the exact balance', () => {
      const result = operations.debitAccount(1000.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(0.00);
    });
  });

  describe('TC-3.2: debitAccount with amount greater than balance', () => {
    it('should reject debit and show insufficient funds', () => {
      const result = operations.debitAccount(2000.00);
      expect(result.success).toBe(false);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Insufficient funds for this debit.');
    });

    it('should not change balance on failed debit', () => {
      operations.debitAccount(5000.00);
      expect(data.readBalance()).toBe(1000.00);
    });
  });

  describe('TC-3.3: debitAccount with zero amount', () => {
    it('should not change balance when debited with zero', () => {
      const result = operations.debitAccount(0.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Amount debited. New balance: 1000.00');
    });
  });

  describe('Floating point precision', () => {
    it('should handle amounts that cause floating point issues', () => {
      const result = operations.creditAccount(0.1 + 0.2);
      // 1000 + 0.30 = 1000.30
      expect(result.balance).toBe(1000.30);
    });
  });
});
