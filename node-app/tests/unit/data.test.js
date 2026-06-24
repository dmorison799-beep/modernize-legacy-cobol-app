'use strict';

const { DataStore, INITIAL_BALANCE } = require('../../src/data');

describe('DataStore', () => {
  let store;

  beforeEach(() => {
    store = new DataStore();
  });

  test('should initialize with default balance of 1000.00', () => {
    expect(store.read()).toBe(INITIAL_BALANCE);
    expect(store.read()).toBe(1000.00);
  });

  test('should accept a custom initial balance', () => {
    const custom = new DataStore(500.00);
    expect(custom.read()).toBe(500.00);
  });

  test('read() should return the current balance', () => {
    expect(store.read()).toBe(1000.00);
  });

  test('write() should update the stored balance', () => {
    store.write(1500.00);
    expect(store.read()).toBe(1500.00);
  });

  test('write() then read() should reflect the latest value', () => {
    store.write(0);
    expect(store.read()).toBe(0);
    store.write(999999.99);
    expect(store.read()).toBe(999999.99);
  });
});
