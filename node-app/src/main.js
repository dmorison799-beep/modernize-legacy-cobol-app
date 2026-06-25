'use strict';

const readline = require('readline');
const operations = require('./operations');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function displayMenu() {
  console.log('--------------------------------');
  console.log('Account Management System');
  console.log('1. View Balance');
  console.log('2. Credit Account');
  console.log('3. Debit Account');
  console.log('4. Exit');
  console.log('--------------------------------');
}

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function handleViewBalance() {
  const balance = operations.getBalance();
  console.log(`Current balance: ${balance.toFixed(2)}`);
}

async function handleCredit() {
  const input = await prompt('Enter credit amount: ');
  const amount = parseFloat(input);
  if (isNaN(amount) || amount < 0) {
    console.log('Invalid amount. Please enter a valid number.');
    return;
  }
  const result = operations.credit(amount);
  console.log(`Amount credited. New balance: ${result.balance.toFixed(2)}`);
}

async function handleDebit() {
  const input = await prompt('Enter debit amount: ');
  const amount = parseFloat(input);
  if (isNaN(amount) || amount < 0) {
    console.log('Invalid amount. Please enter a valid number.');
    return;
  }
  const result = operations.debit(amount);
  if (result.success) {
    console.log(`Amount debited. New balance: ${result.balance.toFixed(2)}`);
  } else {
    console.log(result.message);
  }
}

async function main() {
  let running = true;

  while (running) {
    displayMenu();
    const choice = await prompt('Enter your choice (1-4): ');

    switch (choice.trim()) {
    case '1':
      await handleViewBalance();
      break;
    case '2':
      await handleCredit();
      break;
    case '3':
      await handleDebit();
      break;
    case '4':
      running = false;
      console.log('Exiting the program. Goodbye!');
      break;
    default:
      console.log('Invalid choice, please select 1-4.');
      break;
    }
  }

  rl.close();
}

if (require.main === module) {
  main();
}

module.exports = { main, handleViewBalance, handleCredit, handleDebit, displayMenu };
