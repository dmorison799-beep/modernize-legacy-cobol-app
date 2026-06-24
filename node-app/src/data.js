'use strict';

const INITIAL_BALANCE = 1000.00;

/**
 * DataStore — in-memory persistence layer.
 * Maps to data.cob (DataProgram) which stores STORAGE-BALANCE
 * and exposes READ / WRITE operations via the LINKAGE SECTION.
 */
class DataStore {
  constructor(initialBalance = INITIAL_BALANCE) {
    this._balance = initialBalance;
  }

  read() {
    return this._balance;
  }

  write(balance) {
    this._balance = balance;
  }
}

module.exports = { DataStore, INITIAL_BALANCE };
