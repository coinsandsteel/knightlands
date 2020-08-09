export default {
    progressThresholds: [{
        value: 0.35,
        type: "red"
    },
    {
        value: 0.75,
        type: "yellow"
    },
    {
        value: 1,
        type: "green"
    }
    ],
    stageNames: ["normal", "hard", "rutheless", "torment"],
    backgroundImage(image) {
        return `background-image: url("${image}");`;
    },
    offset(el) {
        var rect = el.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    }
}
