class Timer {
    constructor(showHours) {
        this._showHours = showHours;
        this._timerTimeout = undefined;
        this._timeLeft = 0;
        this.value = showHours ? "00:00:00" : "00:00";
    }

    get timeLeft() {
        return this._timeLeft;
    }

    set timeLeft(value) {
        if (this._timeLeft < 1 || value < 1) {
            clearTimeout(this._timerTimeout);
        }

        this._timeLeft = Math.floor(value);
    }

    update() {
        if (this._timeLeft < 0) {
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
            this._timeLeft--;
            this.update();
        }, 1000);
    }
};

export default Timer;