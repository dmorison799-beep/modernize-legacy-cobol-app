'use strict';

const { PassThrough, Writable } = require('stream');
const { AccountApp } = require('../../src/main');

function createMockOutput() {
  let buffer = '';
  const output = new Writable({
    write(chunk, _encoding, callback) {
      buffer += chunk.toString();
      callback();
    }
  });
  output.getOutput = () => buffer;
  return output;
}

/**
 * Run the app with scripted answers.
 * We override ask() to return from a queue so readline stream timing
 * is irrelevant. This exercises the full run() loop including menu
 * display, switch dispatch, and all Operations calls.
 */
async function runApp(answers) {
  const input = new PassThrough();
  const output = createMockOutput();
  const app = new AccountApp(input, output);

  const queue = [...answers];
  app.ask = (_rl, _question) => {
    return Promise.resolve(queue.shift() || '4');
  };

  await app.run();
  input.destroy();
  return output.getOutput();
}

describe('Integration: Account Management System', () => {
  // TC-4.1: Exit the Application
  test('TC-4.1: should exit gracefully when option 4 is selected', async () => {
    const result = await runApp(['4']);
    expect(result).toContain('Account Management System');
    expect(result).toContain('Exiting the program. Goodbye!');
  });

  test('should display menu on startup', async () => {
    const result = await runApp(['4']);
    expect(result).toContain('1. View Balance');
    expect(result).toContain('2. Credit Account');
    expect(result).toContain('3. Debit Account');
    expect(result).toContain('4. Exit');
  });

  test('should view balance then exit', async () => {
    const result = await runApp(['1', '4']);
    expect(result).toContain('Current balance: 1000.00');
    expect(result).toContain('Exiting the program. Goodbye!');
  });

  test('should credit account then view balance then exit', async () => {
    const result = await runApp(['2', '200', '1', '4']);
    expect(result).toContain('Amount credited. New balance: 1200.00');
    expect(result).toContain('Current balance: 1200.00');
  });

  test('should debit account then view balance then exit', async () => {
    const result = await runApp(['3', '300', '1', '4']);
    expect(result).toContain('Amount debited. New balance: 700.00');
    expect(result).toContain('Current balance: 700.00');
  });

  test('should handle insufficient funds during debit', async () => {
    const result = await runApp(['3', '2000', '1', '4']);
    expect(result).toContain('Insufficient funds for this debit.');
    expect(result).toContain('Current balance: 1000.00');
  });

  test('should handle invalid menu choice', async () => {
    const result = await runApp(['9', '4']);
    expect(result).toContain('Invalid choice, please select 1-4.');
  });

  test('full workflow: credit, debit, view, exit', async () => {
    const result = await runApp([
      '2', '500',    // credit 500 → 1500
      '3', '200',    // debit 200 → 1300
      '1',           // view balance
      '4'            // exit
    ]);
    expect(result).toContain('Amount credited. New balance: 1500.00');
    expect(result).toContain('Amount debited. New balance: 1300.00');
    expect(result).toContain('Current balance: 1300.00');
    expect(result).toContain('Exiting the program. Goodbye!');
  });
});
