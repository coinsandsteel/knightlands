export function toDecimal(num, decimals) {
  const str = num.toString().padStart(decimals, "0");
  let decimal = "0";
  if (str != "0") {
    decimal =
      str.slice(0, str.length - decimals) +
      "." +
      str.slice(str.length - decimals);
  }
  if (decimal.match(/\./)) {
    decimal = decimal.replace(/\.?0+$/, "");
    decimal = "0" + decimal;
  }
  return decimal;
}

export function toBigNumber(num, decimals) {
  return Math.floor(Math.pow(10, decimals) * num);
}
