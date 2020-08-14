export function toDecimal(num, decimals) {
    const str = num.toString();
    let decimal = "0";
    if (str != "0") {
        decimal = str.slice(0, str.length-decimals) + "." + str.slice(str.length-decimals);
    }
    return Number(decimal);
}

export function toBigNumber(num, decimals) {
    return Math.floor(Math.pow(10, decimals) * num);
}
