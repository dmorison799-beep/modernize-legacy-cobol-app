'use strict';

/**
 * DataStore - Equivalent of COBOL DataProgram (data.cob)
 *
 * Manages in-memory balance storage with READ/WRITE operations,
 * mirroring the COBOL PASSED-OPERATION + BALANCE interface.
 *
 * COBOL mapping:
 *   STORAGE-BALANCE PIC 9(6)V99 VALUE 1000.00  ->  this.balance = initialBalance
 *   CALL 'DataProgram' USING 'READ', BALANCE   ->  dataStore.read()
 *   CALL 'DataProgram' USING 'WRITE', BALANCE  ->  dataStore.write(balance)
 */
class DataStore {
  constructor(initialBalance = 1000.00) {
    this.balance = initialBalance;
  }

  read() {
    return this.balance;
  }

  write(newBalance) {
    this.balance = newBalance;
  }

  reset(balance = 1000.00) {
    this.balance = balance;
  }
}

module.exports = DataStore;
