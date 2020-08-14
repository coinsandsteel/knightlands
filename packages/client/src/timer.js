import EventEmitter from "events";

class Timer extends EventEmitter {
    constructor(showHours) {
        super();

        this._showHours = showHours;
        this._timerTimeout = undefined;
        this._timeLeft = 0;
        this.value = showHours ? "00:00:00" : "00:00";
        this._lastUpdate = new Date().getTime();
    }

    get timeLeft() {
        return this._timeLeft;
    }

    set timeLeft(value) {
        if (this._timeLeft < 1 || value < 1) {
            this.stop();
        }

        this._timeLeft = Math.floor(value);
        if (this._timeLeft > 0 && !this._timerTimeout) {
            this._update();
        }
    }

    stop() {
        clearTimeout(this._timerTimeout);
        this._timerTimeout = null;
    }

    update(force) {
        if (!force && this._timerTimeout) {
            return;
        }

        if (force) {
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

        let timeLeft = this._timeLeft;
        let minutes = Math.floor(timeLeft / 60);
        let hours = Math.floor(minutes / 60);
        minutes -= hours * 60;
        let seconds = Math.floor(timeLeft % 60);

        let hoursValue = this._showHours ? `${hours > 9 ? "" : 0}${hours}:` : "";

        this.value = `${hoursValue}${
            minutes > 9 ? "" : 0
            }${minutes}:${seconds > 9 ? "" : 0}${seconds}`;

        this._timerTimeout = setTimeout(() => {
            let now = new Date().getTime();
            let timeElapsed = Math.round((now - this._lastUpdate) / 1000);
            this._timeLeft -= timeElapsed;
            this._update();
            this._lastUpdate = now;
        }, 1000);
    }
};

export default Timer;