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
  return decimal.replace(/(\.[0-9]*[1-9])0+$|\.0*$/, "$1") || "0";
}

export function toBigNumber(num, decimals) {
  let str = num.toString();
  const parts = str.split(".");
  let base = parts[0].length;
  if (parts.length == 2) {
    str = str.replace(".", "");

    if (parts[0] == "0") {
      str = str.substr(1);
      const b = str.length;
      str = str.replace(/^0+/, "");
      base = str.length - b;
    }
  }

  return str.padEnd(decimals + base, "0");
}
