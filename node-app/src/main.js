'use strict';

const readline = require('readline');
const DataStore = require('./data');
const Operations = require('./operations');

/**
 * AccountApp - Maps from main.cob (MainProgram)
 *
 * Provides interactive CLI menu for the account management system.
 * COBOL equivalent: PERFORM UNTIL CONTINUE-FLAG = 'NO' with EVALUATE USER-CHOICE
 */
class AccountApp {
  constructor(options = {}) {
    const initialBalance = parseFloat(options.initialBalance) || 1000.00;
    this.dataStore = new DataStore(initialBalance);
    this.operations = new Operations(this.dataStore);
    this.input = options.input || process.stdin;
    this.output = options.output || process.stdout;
  }

  displayMenu() {
    this.output.write('--------------------------------\n');
    this.output.write('Account Management System\n');
    this.output.write('1. View Balance\n');
    this.output.write('2. Credit Account\n');
    this.output.write('3. Debit Account\n');
    this.output.write('4. Exit\n');
    this.output.write('--------------------------------\n');
  }

  async run() {
    const rl = readline.createInterface({
      input: this.input,
      output: this.output,
      terminal: false
    });

    const lines = [];
    let lineResolve = null;

    rl.on('line', (line) => {
      if (lineResolve) {
        const resolve = lineResolve;
        lineResolve = null;
        resolve(line);
      } else {
        lines.push(line);
      }
    });

    const getLine = (prompt) => {
      this.output.write(prompt);
      return new Promise((resolve) => {
        if (lines.length > 0) {
          resolve(lines.shift());
        } else {
          lineResolve = resolve;
        }
      });
    };

    let continueFlag = true;

    while (continueFlag) {
      this.displayMenu();
      const choice = await getLine('Enter your choice (1-4): ');

      switch (choice.trim()) {
      case '1': {
        const result = this.operations.viewBalance();
        this.output.write(result.message + '\n');
        break;
      }
      case '2': {
        const amount = await getLine('Enter credit amount: ');
        const result = this.operations.credit(amount);
        this.output.write(result.message + '\n');
        break;
      }
      case '3': {
        const amount = await getLine('Enter debit amount: ');
        const result = this.operations.debit(amount);
        this.output.write(result.message + '\n');
        break;
      }
      case '4':
        continueFlag = false;
        break;
      default:
        this.output.write('Invalid choice, please select 1-4.\n');
        break;
      }
    }

    this.output.write('Exiting the program. Goodbye!\n');
    rl.close();
  }
}

// Run the application when executed directly
if (require.main === module) {
  const app = new AccountApp({
    initialBalance: process.env.INITIAL_BALANCE || 1000.00
  });
  app.run().catch((err) => {
    console.error('Application error:', err);
    process.exit(1);
  });
}

module.exports = AccountApp;
