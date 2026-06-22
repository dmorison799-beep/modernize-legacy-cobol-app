'use strict';

const DataStore = require('./data');

/**
 * Operations - Business logic for account management.
 * Mirrors the COBOL Operations program (operations.cob).
 * Handles credit, debit, and balance view operations.
 */
class Operations {
  constructor(dataStore) {
    this.dataStore = dataStore || new DataStore();
  }

  /**
   * View the current account balance.
   * @returns {{ balance: number, message: string }}
   */
  viewBalance() {
    const balance = this.dataStore.read();
    return {
      balance,
      message: `Current balance: ${balance.toFixed(2)}`
    };
  }

  /**
   * Credit (add to) the account.
   * @param {number} amount - The amount to credit.
   * @returns {{ balance: number, message: string }}
   */
  credit(amount) {
    const currentBalance = this.dataStore.read();
    const newBalance = currentBalance + amount;
    this.dataStore.write(newBalance);
    return {
      balance: newBalance,
      message: `Amount credited. New balance: ${newBalance.toFixed(2)}`
    };
  }

  /**
   * Debit (subtract from) the account.
   * @param {number} amount - The amount to debit.
   * @returns {{ success: boolean, balance: number, message: string }}
   */
  debit(amount) {
    const currentBalance = this.dataStore.read();
    if (currentBalance >= amount) {
      const newBalance = currentBalance - amount;
      this.dataStore.write(newBalance);
      return {
        success: true,
        balance: newBalance,
        message: `Amount debited. New balance: ${newBalance.toFixed(2)}`
      };
    } else {
      return {
        success: false,
        balance: currentBalance,
        message: 'Insufficient funds for this debit.'
      };
    }
  }
}

module.exports = Operations;
