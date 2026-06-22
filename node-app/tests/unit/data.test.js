'use strict';

const DataStore = require('../../src/data');

describe('DataStore', () => {
  let dataStore;

  beforeEach(() => {
    dataStore = new DataStore();
  });

  describe('constructor', () => {
    it('should initialize with default balance of 1000.00', () => {
      expect(dataStore.read()).toBe(1000.00);
    });

    it('should accept a custom initial balance', () => {
      const custom = new DataStore(5000.00);
      expect(custom.read()).toBe(5000.00);
    });
  });

  describe('read()', () => {
    it('should return the current stored balance', () => {
      expect(dataStore.read()).toBe(1000.00);
    });
  });

  describe('write()', () => {
    it('should update the stored balance', () => {
      dataStore.write(2500.00);
      expect(dataStore.read()).toBe(2500.00);
    });

    it('should allow writing zero balance', () => {
      dataStore.write(0);
      expect(dataStore.read()).toBe(0);
    });
  });
});
