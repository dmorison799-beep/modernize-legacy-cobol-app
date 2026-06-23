'use strict';

const DataStore = require('../../src/data');

describe('DataStore (data.cob equivalent)', () => {
  let store;

  beforeEach(() => {
    store = new DataStore();
  });

  test('initializes with default balance of 1000.00', () => {
    expect(store.read()).toBe(1000.00);
  });

  test('initializes with custom balance', () => {
    const custom = new DataStore(5000.00);
    expect(custom.read()).toBe(5000.00);
  });

  test('read returns current balance', () => {
    expect(store.read()).toBe(1000.00);
  });

  test('write updates the stored balance', () => {
    store.write(2500.50);
    expect(store.read()).toBe(2500.50);
  });

  test('write then read preserves precision', () => {
    store.write(999999.99);
    expect(store.read()).toBe(999999.99);
  });

  test('reset restores default balance', () => {
    store.write(500.00);
    store.reset();
    expect(store.read()).toBe(1000.00);
  });

  test('reset with custom value', () => {
    store.reset(2000.00);
    expect(store.read()).toBe(2000.00);
  });

  test('write zero balance', () => {
    store.write(0);
    expect(store.read()).toBe(0);
  });
});
