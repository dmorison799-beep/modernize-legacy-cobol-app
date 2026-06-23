'use strict';

/**
 * DataStore - Maps from data.cob (DataProgram)
 *
 * Provides in-memory storage for the account balance.
 * COBOL equivalent: READ/WRITE operations on STORAGE-BALANCE.
 */
class DataStore {
  constructor(initialBalance = 1000.00) {
    this._balance = initialBalance;
  }

  read() {
    return this._balance;
  }

  write(newBalance) {
    this._balance = newBalance;
  }
}

module.exports = DataStore;
