'use strict';

const readline = require('readline');
const { DataStore } = require('./data');
const { Operations } = require('./operations');

/**
 * AccountApp — interactive CLI for the Account Management System.
 * Maps to main.cob (MainProgram) which displays a menu,
 * accepts USER-CHOICE, and dispatches via EVALUATE / CALL.
 */
class AccountApp {
  constructor(input = process.stdin, output = process.stdout) {
    this.dataStore = new DataStore();
    this.operations = new Operations(this.dataStore);
    this.input = input;
    this.output = output;
  }

  ask(rl, question) {
    return new Promise((resolve) => {
      rl.question(question, (answer) => resolve(answer));
    });
  }

  async run() {
    const rl = readline.createInterface({
      input: this.input,
      output: this.output
    });

    let continueFlag = true;

    while (continueFlag) {
      this.output.write('--------------------------------\n');
      this.output.write('Account Management System\n');
      this.output.write('1. View Balance\n');
      this.output.write('2. Credit Account\n');
      this.output.write('3. Debit Account\n');
      this.output.write('4. Exit\n');
      this.output.write('--------------------------------\n');

      const choice = await this.ask(rl, 'Enter your choice (1-4): ');

      switch (choice.trim()) {
        case '1': {
          const result = this.operations.viewBalance();
          this.output.write(result.message + '\n');
          break;
        }
        case '2': {
          const amount = await this.ask(rl, 'Enter credit amount: ');
          const result = this.operations.credit(parseFloat(amount));
          this.output.write(result.message + '\n');
          break;
        }
        case '3': {
          const amount = await this.ask(rl, 'Enter debit amount: ');
          const result = this.operations.debit(parseFloat(amount));
          this.output.write(result.message + '\n');
          break;
        }
        case '4':
          continueFlag = false;
          break;
        default:
          this.output.write('Invalid choice, please select 1-4.\n');
      }
    }

    this.output.write('Exiting the program. Goodbye!\n');
    rl.close();
  }
}

/* istanbul ignore next */
if (require.main === module) {
  const app = new AccountApp();
  app.run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { AccountApp };
