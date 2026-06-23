'use strict';

/**
 * Operations - Equivalent of COBOL Operations program (operations.cob)
 *
 * Handles business logic: credit, debit, and view-balance.
 * Each method follows the COBOL read-modify-write pattern through DataStore.
 *
 * COBOL mapping:
 *   CALL 'Operations' USING 'TOTAL '  ->  operations.viewBalance()
 *   CALL 'Operations' USING 'CREDIT'  ->  operations.credit(amount)
 *   CALL 'Operations' USING 'DEBIT '  ->  operations.debit(amount)
 */
class Operations {
  constructor(dataStore) {
    this.dataStore = dataStore;
  }

  viewBalance() {
    const balance = this.dataStore.read();
    return {
      success: true,
      balance: balance,
      message: `Current balance: ${balance.toFixed(2)}`
    };
  }

  credit(amount) {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      return {
        success: false,
        balance: this.dataStore.read(),
        message: 'Invalid credit amount.'
      };
    }

    const currentBalance = this.dataStore.read();
    const newBalance = currentBalance + parsedAmount;
    this.dataStore.write(newBalance);

    return {
      success: true,
      balance: newBalance,
      message: `Amount credited. New balance: ${newBalance.toFixed(2)}`
    };
  }

  debit(amount) {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      return {
        success: false,
        balance: this.dataStore.read(),
        message: 'Invalid debit amount.'
      };
    }

    const currentBalance = this.dataStore.read();

    if (currentBalance >= parsedAmount) {
      const newBalance = currentBalance - parsedAmount;
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
