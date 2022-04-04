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
