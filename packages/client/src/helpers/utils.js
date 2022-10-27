import moment from "moment";

export function capitalize(str) {
  if (typeof string === "string" && str.length > 0) {
    return str[0].toUpperCase() + str.slice(1);
  }

  return str;
}

export function getLanternIcon(num) {
  return "basic_lantern" + ((num % 4) + 1);
}

export function sleep(millisecond = 1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, millisecond);
  });
}

export function hasClass(el, className) {
  if (el.classList) {
    return el.classList.contains(className);
  } else {
    return el.className.split(" ").includes(className);
  }
}

export function addClass(el, className) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    el.className += " " + className;
  }
}

export function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(
      new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"),
      " "
    );
  }
}

export function getCurrentDateString() {
  const date = moment.utc().format("DD/MM/YYYY");
  return date;
}
