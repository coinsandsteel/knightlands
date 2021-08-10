export class WalletLockedError extends Error {
  constructor(message) {
    super(message);
    this.name = "WalletLockedError";
    this.message = message;
  }
}

export class IncorrectNetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = "IncorrectNetworkError";
    this.message = message;
  }
}
