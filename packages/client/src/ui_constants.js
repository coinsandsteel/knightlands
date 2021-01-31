export default {
  progressThresholds: [
    {
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
  offsetTo(el, container) {
    // let elem = el;
    // let offsetX = 0,
    //   offsetY = 0;
    // while (elem.offsetParent != null && elem.offsetParent != container) {
    //   offsetY += elem.offsetTop;
    //   offsetX += elem.offsetLeft;
    //   console.log(offsetY, offsetY);
    //   elem = elem.offsetParent;
    // }

    // // offsetY += elem.offsetTop;
    // // offsetX += elem.offsetLeft;

    // const rect = el.getBoundingClientRect();
    // return {
    //   top: offsetY,
    //   left: offsetX,
    //   width: rect.width,
    //   height: rect.height
    // };

    let absoluteEl = this.offsetAbsolute(el);
    let abosluteContainer = this.offsetAbsolute(container);

    return {
      top: absoluteEl.top - abosluteContainer.top,
      left: absoluteEl.left - abosluteContainer.left,
      width: absoluteEl.width,
      height: absoluteEl.height
    };
  },
  offsetAbsolute(el) {
    var rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
      width: rect.width,
      height: rect.height
    };
  },
  offset(el) {
    var rect = el.getBoundingClientRect();
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: rect.width,
      height: rect.height
    };
  }
};
