'use strict';

const { DataStore } = require('../../src/data');
const { Operations } = require('../../src/operations');

describe('Operations', () => {
  let dataStore;
  let ops;

  beforeEach(() => {
    dataStore = new DataStore();
    ops = new Operations(dataStore);
  });

  // TC-1.1: View Current Balance
  describe('viewBalance()', () => {
    test('TC-1.1: should display the current balance (initial 1000.00)', () => {
      const result = ops.viewBalance();
      expect(result.success).toBe(true);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Current balance: 1000.00');
    });

    test('should reflect balance changes', () => {
      dataStore.write(2500.50);
      const result = ops.viewBalance();
      expect(result.balance).toBe(2500.50);
      expect(result.message).toBe('Current balance: 2500.50');
    });
  });

  // TC-2.x: Credit Account
  describe('credit()', () => {
    test('TC-2.1: should credit account with a valid amount', () => {
      const result = ops.credit(100.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(1100.00);
      expect(result.message).toBe('Amount credited. New balance: 1100.00');
    });

    test('TC-2.2: should leave balance unchanged when crediting zero', () => {
      const result = ops.credit(0.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Amount credited. New balance: 1000.00');
    });

    test('should reject negative credit amount', () => {
      const result = ops.credit(-50);
      expect(result.success).toBe(false);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Invalid credit amount.');
    });

    test('should reject NaN credit amount', () => {
      const result = ops.credit(NaN);
      expect(result.success).toBe(false);
      expect(result.balance).toBe(1000.00);
    });
  });

  // TC-3.x: Debit Account
  describe('debit()', () => {
    test('TC-3.1: should debit account with a valid amount', () => {
      const result = ops.debit(50.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(950.00);
      expect(result.message).toBe('Amount debited. New balance: 950.00');
    });

    test('TC-3.2: should reject debit exceeding balance', () => {
      const result = ops.debit(2000.00);
      expect(result.success).toBe(false);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Insufficient funds for this debit.');
    });

    test('TC-3.3: should leave balance unchanged when debiting zero', () => {
      const result = ops.debit(0.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Amount debited. New balance: 1000.00');
    });

    test('should reject negative debit amount', () => {
      const result = ops.debit(-100);
      expect(result.success).toBe(false);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Invalid debit amount.');
    });

    test('should debit exact balance (edge case)', () => {
      const result = ops.debit(1000.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(0);
      expect(result.message).toBe('Amount debited. New balance: 0.00');
    });
  });

  // Multi-operation workflow
  describe('multi-operation workflow', () => {
    test('credit then debit should reflect correct balance', () => {
      ops.credit(500.00);
      const result = ops.debit(200.00);
      expect(result.balance).toBe(1300.00);
    });

    test('multiple credits accumulate', () => {
      ops.credit(100);
      ops.credit(200);
      ops.credit(300);
      const result = ops.viewBalance();
      expect(result.balance).toBe(1600.00);
    });
  });
});
