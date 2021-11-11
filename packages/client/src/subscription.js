import Meta from "./subscriptions.json";

export default class Subscription {
  constructor(game, data) {
    this._game = game;
    this._data = data;
  }

  hasSubscription(id) {
    return !!this._data.cards[id];
  }

  get cardBonuses() {
    const bonuses = {
      soft: 0,
      dkt: 0,
      exp: 0,
      fastQuests: false
    };

    for (const id in this._data.cards) {
      const card = this._data.cards[id];
      if (card.end < this._game.nowSec) {
        continue;
      }

      const meta = Meta.cards.find(c => c.id == id);

      bonuses.dkt += meta.addDkt;
      bonuses.soft += meta.addGold;
      bonuses.exp += meta.addExp;
      bonuses.fastQuests |= meta.fastQuests;
    }

    return bonuses;
  }
}
