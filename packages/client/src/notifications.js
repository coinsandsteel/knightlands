export default class Notifications {
  constructor(store) {
    this.store = store;
  }

  async init() {
    await this.updateDailyLogin();
    await this.updateAdventures();
    await this.updateSummon();
    await this.updateTraining();
  }

  async updateAdventures() {
    await this.store.dispatch("adventures/update");
  }

  async updateDailyLogin() {
    await this.store.dispatch("dailyLogin/update");
  }

  async updateSummon() {
    await this.store.dispatch("summon/update");
  }

  async updateTraining() {
    await this.store.dispatch("training/update");
  }
}
