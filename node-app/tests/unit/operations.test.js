'use strict';

const DataStore = require('../../src/data');
const Operations = require('../../src/operations');

describe('Operations (maps to operations.cob)', () => {
  let dataStore;
  let operations;

  beforeEach(() => {
    dataStore = new DataStore(1000.00);
    operations = new Operations(dataStore);
  });

  describe('TC-1.1: View Current Balance', () => {
    it('should display the current balance', () => {
      const result = operations.viewBalance();
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Current balance: 1000.00');
    });

    it('should reflect balance changes', () => {
      dataStore.write(2500.00);
      const result = operations.viewBalance();
      expect(result.balance).toBe(2500.00);
      expect(result.message).toBe('Current balance: 2500.00');
    });
  });

  describe('TC-2.1: Credit Account with Valid Amount', () => {
    it('should credit the account and display new balance', () => {
      const result = operations.credit(100.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(1100.00);
      expect(result.message).toBe('Amount credited. New balance: 1100.00');
    });

    it('should credit with string amount', () => {
      const result = operations.credit('200.00');
      expect(result.success).toBe(true);
      expect(result.balance).toBe(1200.00);
    });

    it('should accumulate multiple credits', () => {
      operations.credit(100.00);
      operations.credit(200.00);
      const result = operations.viewBalance();
      expect(result.balance).toBe(1300.00);
    });
  });

  describe('TC-2.2: Credit Account with Zero Amount', () => {
    it('should keep balance unchanged when credited with zero', () => {
      const result = operations.credit(0.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Amount credited. New balance: 1000.00');
    });
  });

  describe('TC-3.1: Debit Account with Valid Amount', () => {
    it('should debit the account and display new balance', () => {
      const result = operations.debit(50.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(950.00);
      expect(result.message).toBe('Amount debited. New balance: 950.00');
    });

    it('should debit with string amount', () => {
      const result = operations.debit('300.00');
      expect(result.success).toBe(true);
      expect(result.balance).toBe(700.00);
    });

    it('should allow debit equal to balance', () => {
      const result = operations.debit(1000.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(0.00);
    });
  });

  describe('TC-3.2: Debit Account with Amount Greater Than Balance', () => {
    it('should reject debit and display insufficient funds message', () => {
      const result = operations.debit(2000.00);
      expect(result.success).toBe(false);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Insufficient funds for this debit.');
    });

    it('should not change balance after failed debit', () => {
      operations.debit(2000.00);
      const balance = operations.viewBalance();
      expect(balance.balance).toBe(1000.00);
    });
  });

  describe('TC-3.3: Debit Account with Zero Amount', () => {
    it('should keep balance unchanged when debited with zero', () => {
      const result = operations.debit(0.00);
      expect(result.success).toBe(true);
      expect(result.balance).toBe(1000.00);
      expect(result.message).toBe('Amount debited. New balance: 1000.00');
    });
  });

  describe('Invalid inputs', () => {
    it('should reject negative credit amount', () => {
      const result = operations.credit(-100);
      expect(result.success).toBe(false);
    });

    it('should reject negative debit amount', () => {
      const result = operations.debit(-50);
      expect(result.success).toBe(false);
    });

    it('should reject non-numeric credit', () => {
      const result = operations.credit('abc');
      expect(result.success).toBe(false);
    });

    it('should reject non-numeric debit', () => {
      const result = operations.debit('xyz');
      expect(result.success).toBe(false);
    });
  });
});
