'use strict';

const { Readable, Writable } = require('stream');
const AccountApp = require('../../src/main');

function createTestApp(inputs, options = {}) {
  const inputData = inputs.join('\n') + '\n';
  const inputStream = Readable.from([inputData]);

  let outputData = '';
  const outputStream = new Writable({
    write(chunk, _encoding, callback) {
      outputData += chunk.toString();
      callback();
    }
  });

  const app = new AccountApp({
    input: inputStream,
    output: outputStream,
    initialBalance: options.initialBalance,
    ...options
  });

  return { app, getOutput: () => outputData };
}

describe('AccountApp Integration (maps to main.cob full flow)', () => {
  it('TC-1.1: should view balance and exit', async () => {
    const { app, getOutput } = createTestApp(['1', '4']);
    await app.run();

    const output = getOutput();
    expect(output).toContain('Account Management System');
    expect(output).toContain('Current balance: 1000.00');
    expect(output).toContain('Exiting the program. Goodbye!');
  });

  it('TC-2.1: should credit account with valid amount', async () => {
    const { app, getOutput } = createTestApp(['2', '100.00', '4']);
    await app.run();

    const output = getOutput();
    expect(output).toContain('Amount credited. New balance: 1100.00');
  });

  it('TC-2.2: should credit with zero amount (balance unchanged)', async () => {
    const { app, getOutput } = createTestApp(['2', '0.00', '1', '4']);
    await app.run();

    const output = getOutput();
    expect(output).toContain('Amount credited. New balance: 1000.00');
    expect(output).toContain('Current balance: 1000.00');
  });

  it('TC-3.1: should debit account with valid amount', async () => {
    const { app, getOutput } = createTestApp(['3', '50.00', '4']);
    await app.run();

    const output = getOutput();
    expect(output).toContain('Amount debited. New balance: 950.00');
  });

  it('TC-3.2: should reject debit greater than balance', async () => {
    const { app, getOutput } = createTestApp(['3', '2000.00', '4']);
    await app.run();

    const output = getOutput();
    expect(output).toContain('Insufficient funds for this debit.');
  });

  it('TC-3.3: should debit with zero amount (balance unchanged)', async () => {
    const { app, getOutput } = createTestApp(['3', '0.00', '1', '4']);
    await app.run();

    const output = getOutput();
    expect(output).toContain('Amount debited. New balance: 1000.00');
    expect(output).toContain('Current balance: 1000.00');
  });

  it('TC-4.1: should exit the application', async () => {
    const { app, getOutput } = createTestApp(['4']);
    await app.run();

    const output = getOutput();
    expect(output).toContain('Exiting the program. Goodbye!');
  });

  it('should handle invalid menu choice', async () => {
    const { app, getOutput } = createTestApp(['9', '4']);
    await app.run();

    const output = getOutput();
    expect(output).toContain('Invalid choice, please select 1-4.');
  });

  it('should handle multiple operations in sequence', async () => {
    const { app, getOutput } = createTestApp([
      '2', '500.00',  // credit 500
      '3', '200.00',  // debit 200
      '1',            // view balance
      '4'             // exit
    ]);
    await app.run();

    const output = getOutput();
    expect(output).toContain('Amount credited. New balance: 1500.00');
    expect(output).toContain('Amount debited. New balance: 1300.00');
    expect(output).toContain('Current balance: 1300.00');
  });

  it('should use custom initial balance from options', async () => {
    const { app, getOutput } = createTestApp(['1', '4'], { initialBalance: 5000.00 });
    await app.run();

    const output = getOutput();
    expect(output).toContain('Current balance: 5000.00');
  });
});
