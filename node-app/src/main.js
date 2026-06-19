'use strict';

/**
 * Main Program - Entry point for the Account Management System.
 *
 * Equivalent to main.cob: displays a menu, reads user input, and delegates
 * to the operations module. The loop continues until the user selects Exit.
 */

const readlineSync = require('readline-sync');
const operations = require('./operations');

function displayMenu() {
  console.log('--------------------------------');
  console.log('Account Management System');
  console.log('1. View Balance');
  console.log('2. Credit Account');
  console.log('3. Debit Account');
  console.log('4. Exit');
  console.log('--------------------------------');
}

function run() {
  let continueFlag = true;

  while (continueFlag) {
    displayMenu();
    const choice = readlineSync.question('Enter your choice (1-4): ');

    switch (choice) {
      case '1': {
        const result = operations.viewBalance();
        console.log(result.message);
        break;
      }
      case '2': {
        const amountStr = readlineSync.question('Enter credit amount: ');
        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount < 0) {
          console.log('Invalid amount. Please enter a positive number.');
        } else {
          const result = operations.creditAccount(amount);
          console.log(result.message);
        }
        break;
      }
      case '3': {
        const amountStr = readlineSync.question('Enter debit amount: ');
        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount < 0) {
          console.log('Invalid amount. Please enter a positive number.');
        } else {
          const result = operations.debitAccount(amount);
          console.log(result.message);
        }
        break;
      }
      case '4':
        continueFlag = false;
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
    }
  }

  console.log('Exiting the program. Goodbye!');
}

if (require.main === module) {
  run();
}

module.exports = { run, displayMenu };
