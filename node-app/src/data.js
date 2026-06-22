'use strict';

/**
 * DataProgram - In-memory data store for account balance.
 * Mirrors the COBOL DataProgram (data.cob) which manages STORAGE-BALANCE.
 */
class DataStore {
  constructor(initialBalance = 1000.00) {
    this._balance = initialBalance;
  }

  /**
   * Read the current balance.
   * @returns {number} The current stored balance.
   */
  read() {
    return this._balance;
  }

  /**
   * Write (update) the stored balance.
   * @param {number} newBalance - The new balance to store.
   */
  write(newBalance) {
    this._balance = newBalance;
  }
}

module.exports = DataStore;
