'use strict';

const DataStore = require('../../src/data');

describe('DataStore (maps to data.cob - DataProgram)', () => {
  let dataStore;

  beforeEach(() => {
    dataStore = new DataStore(1000.00);
  });

  describe('constructor', () => {
    it('should initialize with default balance of 1000.00', () => {
      const store = new DataStore();
      expect(store.read()).toBe(1000.00);
    });

    it('should initialize with custom balance', () => {
      const store = new DataStore(5000.00);
      expect(store.read()).toBe(5000.00);
    });
  });

  describe('read()', () => {
    it('should return the current balance', () => {
      expect(dataStore.read()).toBe(1000.00);
    });
  });

  describe('write()', () => {
    it('should update the stored balance', () => {
      dataStore.write(1500.00);
      expect(dataStore.read()).toBe(1500.00);
    });

    it('should overwrite previous balance', () => {
      dataStore.write(2000.00);
      dataStore.write(500.00);
      expect(dataStore.read()).toBe(500.00);
    });
  });
});
