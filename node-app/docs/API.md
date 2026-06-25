# API Reference

## Module: `data.js`

In-memory data persistence layer. Manages the account balance storage.

### `read() -> number`
Returns the current stored balance.

```javascript
const data = require('./data');
const balance = data.read(); // 1000.00
```

### `write(balance: number) -> void`
Stores a new balance value.

```javascript
data.write(1500.00);
```

### `reset() -> void`
Resets the balance to the default value (1000.00).

```javascript
data.reset();
```

### `DEFAULT_BALANCE: number`
The default starting balance constant. Value: `1000.00`.

---

## Module: `operations.js`

Business logic for account operations. Depends on `data.js` for persistence.

### `getBalance() -> number`
Returns the current account balance.

```javascript
const ops = require('./operations');
const balance = ops.getBalance(); // 1000.00
```

### `credit(amount: number) -> { balance: number }`
Credits the account by the specified amount and returns the new balance.

```javascript
const result = ops.credit(100.00);
// result: { balance: 1100.00 }
```

### `debit(amount: number) -> { success: boolean, balance: number, message?: string }`
Debits the account by the specified amount. Returns success status and balance.

If sufficient funds:
```javascript
const result = ops.debit(50.00);
// result: { success: true, balance: 950.00 }
```

If insufficient funds:
```javascript
const result = ops.debit(2000.00);
// result: { success: false, balance: 1000.00, message: 'Insufficient funds for this debit.' }
```

---

## Module: `main.js`

CLI entry point. Provides the interactive menu using Node.js `readline`.

### `main() -> Promise<void>`
Starts the interactive menu loop. Only runs when executed directly (`node src/main.js`).

### `displayMenu() -> void`
Prints the menu options to stdout.

### `handleViewBalance() -> Promise<void>`
Displays the current balance.

### `handleCredit() -> Promise<void>`
Prompts for an amount and credits the account.

### `handleDebit() -> Promise<void>`
Prompts for an amount and debits the account (with insufficient funds check).
