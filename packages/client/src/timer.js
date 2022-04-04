import EventEmitter from "events";

class Timer extends EventEmitter {
  constructor(showHours, showDays) {
    super();

    this._showHours = showHours;
    this._showDays = showDays;
    this._timerTimeout = undefined;
    this._timeLeft = 0;
    this.value = showHours ? "00:00:00" : "00:00";
    this._lastUpdate = new Date().getTime();
  }

  get timeLeft() {
    return this._timeLeft;
  }

  set timeLeft(value) {
    this._lastUpdate = new Date().getTime();

    if (this._timeLeft < 1 || value < 1) {
      this.stop();
    }

    this._timeLeft = Math.floor(value);
    if (this._timeLeft > 0) {
      this.update(true);
    }
  }

  destroy() {
    this.removeAllListeners("finished");
  }

  stop() {
    clearTimeout(this._timerTimeout);
    this._timerTimeout = null;
  }

  update(force) {
    if (!force && this._timerTimeout) {
      return;
    }

    if (force && this._timerTimeout) {
      clearTimeout(this._timerTimeout);
    }

    this._update();
  }

  _update() {
    if (this._timeLeft < 0) {
      this.emit("finished", this);
      this._timerTimeout = null;
      return;
    }

    let showHours = this._showHours;
    let showDays = this._showDays;
    let timeLeft = this._timeLeft;
    let minutes = Math.floor(timeLeft / 60);
    let hours = Math.floor(minutes / 60);
    minutes -= hours * 60;
    let seconds = Math.floor(timeLeft % 60);
    let days = 0;

    if (showDays && timeLeft >= 86400) {
      showHours = true;
      days = Math.floor(timeLeft / (60 * 60 * 24));
      hours = Math.floor((timeLeft % (60 * 60 * 24)) / (60 * 60));
    } else {
      showDays = false;
    }

    let hoursValue = showHours ? `${hours > 9 ? "" : 0}${hours}:` : "";
    let daysValue = showDays ? `${days} ${days > 1 ? "days" : "day"} ` : "";

    this.value = `${daysValue}${hoursValue}${minutes > 9 ? "" : 0}${minutes}:${
      seconds > 9 ? "" : 0
    }${seconds}`;

    this._timerTimeout = setTimeout(() => {
      let now = new Date().getTime();
      let timeElapsed = Math.round((now - this._lastUpdate) / 1000);
      this._timeLeft -= timeElapsed;
      this._update();
      this._lastUpdate = now;
    }, 1000);
  }
}

export default Timer;
