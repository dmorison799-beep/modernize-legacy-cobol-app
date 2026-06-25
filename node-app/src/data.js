'use strict';

const DEFAULT_BALANCE = 1000.00;

let storageBalance = DEFAULT_BALANCE;

function read() {
  return storageBalance;
}

function write(balance) {
  storageBalance = balance;
}

function reset() {
  storageBalance = DEFAULT_BALANCE;
}

module.exports = { read, write, reset, DEFAULT_BALANCE };
