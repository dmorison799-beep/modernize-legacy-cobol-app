'use strict';

/**
 * AccountApp - Equivalent of COBOL MainProgram (main.cob)
 *
 * Provides the interactive CLI menu loop.
 *
 * COBOL mapping:
 *   PERFORM UNTIL CONTINUE-FLAG = 'NO'  ->  while (this.continueFlag)
 *   EVALUATE USER-CHOICE                ->  switch (choice)
 *   DISPLAY / ACCEPT                    ->  console.log / readline
 */
const readline = require('readline');
const DataStore = require('./data');
const Operations = require('./operations');

class AccountApp {
  constructor(options = {}) {
    const initialBalance = options.initialBalance != null
      ? parseFloat(options.initialBalance)
      : 1000.00;

    this.dataStore = new DataStore(initialBalance);
    this.operations = new Operations(this.dataStore);
    this.continueFlag = true;
    this.input = options.input || process.stdin;
    this.output = options.output || process.stdout;
  }

  ask(rl, question) {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  async run() {
    const rl = readline.createInterface({
      input: this.input,
      output: this.output
    });

    while (this.continueFlag) {
      this.output.write('--------------------------------\n');
      this.output.write('Account Management System\n');
      this.output.write('1. View Balance\n');
      this.output.write('2. Credit Account\n');
      this.output.write('3. Debit Account\n');
      this.output.write('4. Exit\n');
      this.output.write('--------------------------------\n');

      const choice = await this.ask(rl, 'Enter your choice (1-4): ');

      switch (choice) {
      case '1': {
        const result = this.operations.viewBalance();
        this.output.write(result.message + '\n');
        break;
      }
      case '2': {
        const amountStr = await this.ask(rl, 'Enter credit amount: ');
        const result = this.operations.credit(amountStr);
        this.output.write(result.message + '\n');
        break;
      }
      case '3': {
        const amountStr = await this.ask(rl, 'Enter debit amount: ');
        const result = this.operations.debit(amountStr);
        this.output.write(result.message + '\n');
        break;
      }
      case '4':
        this.continueFlag = false;
        break;
      default:
        this.output.write('Invalid choice, please select 1-4.\n');
      }
    }

    this.output.write('Exiting the program. Goodbye!\n');
    rl.close();
  }
}

// Run if invoked directly
if (require.main === module) {
  const app = new AccountApp({
    initialBalance: process.env.INITIAL_BALANCE
  });
  app.run().catch((err) => {
    console.error('Application error:', err);
    process.exit(1);
  });
}

module.exports = AccountApp;
