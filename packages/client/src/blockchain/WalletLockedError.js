export default class WalletLockedError extends Error  {
    constructor(message) {
        super(message);
        this.name = 'WalletLockedError';
        this.message = message;
      }
}