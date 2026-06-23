'use strict';

const DataStore = require('../../src/data');
const Operations = require('../../src/operations');

describe('Operations (operations.cob equivalent)', () => {
  let dataStore;
  let operations;

  beforeEach(() => {
    dataStore = new DataStore(1000.00);
    operations = new Operations(dataStore);
  });

  // TC-1.1: View Current Balance
  describe('TC-1.1: viewBalance', () => {
    test('displays current balance of 1000.00', () => {
      const result = operations.viewBalance();
      expect(result.success).toBe(true);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Current balance: 1000.00');
    });

    test('reflects balance after operations', () => {
      operations.credit(500);
      const result = operations.viewBalance();
      expect(result.balance).toBe(1500.00);
      expect(result.message).toBe('Current balance: 1500.00');
    });
  });

  // TC-2.1: Credit Account with Valid Amount
  describe('TC-2.1: credit with valid amount', () => {
    test('credits 100.00 and returns new balance 1100.00', () => {
      const result = operations.credit(100.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(1100.00);
      expect(result.message).toBe('Amount credited. New balance: 1100.00');
    });

    test('credits string amount "200.00"', () => {
      const result = operations.credit('200.00');
      expect(result.success).toBe(true);
      expect(result.balance).toBe(1200.00);
    });

    test('multiple credits accumulate correctly', () => {
      operations.credit(100);
      operations.credit(200);
      const result = operations.credit(300);
      expect(result.balance).toBe(1600.00);
    });
  });

  // TC-2.2: Credit Account with Zero Amount
  describe('TC-2.2: credit with zero amount', () => {
    test('balance remains 1000.00 when crediting 0', () => {
      const result = operations.credit(0);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Amount credited. New balance: 1000.00');
    });
  });

  // TC-2.x: Credit with invalid amount
  describe('credit with invalid amount', () => {
    test('rejects negative amount', () => {
      const result = operations.credit(-50);
      expect(result.success).toBe(false);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Invalid credit amount.');
    });

    test('rejects non-numeric string', () => {
      const result = operations.credit('abc');
      expect(result.success).toBe(false);
      expect(result.balance).toBe(1000.00);
    });
  });

  // TC-3.1: Debit Account with Valid Amount
  describe('TC-3.1: debit with valid amount', () => {
    test('debits 50.00 and returns new balance 950.00', () => {
      const result = operations.debit(50.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(950.00);
      expect(result.message).toBe('Amount debited. New balance: 950.00');
    });

    test('debits string amount "300.00"', () => {
      const result = operations.debit('300.00');
      expect(result.success).toBe(true);
      expect(result.balance).toBe(700.00);
    });

    test('debits exact balance (boundary)', () => {
      const result = operations.debit(1000.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(0);
      expect(result.message).toBe('Amount debited. New balance: 0.00');
    });
  });

  // TC-3.2: Debit Account with Amount Greater Than Balance
  describe('TC-3.2: debit with amount greater than balance', () => {
    test('rejects debit of 2000.00 on balance of 1000.00', () => {
      const result = operations.debit(2000.00);
      expect(result.success).toBe(false);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Insufficient funds for this debit.');
    });

    test('balance unchanged after rejected debit', () => {
      operations.debit(2000.00);
      expect(dataStore.read()).toBe(1000.00);
    });
  });

  // TC-3.3: Debit Account with Zero Amount
  describe('TC-3.3: debit with zero amount', () => {
    test('balance remains 1000.00 when debiting 0', () => {
      const result = operations.debit(0);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Amount debited. New balance: 1000.00');
    });
  });

  // Debit with invalid amount
  describe('debit with invalid amount', () => {
    test('rejects negative amount', () => {
      const result = operations.debit(-100);
      expect(result.success).toBe(false);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Invalid debit amount.');
    });

    test('rejects non-numeric string', () => {
      const result = operations.debit('xyz');
      expect(result.success).toBe(false);
      expect(result.balance).toBe(1000.00);
    });
  });
});
