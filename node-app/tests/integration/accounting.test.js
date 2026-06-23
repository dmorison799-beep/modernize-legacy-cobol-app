'use strict';

const { PassThrough } = require('stream');
const AccountApp = require('../../src/main');

/**
 * Integration tests for the full accounting application.
 * Simulates user interaction through stdin/stdout streams,
 * verifying the end-to-end flow matches COBOL behavior.
 */

function createApp(initialBalance) {
  const input = new PassThrough();
  const output = new PassThrough();
  output.setEncoding('utf8');

  const app = new AccountApp({
    initialBalance: initialBalance,
    input: input,
    output: output
  });

  return { app, input, output };
}

function collectOutput(output) {
  return new Promise((resolve) => {
    let data = '';
    output.on('data', (chunk) => { data += chunk; });
    output.on('end', () => resolve(data));
  });
}

function sendInputSequence(input, commands) {
  let delay = 0;
  for (const cmd of commands) {
    setTimeout(() => {
      input.write(cmd + '\n');
    }, delay);
    delay += 50;
  }
}

describe('Integration: Full accounting workflow', () => {
  test('TC-1.1 + TC-4.1: view balance then exit', async () => {
    const { app, input, output } = createApp(1000.00);
    const outputPromise = collectOutput(output);

    sendInputSequence(input, ['1', '4']);

    await app.run();
    output.end();

    const result = await outputPromise;
    expect(result).toContain('Account Management System');
    expect(result).toContain('Current balance: 1000.00');
    expect(result).toContain('Exiting the program. Goodbye!');
  });

  test('TC-2.1: credit then view balance', async () => {
    const { app, input, output } = createApp(1000.00);
    const outputPromise = collectOutput(output);

    sendInputSequence(input, ['2', '500', '1', '4']);

    await app.run();
    output.end();

    const result = await outputPromise;
    expect(result).toContain('Amount credited. New balance: 1500.00');
    expect(result).toContain('Current balance: 1500.00');
  });

  test('TC-3.1: debit with sufficient funds', async () => {
    const { app, input, output } = createApp(1000.00);
    const outputPromise = collectOutput(output);

    sendInputSequence(input, ['3', '200', '1', '4']);

    await app.run();
    output.end();

    const result = await outputPromise;
    expect(result).toContain('Amount debited. New balance: 800.00');
    expect(result).toContain('Current balance: 800.00');
  });

  test('TC-3.2: debit with insufficient funds', async () => {
    const { app, input, output } = createApp(1000.00);
    const outputPromise = collectOutput(output);

    sendInputSequence(input, ['3', '2000', '1', '4']);

    await app.run();
    output.end();

    const result = await outputPromise;
    expect(result).toContain('Insufficient funds for this debit.');
    expect(result).toContain('Current balance: 1000.00');
  });

  test('invalid menu choice shows error', async () => {
    const { app, input, output } = createApp(1000.00);
    const outputPromise = collectOutput(output);

    sendInputSequence(input, ['9', '4']);

    await app.run();
    output.end();

    const result = await outputPromise;
    expect(result).toContain('Invalid choice, please select 1-4.');
    expect(result).toContain('Exiting the program. Goodbye!');
  });

  test('full workflow: credit, debit, view, exit', async () => {
    const { app, input, output } = createApp(1000.00);
    const outputPromise = collectOutput(output);

    sendInputSequence(input, [
      '2', '500',   // credit 500 -> 1500
      '3', '200',   // debit 200  -> 1300
      '1',          // view balance
      '4'           // exit
    ]);

    await app.run();
    output.end();

    const result = await outputPromise;
    expect(result).toContain('Amount credited. New balance: 1500.00');
    expect(result).toContain('Amount debited. New balance: 1300.00');
    expect(result).toContain('Current balance: 1300.00');
    expect(result).toContain('Exiting the program. Goodbye!');
  });

  test('custom initial balance', async () => {
    const { app, input, output } = createApp(5000.00);
    const outputPromise = collectOutput(output);

    sendInputSequence(input, ['1', '4']);

    await app.run();
    output.end();

    const result = await outputPromise;
    expect(result).toContain('Current balance: 5000.00');
  });
});
