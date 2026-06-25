'use strict';

const data = require('../src/data');

describe('DataProgram - Data Persistence Layer', () => {
  beforeEach(() => {
    data.reset();
  });

  test('should initialize with default balance of 1000.00', () => {
    expect(data.read()).toBe(1000.00);
  });

  test('should read the current balance', () => {
    const balance = data.read();
    expect(typeof balance).toBe('number');
    expect(balance).toBe(1000.00);
  });

  test('should write a new balance', () => {
    data.write(1500.00);
    expect(data.read()).toBe(1500.00);
  });

  test('should persist balance across multiple reads', () => {
    data.write(2000.00);
    expect(data.read()).toBe(2000.00);
    expect(data.read()).toBe(2000.00);
  });

  test('should reset balance to default', () => {
    data.write(5000.00);
    data.reset();
    expect(data.read()).toBe(1000.00);
  });

  test('should handle zero balance', () => {
    data.write(0);
    expect(data.read()).toBe(0);
  });
});
