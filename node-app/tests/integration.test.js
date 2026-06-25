'use strict';

const data = require('../src/data');
const operations = require('../src/operations');

describe('Integration Tests - End-to-End Flows', () => {
  beforeEach(() => {
    data.reset();
  });

  test('TC-1.1: View balance shows initial balance of 1000.00', () => {
    expect(operations.getBalance()).toBe(1000.00);
  });

  test('TC-2.1: Credit then view balance shows updated amount', () => {
    operations.credit(100.00);
    expect(operations.getBalance()).toBe(1100.00);
  });

  test('TC-2.2: Credit zero then view balance shows unchanged amount', () => {
    operations.credit(0.00);
    expect(operations.getBalance()).toBe(1000.00);
  });

  test('TC-3.1: Debit valid amount then view balance shows reduced amount', () => {
    operations.debit(50.00);
    expect(operations.getBalance()).toBe(950.00);
  });

  test('TC-3.2: Debit exceeding balance is rejected and balance unchanged', () => {
    const result = operations.debit(2000.00);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Insufficient funds for this debit.');
    expect(operations.getBalance()).toBe(1000.00);
  });

  test('TC-3.3: Debit zero then view balance shows unchanged amount', () => {
    operations.debit(0.00);
    expect(operations.getBalance()).toBe(1000.00);
  });

  test('Multiple operations in sequence', () => {
    expect(operations.getBalance()).toBe(1000.00);

    operations.credit(500.00);
    expect(operations.getBalance()).toBe(1500.00);

    operations.debit(200.00);
    expect(operations.getBalance()).toBe(1300.00);

    const failed = operations.debit(2000.00);
    expect(failed.success).toBe(false);
    expect(operations.getBalance()).toBe(1300.00);

    operations.credit(0.00);
    expect(operations.getBalance()).toBe(1300.00);

    operations.debit(1300.00);
    expect(operations.getBalance()).toBe(0.00);
  });
});
