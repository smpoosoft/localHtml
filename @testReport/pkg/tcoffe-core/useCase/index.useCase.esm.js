const getUseCase = (description, actualValCreator, expectVal, assertUse = "equal", ...param) => {
  return {
    description,
    actualValCreator,
    expectVal,
    assertUse,
    param
  };
};

const getByPathDemo = {
  name: {
    code: {
      type: {
        amount: 200,
        count: 100
      }
    }
  }
};

function tCheckType(val) {
  return `${Object.prototype.toString.call(val).replace(/\[object\s|\]/g, "").toLowerCase()}`;
}

const encode = (str) => str.split("").map((v) => v.charCodeAt(0));
const decode = (val, sep) => String.fromCharCode(...Array.isArray(val) ? val : val.split(sep || "-").map((v) => +v));

function left(valStr, len) {
  return valStr.slice(0, len);
}
function right(valStr, len) {
  return valStr.slice(-1 * len);
}
function mid(valStr, startIdx, len) {
  if (startIdx < 0 || len === 0)
    return "";
  if (len > 0) {
    return valStr.slice(startIdx, startIdx + len);
  } else {
    return left(valStr, startIdx).slice(-1 * len);
  }
}
function numberLike(valStr, typestr = "num10") {
  return typestr === "num10" && /^[0-9]*$/.test(valStr) || typestr === "num2" && /^[0-1]*$/.test(valStr) || typestr === "num8" && /^[0-7]*$/.test(valStr) || typestr === "num16" && /^[0-9a-fA-F]*$/.test(valStr) || typestr === "num26" && /^[a-zA-Z]*$/.test(valStr) || false;
}
function upFirst(valStr) {
  return valStr.replace(/^(\w)/, (a) => a.toUpperCase());
}
function cameCase(valStr, template = "lowerCame", linkSmybol = "-") {
  if (["lowerCame", "upperCame"].includes(template)) {
    const _arr = valStr.split(/(-|_|\s+)/).filter((v) => !/(-|_|\s+)/.test(v));
    if (template === "upperCame") {
      return _arr.map((v) => upFirst(v)).join("");
    } else {
      const [a, ...b] = _arr;
      return `${a}${b.map((v) => upFirst(v)).join("")}`;
    }
  } else {
    const _str_ = valStr.replace(/[A-Z]/g, (a, b) => {
      const _link_ = linkSmybol === "none" ? "" : b ? linkSmybol : "";
      return `${_link_}${a}`;
    });
    return template === "toLower" && _str_.toLowerCase() || template === "toUpper" && _str_.toUpperCase() || _str_;
  }
}
function toJson(valStr, toPlain = true) {
  const emptyObj = toPlain ? /* @__PURE__ */ Object.create(null) : {};
  try {
    if (!valStr)
      return emptyObj;
    const _obj_ = JSON.parse(valStr);
    if (toPlain)
      return _obj_;
    Object.entries(_obj_).forEach((v) => {
      const [a, b] = v;
      emptyObj[a] = b;
    });
    return emptyObj;
  } catch (err) {
    return emptyObj;
  }
}
function nick(valStr, template = "fromNick") {
  const splitSymbol = "-";
  if (template === "fromNick") {
    return decode(valStr, splitSymbol);
  } else {
    return encode(valStr).join(splitSymbol);
  }
}
function trimAll(valStr) {
  return valStr.replace(/\s+/g, "");
}

const KEEP_UNIT = ["\u4E07", "\u4EBF", "\u5146", "\u4EAC", "\u5793", "\u677C", "\u7A70", "\u6C9F", "\u6DA7", "\u6B63"];
const ALIAS_NUM = ["\u96F6", "\u58F9", "\u8D30", "\u53C1", "\u8086", "\u4F0D", "\u9646", "\u67D2", "\u634C", "\u7396"];
const ALIAS_UNIT = ["\u5143", "\u62FE", "\u4F70", "\u4EDF", "\u4E07", "\u62FE", "\u4F70", "\u4EDF", "\u4EBF", "\u62FE", "\u4F70", "\u4EDF", "\u5146", "\u62FE", "\u4F70", "\u4EDF", "\u4EAC", "\u62FE", "\u4F70", "\u4EDF", "\u5793", "\u62FE", "\u4F70", "\u4EDF", "\u677C", "\u62FE", "\u4F70", "\u4EDF", "\u7A70", "\u62FE", "\u4F70", "\u4EDF", "\u6C9F", "\u62FE", "\u4F70", "\u4EDF", "\u6DA7", "\u62FE", "\u4F70", "\u4EDF", "\u6B63", "\u62FE", "\u4F70", "\u4EDF"];
const SHORT_NUM_UNIT = {
  \u4E07: 4,
  \u5341\u4E07: 5,
  \u767E\u4E07: 6,
  \u5343\u4E07: 7,
  \u4EBF: 8,
  \u5341\u4EBF: 9,
  \u767E\u4EBF: 10,
  \u5343\u4EBF: 11,
  \u5146: 12,
  \u4EAC: 16
};
const LARG_SIZE_VAL = [Math.pow(2, 70), Math.pow(2, 80), Math.pow(2, 90)];
const getRoundNum = (val, digit = 2) => {
  return +Intl.NumberFormat("en-US", {
    maximumFractionDigits: digit
  }).format(val).replace(/,/g, "");
};
const numToCNY = function(val) {
  const ALIAS_FRA = ["\u89D2", "\u5206", "\u5398", "\u6BEB", "\u4E1D"];
  const [a, b] = `${val}`.split(".");
  if (a.length > ALIAS_UNIT.length)
    return "\u91D1\u989D\u8D85\u51FA\u6709\u6548\u8303\u56F4\uFF0C\u65E0\u6CD5\u663E\u793A\u5927\u5199";
  const _arr = [];
  const _arr2 = [];
  const _arrA = a.split("").reverse();
  _arrA.forEach((v, k) => {
    const u = ALIAS_UNIT[k];
    const numIntPart = `${ALIAS_NUM[+v]}${v !== "0" || KEEP_UNIT.includes(u) ? u : ""}`;
    _arr.push(numIntPart);
  });
  if (b && b.length) {
    const _arrB = b.split("").slice(0, ALIAS_FRA.length);
    const _arrFra = [];
    _arrB.forEach((v, k) => {
      _arrFra.push(`${ALIAS_NUM[+v]}${ALIAS_FRA[k]}`);
    });
    _arr2.push(_arrFra.join(""));
  } else {
    _arr2.push("\u6574");
  }
  return [_arr.reverse().join("").replace(new RegExp(KEEP_UNIT.map((v) => `(\u96F6+${v})`).join("|"), "g"), (a2) => {
    return a2.replace(/零+/g, "");
  }).replace(/零+/g, "\u96F6"), _arr2.join("")].join("");
};
const getMaxDigitLen = (...val) => {
  return Math.max(...val.map((v) => (`${v}`.split(".")[1] || "").length));
};
const transRadixFrom10 = (val, to) => {
  const newVal = +val;
  if (newVal) {
    return {
      val: Number(val).toString(to),
      type: typeof val === "number" ? "number" : "string"
    };
  } else {
    return {
      val: NaN,
      type: "string"
    };
  }
};
const sizeToByte = (originUnit) => {
  if (originUnit.toLowerCase() === "byte")
    return 1;
  const currUnit = originUnit.toUpperCase();
  const currPower = currUnit === "K" && 10 || currUnit === "M" && 20 || currUnit === "G" && 30 || currUnit === "T" && 40 || currUnit === "P" && 50 || currUnit === "E" && 60 || currUnit === "Z" && 70 || currUnit === "Y" && 80 || currUnit === "B" && 90 || 0;
  return Math.pow(2, currPower);
};
const getMatchUnit = (val) => {
  let currUnit = "Byte";
  if (val > 0) {
    currUnit = val < 1024 && "Byte" || val < 1048576 && "K" || val < 1073741824 && "M" || val < 1099511627776 && "G" || val < 1125899906842624 && "T" || val < 1152921504606847e3 && "P" || val < LARG_SIZE_VAL[0] && "E" || val < LARG_SIZE_VAL[1] && "Z" || val < LARG_SIZE_VAL[2] && "Y" || "B";
  }
  return currUnit;
};
const getSizeWithUnit = (val, unitFrom, unitTo, digitLen = 0, gapBy = " ") => {
  if (+val < 1 || !unitFrom)
    return `0${gapBy}Byte`;
  if (unitFrom === unitTo) {
    return `${getRoundNum(val, digitLen)}${gapBy}${unitFrom}`;
  }
  const valToByte = val * sizeToByte(unitFrom);
  const currUnitTo = unitTo || getMatchUnit(valToByte);
  return `${getRoundNum(valToByte / sizeToByte(currUnitTo), digitLen)}${gapBy}${currUnitTo}`;
};

function isInt(val) {
  const _val_ = +val;
  if (isNaN(_val_))
    return false;
  return _val_ % 1 === 0;
}
function formatNum(val, template = { asNumber: { thousandSeparator: true } }) {
  if (template.asNumber) {
    const tpl = template.asNumber;
    if (tpl.unit) {
      val = val / ((SHORT_NUM_UNIT[tpl.unit] || 0) * 1e3) || 1;
      const len = tpl.digitLen ?? 0;
      return `${getRoundNum(val, len)}${tpl.unit}`;
    } else if (tpl.thousandSeparator) {
      const currArr = toArr(val);
      const b = currArr[1].length;
      const len = b ? `${b}`.length : 0;
      return new Intl.NumberFormat("CN", { maximumFractionDigits: len }).format(val);
    } else {
      return `${val}`;
    }
  } else if (template.asCurrency) {
    const tpl = template.asCurrency;
    if (tpl?.amountInWord) {
      return numToCNY(val);
    } else {
      return new Intl.NumberFormat("CN", { style: "currency", currency: tpl.symbol, useGrouping: !tpl.unGroup }).format(val);
    }
  } else if (template.asTiemStamp) {
    if (val >= -2147483648 && val <= 2147483648) {
      return new Intl.DateTimeFormat("zh-Hans-CN", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        fractionalSecondDigits: 3,
        hour12: false,
        second: "numeric"
      }).format(val).replace(/\//g, "-");
    } else {
      return "1900-01-01 00.00.00.000";
    }
  } else if (template.asCmoputer) {
    const tpl = template.asCmoputer;
    return getSizeWithUnit(val, tpl.unitFrom, tpl.unitTo, tpl.digitLen, tpl.gapBy);
  } else {
    return `${val}`;
  }
}
function toArr(val) {
  const _arr = `${val}`.split(".");
  return [_arr[0], _arr[1] || "", _arr.length === 2];
}
function toRound(val, digit = 2, rule = "normal") {
  if (isInt(val))
    return val;
  if (rule === "bank") {
    return +val.toFixed(digit);
  } else if (rule === "forceCarry") {
    return (~val | 0) * -1;
  } else if (rule === "forceDrop") {
    return ~~val | 0;
  } else {
    return getRoundNum(val, digit);
  }
}
function isOdd(val) {
  return !!((val & 1) !== 0);
}
function funcAdd(...item) {
  if (item.length < 2)
    return item[0] || NaN;
  try {
    const _seed_ = getMaxDigitLen(...item);
    return item.reduce((pre, curr) => {
      return pre + +curr * _seed_;
    }, 0) / _seed_;
  } catch (err) {
    return NaN;
  }
}
function funcSub(...item) {
  if (item.length < 2)
    return item[0] || NaN;
  try {
    const _seed_ = getMaxDigitLen(...item);
    const [a, ...b] = item;
    return b.reduce((pre, curr) => {
      return pre - +curr * _seed_;
    }, +a * _seed_) / _seed_;
  } catch (err) {
    return NaN;
  }
}
function funcMult(...item) {
  if (item.length < 2)
    return item[0] || NaN;
  try {
    const _seed_ = getMaxDigitLen(...item);
    return item.reduce((pre, curr) => {
      return pre * +curr * _seed_;
    }, 1) / _seed_ ** item.length;
  } catch (err) {
    return NaN;
  }
}
function funcDiv(...item) {
  if (item.length < 2)
    return item[0] || NaN;
  try {
    const _seed_ = getMaxDigitLen(...item);
    const [a, ...b] = item;
    if (b.includes(0))
      return NaN;
    return b.reduce((pre, curr) => {
      return pre / (curr * _seed_);
    }, +a * _seed_);
  } catch (err) {
    return NaN;
  }
}
function convertRadix(val, from, to) {
  if (from === to) {
    return {
      val,
      type: typeof val === "number" ? "number" : "string"
    };
  }
  if (from === 10) {
    return transRadixFrom10(val, to);
  } else {
    const num10 = Number.parseInt(`${val}`, 2) || NaN;
    if (to === 10) {
      return {
        val: isNaN(num10) ? NaN : num10,
        type: "number"
      };
    } else {
      return transRadixFrom10(num10, to);
    }
  }
}

const getItemFromArr = (valArr, idxs, removeOrigin) => {
  const _arr = [];
  const newIdx = idxs.reverse();
  for (const v of newIdx) {
    if (removeOrigin) {
      _arr.push(valArr.splice(v, 1)[0]);
    } else {
      _arr.push(valArr[v]);
    }
  }
  return _arr.length > 1 ? _arr.reverse() : _arr;
};

function insertTo(valArr, destIndex, ...item) {
  if (destIndex > -1) {
    if (destIndex === 0) {
      valArr.unshift(...item);
    } else if (destIndex === valArr.length) {
      valArr.push(...item);
    } else {
      const lastPart = valArr.splice(destIndex);
      valArr.push(...item);
      valArr.push(...lastPart);
    }
  }
  return valArr;
}
function readFrom(valArr, fromIdx, len, removeOrigin) {
  if (Array.isArray(fromIdx)) {
    return getItemFromArr(valArr, fromIdx, removeOrigin);
  } else if (typeof fromIdx === "number" && len && len > 1) {
    const _arrIdx = [fromIdx];
    let lastIdx = valArr.length - 1;
    const newLen = fromIdx + len > lastIdx ? lastIdx - fromIdx : len;
    for (let i = 1; i < newLen; i++) {
      _arrIdx.push(fromIdx + i);
    }
    return getItemFromArr(valArr, _arrIdx, removeOrigin);
  } else {
    return [];
  }
}
function moveTo(valArr, fromIdx, destIdx, itemCount) {
  const _arrPop = readFrom(valArr, fromIdx, itemCount, true);
  insertTo(valArr, destIdx, ..._arrPop);
  return valArr;
}
function sortDefault(valArr, isDesc, orderKey) {
  if (!valArr.length)
    return valArr;
  const [a] = valArr;
  const _tp = typeof a;
  const _aIsStr = _tp === "string";
  if (_aIsStr) {
    return valArr.sort((a2, b) => isDesc ? b.localeCompare(a2) : a2.localeCompare(b));
  } else if (!Array.isArray(a) && _tp === "object") {
    if (!orderKey)
      return valArr;
    const [currA] = valArr;
    const _tpCurrA = typeof currA[orderKey];
    if (_tpCurrA === "object")
      return valArr;
    const isStrType = _tpCurrA === "string";
    return valArr.sort((a2, b) => {
      const objA = isDesc ? b : a2;
      const objB = isDesc ? a2 : b;
      const valA = objA[orderKey];
      const valB = objB[orderKey];
      if (isStrType) {
        return valA.localeCompare(valB);
      } else {
        return valA - valB;
      }
    });
  } else {
    return valArr.sort((a2, b) => isDesc ? b - a2 : a2 - b);
  }
}
function unDuplicate(valArr) {
  let failed = false;
  for (const v of valArr) {
    if (typeof v === "object") {
      failed = true;
      break;
    }
  }
  if (failed)
    throw new Error("\u6570\u7EC4\u5143\u7D20\u4E3A\u5BF9\u8C61\u7C7B\u578B\uFF0C\u53BB\u91CD\u5931\u8D25");
  return [...new Set(valArr)];
}
function toObj(valArr, style = "self") {
  let keyAble = ["number", "string"].includes(typeof valArr[0]);
  if (!keyAble || style === "itemAsValue") {
    return { ...valArr };
  } else {
    const _obj = /* @__PURE__ */ Object.create(null);
    valArr.forEach((v, k) => {
      _obj[v] = style === "self" ? v : k;
    });
    return _obj;
  }
}
function toTree(valArr, options) {
  console.log(valArr, options);
  return {};
}

function getByPath(valObj, keyPath) {
  if (!keyPath)
    return valObj;
  const _arrPath = Array.isArray(keyPath) ? keyPath : keyPath.replace(/(\.)|(,)/g, ".").split(".");
  if (!_arrPath.length)
    return valObj;
  let key = _arrPath.shift();
  if (key) {
    let _obj = valObj[key];
    for (const v of _arrPath) {
      _obj = _obj[v];
    }
    return _obj;
  } else {
    return valObj;
  }
}

const _strBrand = `32-32-32-32-32-32-95-95-95-32-32-32-32-32-32-32-32-32-32-32-95-95-95-32-32-32-32-32-32-32-32-32-32-32-95-95-95-32-32-32-32-
32-32-32-32-32-32-32-95-95-95-32-32-32-32-32-32-32-32-32-32-32-95-95-95-32-32-32-32-32-10-32-32-32-32-32-47-92-32-32-92-32-32-32-32-32-32-32-
32-32-47-92-95-95-92-32-32-32-32-32-32-32-32-32-47-92-32-32-92-32-32-32-32-32-32-32-32-32-47-92-32-32-92-32-32-32-32-32-32-32-32-32-47-92-32-32-
92-32-32-32-32-10-32-32-32-32-47-58-58-92-32-32-92-32-32-32-32-32-32-32-47-58-58-124-32-32-124-32-32-32-32-32-32-32-47-58-58-92-32-32-92-32-32-
32-32-32-32-32-47-58-58-92-32-32-92-32-32-32-32-32-32-32-47-58-58-92-32-32-92-32-32-32-10-32-32-32-47-58-47-92-32-92-32-32-92-32-32-32-32-32-
47-58-124-58-124-32-32-124-32-32-32-32-32-32-47-58-47-92-58-92-32-32-92-32-32-32-32-32-47-58-47-92-58-92-32-32-92-32-32-32-32-32-47-58-47-92-
58-92-32-32-92-32-32-10-32-32-95-92-58-92-45-92-32-92-32-32-92-32-32-32-47-58-47-124-58-124-95-95-124-95-95-32-32-32-47-58-58-92-45-92-58-92-
32-32-92-32-32-32-47-58-47-32-32-92-58-92-32-32-92-32-32-32-47-58-47-32-32-92-58-92-32-32-92-32-10-32-47-92-32-92-58-92-32-92-32-92-95-95-92-
32-47-58-47-32-124-58-58-58-58-92-95-95-92-32-47-58-47-92-58-92-32-92-58-92-95-95-92-32-47-58-47-95-95-47-32-92-58-92-95-95-92-32-47-58-47-
95-95-47-32-92-58-92-95-95-92-32-10-32-92-58-92-32-92-58-92-32-92-47-95-95-47-32-92-47-95-95-47-45-45-47-58-47-32-32-47-32-92-47-95-95-92-58-
92-47-58-47-32-32-47-32-92-58-92-32-32-92-32-47-58-47-32-32-47-32-92-58-92-32-32-92-32-47-58-47-32-32-47-32-10-32-32-92-58-92-32-92-58-92-95-
95-92-32-32-32-32-32-32-32-32-32-47-58-47-32-32-47-32-32-32-32-32-32-32-92-58-58-47-32-32-47-32-32-32-92-58-92-32-32-47-58-47-32-32-47-32-32-
32-92-58-92-32-32-47-58-47-32-32-47-32-10-32-32-32-92-58-92-47-58-47-32-32-47-32-32-32-32-32-32-32-32-47-58-47-32-32-47-32-32-32-32-32-32-32-
32-32-92-47-95-95-47-32-32-32-32-32-92-58-92-47-58-47-32-32-47-32-32-32-32-32-92-58-92-47-58-47-32-32-47-32-32-10-32-32-32-32-92-58-58-47-32-
32-47-32-32-32-32-32-32-32-32-47-58-47-32-32-47-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-92-58-58-47-32-32-47-32-32-32-
32-32-32-32-92-58-58-47-32-32-47-32-32-32-10-32-32-32-32-32-92-47-95-95-47-32-32-32-32-32-32-32-32-32-92-47-95-95-47-32-32-32-32-32-32-32-32-
32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-92-47-95-95-47-32-32-32-32-32-32-32-32-32-92-47-95-95-47-32-32-32-32-10-10-32-32-32-32-32-32-32-
32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-19978-28023-28145-26222-36719-20214-26377-38480-20844-21496-32-45-32-119-119-119-46-115-109-
112-111-111-46-99-111-109`;
encode(`${new Date().getFullYear() - 1}`).join("-");
const rowBrand1 = "37-99-32-116-70-114-97-109-101-32-37-99-32-86-49-48-32-37-99-32-19978-28023-28145-26222-36719-20214-26377-38480-20844-21496-32-80-111-119-101-114-32-98-121-32-116-67-111-102-102-101-32-101-110-103-105-110-46";
const rowBrand2 = "112-97-100-100-105-110-103-58-32-50-112-120-32-49-112-120-59-32-98-111-114-100-101-114-45-114-97-100-105-117-115-58-32-51-112-120-32-48-32-48-32-51-112-120-59-32-99-111-108-111-114-58-32-35-102-102-102-59-32-98-97-99-107-103-114-111-117-110-100-58-32-35-54-48-54-48-54-48-59-32-102-111-110-116-45-119-101-105-103-104-116-58-32-98-111-108-100-59";
const rowBrand3 = "112-97-100-100-105-110-103-58-32-50-112-120-32-49-112-120-59-32-98-111-114-100-101-114-45-114-97-100-105-117-115-58-32-48-32-51-112-120-32-51-112-120-32-48-59-32-99-111-108-111-114-58-32-35-102-102-102-59-32-98-97-99-107-103-114-111-117-110-100-58-32-111-114-97-110-103-101-59-32-102-111-110-116-45-119-101-105-103-104-116-58-32-98-111-108-100-59";
const rowBrand4 = "112-97-100-100-105-110-103-58-32-50-112-120-32-49-112-120-59-32-98-111-114-100-101-114-58-32-110-111-110-101-59-32-99-111-108-111-114-58-32-35-52-52-52-59-32-98-97-99-107-103-114-111-117-110-100-58-32-116-114-97-110-115-112-97-114-101-110-116-59-32-102-111-110-116-45-119-101-105-103-104-116-58-32-49-48-48-59";
decode(_strBrand);
[decode(rowBrand1), decode(rowBrand2), decode(rowBrand3), decode(rowBrand4)];

const isNum10 = (...val) => ({ result: !isNaN(+val) });
const hasSpace$1 = (str) => {
  const result = typeof str === "string" && /\s+/.test(`${str}`);
  return { result };
};
const hasSpecialSymbol = (str) => {
  const regStr = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~\uFF01@#\uFFE5\u2026\u2026&*\uFF08\uFF09\u2014\u2014|{}\u3010\u3011\u2018\uFF1B\uFF1A\u201D\u201C'\u3002\uFF0C\u3001\uFF1F]");
  const result = typeof str === "string" && regStr.test(`${str}`);
  return { result };
};
const stringLen = (str, len) => {
  const _currLen = `${str}`.length;
  const resObj = { result: true };
  let resMin = true;
  let resMax = true;
  if (typeof len.min !== "undefined") {
    resMin = !!(_currLen > len.min);
    resObj.detail = `\u5B57\u7B26\u4E32${str}\u7684\u957F\u5EA6${_currLen}${resMin ? "" : "\u4E0D"}\u7B26\u5408\u6700\u5C0F\u957F\u5EA6\u9650\u5B9A`;
  }
  if (typeof len.max !== "undefined") {
    resMax = !!(_currLen < len.max);
    resObj.detail = `\u5B57\u7B26\u4E32${str}\u7684\u957F\u5EA6${_currLen}${resMax ? "" : "\u4E0D"}\u7B26\u5408\u6700\u5927\u957F\u5EA6\u9650\u5B9A`;
  }
  resObj.result = resMin && resMax;
  return resObj;
};

var tValidata = /*#__PURE__*/Object.freeze({
	__proto__: null,
	isNum10: isNum10,
	hasSpace: hasSpace$1,
	hasSpecialSymbol: hasSpecialSymbol,
	stringLen: stringLen
});

Object.defineProperty(String.prototype, "idxMax", {
  get: function() {
    return this.valueOf().length - 1;
  }
});
String.prototype.left = function(len) {
  return left(this.valueOf(), len);
};
String.prototype.right = function(len) {
  return right(this.valueOf(), len);
};
String.prototype.mid = function(startIdx, len) {
  return mid(this.valueOf(), startIdx, len);
};
String.prototype.numberLike = function(typestr) {
  return numberLike(this.valueOf(), typestr);
};
String.prototype.upFirst = function() {
  return upFirst(this.valueOf());
};
String.prototype.cameCase = function(template = "lowerCame", linkSmybol = "-") {
  return cameCase(this.valueOf(), template, linkSmybol || "-");
};
String.prototype.toJson = function(toPlain = true) {
  return toJson(this.valueOf(), toPlain);
};
String.prototype.nick = function(template = "fromNick") {
  return nick(this.valueOf(), template);
};
String.prototype.trimAll = function() {
  return trimAll(this.valueOf());
};
Object.defineProperty(Number.prototype, "isOdd", {
  get: function() {
    return isOdd(this.valueOf());
  }
});
Object.defineProperty(Number.prototype, "isInt", {
  get: function() {
    return isInt(this.valueOf());
  }
});
Number.prototype.formatNum = function(template = { asNumber: { thousandSeparator: true } }) {
  return formatNum(this.valueOf(), template);
};
Number.prototype.toArr = function() {
  return toArr(this.valueOf());
};
Number.prototype.toRound = function(digit = 2, rule = "normal") {
  return toRound(this.valueOf(), digit, rule);
};
Number.prototype.funcAdd = function(...item) {
  return funcAdd(this.valueOf(), ...item);
};
Number.prototype.funcSub = function(...item) {
  return funcSub(this.valueOf(), ...item);
};
Number.prototype.funcMult = function(...item) {
  return funcMult(this.valueOf(), ...item);
};
Number.prototype.funcDiv = function(...item) {
  return funcDiv(this.valueOf(), ...item);
};
Number.prototype.convertRadix = function(from, to) {
  return convertRadix(this.valueOf(), from, to);
};
Object.defineProperty(Array.prototype, "idxMax", {
  get: function() {
    return this.valueOf().length - 1;
  }
});
Object.defineProperty(Array.prototype, "firstItem", {
  get: function() {
    return this.valueOf()[0];
  }
});
Object.defineProperty(Array.prototype, "lastItem", {
  get: function() {
    return this.valueOf()[this.valueOf().length - 1];
  }
});
Object.defineProperty(Array.prototype, "trustType", {
  get: function() {
    return tCheckType(this.valueOf());
  }
});
Array.prototype.insertTo = function(destIndex, ...item) {
  return insertTo(this, destIndex, ...item);
};
Array.prototype.getFrom = function(fromIdx, len) {
  return readFrom(this, fromIdx, len, false);
};
Array.prototype.removeFrom = function(fromIdx, len) {
  return readFrom(this, fromIdx, len, true);
};
Array.prototype.moveTo = function(fromIdx, destIdx, itemCount) {
  return moveTo(this, fromIdx, destIdx, itemCount);
};
Array.prototype.sortDefault = function(isDesc, orderKey) {
  return sortDefault(this, isDesc, orderKey);
};
Array.prototype.unDuplicate = function() {
  return unDuplicate(this);
};
Array.prototype.toObj = function(style = "self") {
  return toObj(this, style);
};
Array.prototype.toTree = function(options) {
  return toTree(this, options);
};

const { hasSpace } = tValidata;
var index_useCase = {
  tCoffe: {
    "The Test ablout Foo": {
      "Foo case 1": getUseCase("\u6D4B\u8BD5\u7528\u4F8B\u7684\u6837\u4F8B\uFF0C\u672C\u4F8B\u5047\u8BBE Foo \u6709\u4E00\u4E2A\u5F85\u6D4B\u8BD5\u7684\u60C5\u666F\uFF1AFoo case 1\uFF0C\u8BE5\u60C5\u666F\u6A21\u62DF\u5BF9\u4F20\u5165\u6570\u5B57\u4E58\u4EE52\u7684\u8F93\u51FA", (val) => 2 * val, 2, "equal", 5),
      "Foo case 2": getUseCase("\u6D4B\u8BD5\u7528\u4F8B\u7684\u6837\u4F8B\uFF0C\u672C\u4F8B\u5047\u8BBE Foo \u6709\u4E00\u4E2A\u5F85\u6D4B\u8BD5\u7684\u60C5\u666F\uFF1AFoo case 1\uFF0C\u8BE5\u60C5\u666F\u6A21\u62DF\u5BF9\u4F20\u5165\u6570\u5B57\u4E58\u4EE52\u7684\u8F93\u51FA", (val) => 2 * val, 10, "equal", 5),
      "Foo case 3": getUseCase({
        memo: "\u6D4B\u8BD5\u7528\u4F8B\u7684\u6837\u4F8B\uFF0C\u672C\u4F8B\u5047\u8BBE Foo \u6709\u4E00\u4E2A\u5F85\u6D4B\u8BD5\u7684\u60C5\u666F\uFF1AFoo case 1\uFF0C\u8BE5\u60C5\u666F\u6A21\u62DF\u5BF9\u4F20\u5165\u6570\u5B57\u4E58\u4EE52\u7684\u8F93\u51FA",
        todo: true
      }, (val) => 2 * val, 11, "equal", 5)
    },
    "The Test ablout Bar": {
      "Bar case 1": getUseCase("\u6D4B\u8BD5\u7528\u4F8B\u7684\u6837\u4F8B\uFF0C\u672C\u4F8B\u5047\u8BBE Bar \u6709\u4E00\u4E2A\u5F85\u6D4B\u8BD5\u7684\u60C5\u666F\uFF1ABar case 1\uFF0C\u8BE5\u60C5\u666F\u6A21\u62DF\u5BF9\u4F20\u5165\u6570\u5B57\u4E58\u4EE52\u7684\u8F93\u51FA", (val) => 2 * val, 10, "equal", 5),
      "Bar case 2": getUseCase({
        memo: "\u6D4B\u8BD5\u7528\u4F8B\u7684\u6837\u4F8B\uFF0C\u672C\u4F8B\u5047\u8BBE Bar \u6709\u4E00\u4E2A\u5F85\u6D4B\u8BD5\u7684\u60C5\u666F\uFF1ABar case 1\uFF0C\u8BE5\u60C5\u666F\u6A21\u62DF\u5BF9\u4F20\u5165\u6570\u5B57\u4E58\u4EE52\u7684\u8F93\u51FA",
        todo: true
      }, (val) => 2 * val, 11, "equal", 5)
    },
    "tValidata": {
      \u786E\u8BA4\u5B57\u7B26\u4E32\u4E2D\u4E0D\u5305\u542B\u4EFB\u4F55\u7A7A\u683C: getUseCase("", hasSpace, { result: false }, "deepEqual", "ThisStringHasnotSpace"),
      \u786E\u8BA4\u5B57\u7B26\u4E32\u5305\u542B\u7A7A\u683C: getUseCase("", hasSpace, { result: true }, "deepEqual", "This String Has Space")
    },
    "tObj": {
      "\u7528\u6307\u5B9A\u7684\u8DEF\u5F84\u4EE3\u8868\u591A\u5C42\u7EA7\u7684\u952E\u540D\uFF0C\u8BFB\u53D6\u5BF9\u8C61\u7684\u503C": getUseCase("", getByPath, 200, "deepEqual", getByPathDemo, "name.code.type.amount")
    }
  }
};

export { index_useCase as default };
