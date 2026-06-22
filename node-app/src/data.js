'use strict';

/**
 * DataProgram - Data storage module for the Account Management System.
 *
 * Equivalent to data.cob: manages persistent storage of the account balance.
 * In the COBOL version, STORAGE-BALANCE is held in working storage with an
 * initial value of 1000.00. This module replicates that behavior using an
 * in-memory variable with the same initial value.
 *
 * Supports READ and WRITE operations on the balance.
 */

const INITIAL_BALANCE = 1000.00;

let storageBalance = INITIAL_BALANCE;

/**
 * Read the current stored balance.
 * @returns {number} The current balance.
 */
function readBalance() {
  return storageBalance;
}

/**
 * Write a new balance value to storage.
 * @param {number} balance - The new balance to persist.
 */
function writeBalance(balance) {
  storageBalance = balance;
}

/**
 * Reset balance to initial value (useful for testing).
 */
function resetBalance() {
  storageBalance = INITIAL_BALANCE;
}

module.exports = {
  INITIAL_BALANCE,
  readBalance,
  writeBalance,
  resetBalance,
};
