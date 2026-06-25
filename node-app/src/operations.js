'use strict';

const data = require('./data');

function getBalance() {
  return data.read();
}

function credit(amount) {
  const currentBalance = data.read();
  const newBalance = parseFloat((currentBalance + amount).toFixed(2));
  data.write(newBalance);
  return { balance: newBalance };
}

function debit(amount) {
  const currentBalance = data.read();
  if (currentBalance >= amount) {
    const newBalance = parseFloat((currentBalance - amount).toFixed(2));
    data.write(newBalance);
    return { success: true, balance: newBalance };
  }
  return { success: false, balance: currentBalance, message: 'Insufficient funds for this debit.' };
}

module.exports = { getBalance, credit, debit };
