'use strict';

/**
 * Operations module - Business logic for the Account Management System.
 *
 * Equivalent to operations.cob: handles credit, debit, and view balance
 * operations. Uses the data module for reading/writing the stored balance.
 *
 * COBOL field: AMOUNT PIC 9(6)V99 — amounts are fixed-point with 2 decimals.
 * We replicate this by rounding to 2 decimal places in all calculations.
 */

const data = require('./data');

/**
 * View the current account balance.
 * @returns {{ balance: number, message: string }}
 */
function viewBalance() {
  const balance = data.readBalance();
  const message = `Current balance: ${balance.toFixed(2)}`;
  return { balance, message };
}

/**
 * Credit (add funds to) the account.
 * @param {number} amount - The amount to credit.
 * @returns {{ balance: number, message: string }}
 */
function creditAccount(amount) {
  const creditAmount = Math.round(amount * 100) / 100;
  let balance = data.readBalance();
  balance = Math.round((balance + creditAmount) * 100) / 100;
  data.writeBalance(balance);
  const message = `Amount credited. New balance: ${balance.toFixed(2)}`;
  return { balance, message };
}

/**
 * Debit (withdraw funds from) the account.
 * @param {number} amount - The amount to debit.
 * @returns {{ success: boolean, balance: number, message: string }}
 */
function debitAccount(amount) {
  const debitAmount = Math.round(amount * 100) / 100;
  let balance = data.readBalance();

  if (balance >= debitAmount) {
    balance = Math.round((balance - debitAmount) * 100) / 100;
    data.writeBalance(balance);
    const message = `Amount debited. New balance: ${balance.toFixed(2)}`;
    return { success: true, balance, message };
  }

  return {
    success: false,
    balance,
    message: 'Insufficient funds for this debit.',
  };
}

module.exports = {
  viewBalance,
  creditAccount,
  debitAccount,
};
