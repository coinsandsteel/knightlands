export function toDecimal(num, decimals) {
  let str = num.toString();
  let decimal = "";
  if (str != "0") {
    if (str.length < decimals) {
      str = str.padStart(decimals, "0");
      decimal = "0." + str.slice(0, str.length);
    } else {
      decimal =
        str.slice(0, str.length - decimals) +
        "." +
        str.slice(str.length - decimals);
    }
  }
  return decimal.replace(/(\.[0-9]*[1-9])0+$|\.0*$/, "$1");
}

export function toBigNumber(num, decimals) {
  return Math.floor(Math.pow(10, decimals) * num);
}
