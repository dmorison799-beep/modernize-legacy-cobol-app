'use strict';

const data = require('../src/data');
const operations = require('../src/operations');

describe('Operations - Business Logic', () => {
  beforeEach(() => {
    data.reset();
  });

  describe('TC-1.1: View Current Balance', () => {
    test('should return the current balance', () => {
      const balance = operations.getBalance();
      expect(balance).toBe(1000.00);
    });

    test('should reflect balance changes', () => {
      operations.credit(500);
      expect(operations.getBalance()).toBe(1500.00);
    });
  });

  describe('TC-2.1: Credit Account with Valid Amount', () => {
    test('should credit account with a valid amount', () => {
      const result = operations.credit(100.00);
      expect(result.balance).toBe(1100.00);
    });

    test('should credit account with a decimal amount', () => {
      const result = operations.credit(50.75);
      expect(result.balance).toBe(1050.75);
    });
  });

  describe('TC-2.2: Credit Account with Zero Amount', () => {
    test('should keep balance unchanged when crediting zero', () => {
      const result = operations.credit(0.00);
      expect(result.balance).toBe(1000.00);
    });
  });

  describe('TC-3.1: Debit Account with Valid Amount', () => {
    test('should debit account with a valid amount', () => {
      const result = operations.debit(50.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(950.00);
    });

    test('should debit account with a decimal amount', () => {
      const result = operations.debit(25.50);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(974.50);
    });
  });

  describe('TC-3.2: Debit Account with Amount Greater Than Balance', () => {
    test('should reject debit exceeding balance', () => {
      const result = operations.debit(2000.00);
      expect(result.success).toBe(false);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Insufficient funds for this debit.');
    });

    test('should not change balance on rejected debit', () => {
      operations.debit(2000.00);
      expect(operations.getBalance()).toBe(1000.00);
    });
  });

  describe('TC-3.3: Debit Account with Zero Amount', () => {
    test('should keep balance unchanged when debiting zero', () => {
      const result = operations.debit(0.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(1000.00);
    });
  });
});
