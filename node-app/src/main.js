'use strict';

const readline = require('readline');
const Operations = require('./operations');

/**
 * MainProgram - CLI interface for the Account Management System.
 * Mirrors the COBOL MainProgram (main.cob) which handles user interaction.
 */
class AccountApp {
  constructor(options = {}) {
    this.operations = options.operations || new Operations();
    this.input = options.input || process.stdin;
    this.output = options.output || process.stdout;
  }

  /**
   * Display the main menu.
   */
  displayMenu() {
    this.output.write('--------------------------------\n');
    this.output.write('Account Management System\n');
    this.output.write('1. View Balance\n');
    this.output.write('2. Credit Account\n');
    this.output.write('3. Debit Account\n');
    this.output.write('4. Exit\n');
    this.output.write('--------------------------------\n');
  }

  /**
   * Prompt the user for input.
   * @param {readline.Interface} rl - The readline interface.
   * @param {string} prompt - The prompt message.
   * @returns {Promise<string>}
   */
  ask(rl, prompt) {
    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  /**
   * Run the main application loop.
   */
  async run() {
    const rl = readline.createInterface({
      input: this.input,
      output: this.output
    });

    let continueFlag = true;

    while (continueFlag) {
      this.displayMenu();
      const choice = await this.ask(rl, 'Enter your choice (1-4): ');

      switch (choice) {
        case '1': {
          const result = this.operations.viewBalance();
          this.output.write(result.message + '\n');
          break;
        }
        case '2': {
          const amountStr = await this.ask(rl, 'Enter credit amount: ');
          const amount = parseFloat(amountStr);
          if (isNaN(amount) || amount < 0) {
            this.output.write('Invalid amount.\n');
          } else {
            const result = this.operations.credit(amount);
            this.output.write(result.message + '\n');
          }
          break;
        }
        case '3': {
          const amountStr = await this.ask(rl, 'Enter debit amount: ');
          const amount = parseFloat(amountStr);
          if (isNaN(amount) || amount < 0) {
            this.output.write('Invalid amount.\n');
          } else {
            const result = this.operations.debit(amount);
            this.output.write(result.message + '\n');
          }
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

// Run the application if executed directly
if (require.main === module) {
  const app = new AccountApp();
  app.run().catch((err) => {
    console.error('Application error:', err);
    process.exit(1);
  });
}

module.exports = AccountApp;
