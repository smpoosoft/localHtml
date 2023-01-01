function tCheckType(val) {
  return `${Object.prototype.toString.call(val).replace(/\[object\s|\]/g, "").toLowerCase()}`;
}

const encode = (str) => str.split("").map((v) => v.charCodeAt(0));
const decode = (val, sep) => String.fromCharCode(...Array.isArray(val) ? val : val.split(sep || "-").map((v) => +v));

var tParse = /*#__PURE__*/Object.freeze({
	__proto__: null,
	encode: encode,
	decode: decode
});

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

const ECHO_COLOR = {
  bold: ["\x1B[1m", "\x1B[22m"],
  blue: ["\x1B[34m", "\x1B[39m"],
  green: ["\x1B[32m", "\x1B[39m"],
  yellow: ["\x1B[33m", "\x1B[39m"],
  red: ["\x1B[31m", "\x1B[39m"],
  blueBG: ["\x1B[44m", "\x1B[49m"],
  greenBG: ["\x1B[42;30m", "\x1B[49m"],
  yellowBG: ["\x1B[43;30m", "\x1B[49m"],
  redBG: ["\x1B[41m", "\x1B[49m"],
  end: ["\x1B[0m"]
};
const MSG_TYPE = {
  INFO: {
    name: "INFO",
    func: console.info,
    color: ["\u4FE1\u606F", ECHO_COLOR.blueBG[0], ECHO_COLOR.blueBG[1], ECHO_COLOR.blue[0], ECHO_COLOR.blue[1]]
  },
  SUCC: {
    name: "SUCC",
    func: console.log,
    color: ["\u6210\u529F", ECHO_COLOR.greenBG[0], ECHO_COLOR.greenBG[1], ECHO_COLOR.green[0], ECHO_COLOR.green[1]]
  },
  WARN: {
    name: "WARN",
    func: console.warn,
    color: ["\u8B66\u544A", ECHO_COLOR.yellowBG[0], ECHO_COLOR.yellowBG[1], ECHO_COLOR.yellow[0], ECHO_COLOR.yellow[1]]
  },
  ERR: {
    name: "ERR",
    func: console.error,
    color: ["\u9519\u8BEF", ECHO_COLOR.redBG[0], ECHO_COLOR.redBG[1], ECHO_COLOR.red[0], ECHO_COLOR.red[1]]
  }
};
const _echo_ = (msg, type, title) => {
  const ctrlObj = MSG_TYPE[type];
  const _func = ctrlObj.func;
  const [a, b, c, d, e] = ctrlObj.color;
  _func(`${b} ${title || a} ${c} ${d} ${msg} ${e}`);
};
const tLog = (...msg) => {
  console.log(...msg);
};
const tEcho = (msg, type, title) => {
  _echo_(msg, type || "INFO", title || "");
};
const tClear = () => {
  console.clear();
};
const tLine = (str) => {
  const _str = str ? ` ${str} ` : "";
  console.log(`
--------------------------------------${_str}--------------------------------------
`);
};
const tRow = (repeat = 1) => {
  console.log(new Array(repeat).fill("\n").join(""));
};

const DICT_ANIMAL = "\u9F20\u725B\u864E\u5154\u9F99\u86C7\u9A6C\u7F8A\u7334\u9E21\u72D7\u732A";
const DICT_SIGN = "\u6469\u7FAF\u5B9D\u74F6\u53CC\u9C7C\u767D\u7F8A\u91D1\u725B\u53CC\u5B50\u5DE8\u87F9\u72EE\u5B50\u5904\u5973\u5929\u79E4\u5929\u874E\u5C04\u624B";
const DICT_GZ = ["\u7532\u4E59\u4E19\u4E01\u620A\u5DF1\u5E9A\u8F9B\u58EC\u7678", "\u5B50\u4E11\u5BC5\u536F\u8FB0\u5DF3\u5348\u672A\u7533\u9149\u620C\u4EA5"];
const DICT_LUNAR = ["\u5341", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u4E03", "\u516B", "\u4E5D"];
const MIN_MAX = 864e13;
const DEFAULT_FMTSTR = "yyyy-mm-dd";
const WEEK_STR = {
  zh: ["\u5468\u65E5", "\u5468\u4E00", "\u5468\u4E8C", "\u5468\u4E09", "\u5468\u56DB", "\u5468\u4E94", "\u5468\u516D"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
};
const DAYS_MONTH = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MS_DAY = 24 * 60 * 60 * 1e3;
const NUM_TO_STR = ["\u96F6", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u4E03", "\u516B", "\u4E5D", "\u5341"];
const __fmtVal__ = function(val, fmt) {
  const __keepLen__ = (val2, len = 2) => `${val2}`.padStart(len, "0");
  const _y = `${val.getFullYear()}`;
  const _patternObj = {
    yyyy: _y,
    yy: __keepLen__(_y.slice(-2)),
    mm: __keepLen__(val.getMonth() + 1),
    dd: __keepLen__(val.getDate()),
    hh: __keepLen__(val.getHours()),
    mi: __keepLen__(val.getMinutes()),
    ss: __keepLen__(val.getSeconds()),
    ms: __keepLen__(val.getMilliseconds(), 3)
  };
  return (fmt?.toLowerCase() || DEFAULT_FMTSTR).replace(/yyyy|ms|dd|hh|mi|ss|mm/g, (a) => {
    return _patternObj[a || ""] || "";
  });
};
const __checkDate__ = (val) => {
  if (!(val.toString() === "Invalid Date")) {
    return new Tdate(val);
  } else {
    throw new Error(`Get invalid param for fuction tdate. 
This parma can be null/undefind or datetime string, 
also can be number between -${MIN_MAX} AND < ${MIN_MAX}.
This function already return now as default.`);
  }
};
const __getLunarName__ = (data) => {
  const val = `${data}`;
  const [a, b] = val.split("").map((v) => +v);
  if (val === "10")
    return "\u521D\u5341";
  else if (val === "20")
    return "\u4E8C\u5341";
  else if (val === "30")
    return "\u4E09\u5341";
  else if (b) {
    const _str1 = a === 1 && "\u5341" || a === 2 && "\u5EFF" || "\u4E09\u5341";
    const _str2 = DICT_LUNAR[b];
    return `${_str1}${_str2}`;
  } else {
    return `\u521D${DICT_LUNAR[a]}`;
  }
};
class Tdate {
  #val;
  constructor(initVal) {
    this.#val = initVal;
  }
  static get abs() {
    return MIN_MAX;
  }
  get isLeap() {
    const y = this.#val.getFullYear();
    return y % 4 === 0 && y % 100 !== 0 || y % 400 === 0;
  }
  get year() {
    return +this.format("yyyy");
  }
  get month() {
    return +this.format("mm");
  }
  get day() {
    return +this.format("dd");
  }
  get hour() {
    return +this.format("hh");
  }
  get minute() {
    return +this.format("mi");
  }
  get second() {
    return +this.format("ss");
  }
  get millisecond() {
    return +this.format("ms");
  }
  get week() {
    return this.#val.getDay() || 7;
  }
  get quarter() {
    const m = this.#val.getMonth() + 1;
    return m < 4 && 1 || m < 7 && 2 || m < 10 && 3 || 4;
  }
  get solar() {
    const [year, month, day] = this.toArr();
    let y = +year;
    let m = +month - 1;
    let d = +day;
    const sTermInfo = new Array(0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758);
    const solarTerm = new Array("\u5C0F\u5BD2", "\u5927\u5BD2", "\u7ACB\u6625", "\u96E8\u6C34", "\u60CA\u86F0", "\u6625\u5206", "\u6E05\u660E", "\u8C37\u96E8", "\u7ACB\u590F", "\u5C0F\u6EE1", "\u8292\u79CD", "\u590F\u81F3", "\u5C0F\u6691", "\u5927\u6691", "\u7ACB\u79CB", "\u5904\u6691", "\u767D\u9732", "\u79CB\u5206", "\u5BD2\u9732", "\u971C\u964D", "\u7ACB\u51AC", "\u5C0F\u96EA", "\u5927\u96EA", "\u51AC\u81F3");
    let solarTerms = "";
    while (solarTerms == "") {
      let tmp1 = new Date(315569259747e-1 * (y - 1900) + sTermInfo[m * 2 + 1] * 6e4 + Date.UTC(1900, 0, 6, 2, 5));
      let tmp2 = tmp1.getUTCDate();
      if (tmp2 == d)
        solarTerms = solarTerm[m * 2 + 1];
      tmp1 = new Date(315569259747e-1 * (y - 1900) + sTermInfo[m * 2] * 6e4 + Date.UTC(1900, 0, 6, 2, 5));
      tmp2 = tmp1.getUTCDate();
      if (tmp2 == d)
        solarTerms = solarTerm[m * 2];
      if (d > 1) {
        d = d - 1;
      } else {
        m = m - 1;
        if (m < 0) {
          y = y - 1;
          m = 11;
        }
        d = 31;
      }
    }
    return solarTerms;
  }
  get star() {
    const Zone = new Array(1222, 122, 222, 321, 421, 522, 622, 722, 822, 922, 1022, 1122, 1222);
    const dtArr = this.toArr();
    const m = dtArr[1];
    const d = dtArr[2];
    if (100 * m + d >= Zone[0] || 100 * m + d < Zone[1]) {
      var i = 0;
    } else {
      for (var i = 1; i < 12; i++) {
        if (100 * m + d >= Zone[i] && 100 * m + d < Zone[i + 1]) {
          break;
        }
      }
    }
    return DICT_SIGN.substring(2 * i, 2 * i + 2);
  }
  get animal() {
    return DICT_ANIMAL.charAt((this.#val.getFullYear() - 4) % 12);
  }
  get indexOfQuarter() {
    return -1 * this.getDiff(new Date(`${this.year}-${[1, 4, 7, 10][this.quarter - 1]}-1 00:00:00.000`), "day");
  }
  get indexOfYear() {
    return getRoundNum((this.toNumber() - new Date(`${this.year}-1-1 00:00:00.000`).getTime()) / MS_DAY, 0);
  }
  get daysOfMonth() {
    return new Date(this.#val.getFullYear(), +this.format("mm"), 0).getDate();
  }
  get daysOfQuarter() {
    const daysOfMonth2 = new Date(this.year, 2, 0).getDate();
    return [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]][this.quarter - 1].map((v) => DAYS_MONTH[v] || daysOfMonth2).reduce((pre, curr) => {
      return pre + curr;
    }, 0);
  }
  get daysOfYear() {
    return 337 + new Date(this.#val.getFullYear(), 2, 0).getDate();
  }
  get ratioOfWeek() {
    return getRoundNum(this.week / 7, 1);
  }
  get ratioOfMonth() {
    return getRoundNum(this.day / this.daysOfMonth, 1);
  }
  get ratioOfQuarter() {
    return getRoundNum(this.indexOfQuarter / this.daysOfQuarter, 1);
  }
  get ratioOfYear() {
    return getRoundNum(this.indexOfYear / this.daysOfYear, 3);
  }
  get tiangan() {
    const i = this.#val.getFullYear() - 1900 + 36;
    return DICT_GZ[0].charAt(i % 10) + DICT_GZ[1].charAt(i % 12);
  }
  get weekOfMonth() {
    return Math.ceil((this.#val.getDate() + 6 - this.#val.getDay()) / 7);
  }
  get weekOfYear() {
    return Math.ceil((this.#val.getDate() + 6 - this.#val.getDay()) / 7);
  }
  format = (fmt) => {
    return __fmtVal__.call(this, this.#val, fmt || "yyyy-mm-dd");
  };
  formatAsCn = (withYear = false, withTime) => {
    const [a, b] = Intl.DateTimeFormat("zh-u-nu-hanidec", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "numeric",
      second: "numeric",
      hour12: false,
      timeZone: "Asia/Shanghai"
    }).format(this.#val).split(/\s+/);
    const [y, m, d] = a.split("/");
    const rplc = (str) => str.replace(/^〇〇$/, "\u96F6").replace(/^〇/, "").replace(/〇$/, "\u5341");
    const _dtPart = withYear ? `${y}\u5E74${rplc(m)}\u6708${rplc(d)}\u65E5` : `${rplc(m)}\u6708${rplc(d)}\u65E5`;
    if (!withTime) {
      return _dtPart;
    } else {
      const _tmPart = b.split(":").map((v) => rplc(v)).join(":");
      return `${_dtPart} ${_tmPart}`;
    }
  };
  formatAsLunar = (skipYear = true) => {
    const _val = Intl.DateTimeFormat("zh-u-ca-chinese-nu-latn").format(this.#val);
    if (!skipYear) {
      const [a, b] = _val.split("\u6708");
      return `${a}\u6708${__getLunarName__(b)}`;
    } else {
      const _arr = _val.split("\u5E74");
      const [a, b] = (_arr[1] || "").split("\u6708");
      return `${a}\u6708${__getLunarName__(b)}`;
    }
  };
  formatAsBh = () => {
    return Intl.DateTimeFormat("zh-chinese-u-ca-buddhist").format(this.#val).replace(/-/, "\u5E74").replace(/-/, "\u6708");
  };
  formatAsWorld = (languageTag) => {
    return Intl.DateTimeFormat(languageTag || "fr-ca").format(this.#val);
  };
  getWeek = (local) => {
    const w = this.#val.getDay();
    const str = local || "zh";
    if (typeof local === "undefined") {
      return w || 7;
    } else {
      return WEEK_STR[str][w];
    }
  };
  getWeekOfMonth = (local) => {
    const w = Math.ceil((this.#val.getDate() + 6 - this.#val.getDay()) / 7);
    if (typeof local !== "undefined") {
      return NUM_TO_STR[w];
    } else {
      return w;
    }
  };
  getWeekOfYear = () => {
    return getRoundNum((this.indexOfYear - (7 - (new Date(`${this.year}-1-1`).getDay() || 7))) / 7, 0) + 1;
  };
  getQuarter = (local) => {
    const m = this.#val.getMonth() + 1;
    const q = m < 4 && 1 || m < 7 && 2 || m < 10 && 3 || 4;
    if (typeof local !== "undefined") {
      return `${NUM_TO_STR[q]}\u5B63\u5EA6`;
    } else {
      return q;
    }
  };
  getOffset = (diffNum, diffType) => {
    if (typeof diffNum !== "undefined") {
      let val = diffNum * MS_DAY;
      if (diffType === "week") {
        val *= 7;
      } else if (diffType === "month") {
        val *= 30;
      } else if (diffType === "year") {
        val *= 365;
      }
      return Intl.DateTimeFormat("fr-ca").format(new Date(this.#val.getTime() + val));
    } else {
      return this.format();
    }
  };
  getDiff = (dateVal, outputType) => {
    if (typeof dateVal !== "undefined") {
      const num1 = this.#val.getTime();
      const tp = typeof dateVal;
      const num2 = tp === "number" && dateVal || (dateVal instanceof Date && dateVal || typeof dateVal === "string" && new Date(dateVal) || dateVal.val || this.#val).getTime();
      const diffVal = num2 - num1;
      const diffValDay = Math.round((num2 - num1) / 1e3 / 60 / 60 / 24);
      const getNum = (val, len = 1) => +val.toFixed(len);
      if (outputType === "ms") {
        return diffVal;
      } else if (outputType === "second") {
        return diffVal / 1e3 << 0;
      } else if (outputType === "minute") {
        return diffVal / 1e3 / 60 << 0;
      } else if (outputType === "hour") {
        return getNum(diffVal / 1e3 / 60 / 60, 1);
      } else if (outputType === "year") {
        return +(diffValDay / 365).toFixed(3);
      } else if (outputType === "month") {
        return getNum(diffValDay / 30);
      } else if (outputType === "week") {
        return getNum(diffValDay / 7);
      } else {
        return diffValDay;
      }
    } else {
      return 0;
    }
  };
  toNumber = (notTimestamp, fmt) => {
    if (notTimestamp) {
      const val = +this.format((fmt || "yyyymmddhhmissms").replace(/\-/g, ""));
      if (!isNaN(val)) {
        return val;
      } else {
        throw new Error("Get invalid param of tdate.toNumber.\nIn this function's param string, you should with the pattern string like tdate.format only.");
      }
    } else {
      return this.#val.getTime();
    }
  };
  toJson = (local) => {
    const [y, m, d, h, mi, s, ms] = this.toArr(true);
    return {
      year: y,
      month: m,
      day: d,
      hour: h,
      minutes: mi,
      second: s,
      millisecond: ms,
      week: this.getWeek(local),
      weekOfMonth: this.getWeekOfMonth(local),
      weekOfYear: this.getWeekOfYear(),
      quarter: this.getQuarter(local),
      isLeap: this.isLeap,
      lunar: this.formatAsLunar(),
      buddhist: this.formatAsBh()
    };
  };
  toArr = (includTime) => {
    return this.format(includTime ? "yyyy-mm-dd-hh-mi-ss-ms" : "yyyy-mm-dd").split("-").map((v) => +v);
  };
}
function tDate(...val) {
  const [a, b, c, d = 0, e = 0, f = 0, g = 0] = val;
  if (!a) {
    return __checkDate__(new Date());
  } else {
    if (val.length > 1) {
      return __checkDate__(new Date(a, b, c, d, e, f, g));
    } else {
      return __checkDate__(new Date(a));
    }
  }
}

function __objToArr__(obj, opt, parentObj) {
  const { subs, ...otherObj } = obj;
  const { exclude = [], addPid = true, addLevel = false, levelStart = 1, addHasSub = false, addIsRoot = true } = opt || {};
  const _newObj = Object.fromEntries(Object.entries(otherObj).filter((v) => !exclude?.includes(v[0]) && v[0]));
  const _isRoot = typeof parentObj === "undefined" || otherObj?.isRoot || otherObj.level === levelStart;
  if (addHasSub) {
    _newObj.hasSub = Array.isArray(subs) && subs.length;
  }
  if (addLevel) {
    _newObj.level = (parentObj?.level ?? (levelStart ? 0 : -1)) + 1;
  }
  if (addPid) {
    _newObj.pid = _newObj.level === parentObj?.id;
  }
  if (addIsRoot) {
    _newObj.isRoot = _isRoot;
  }
  const _arr = [_newObj];
  if (Array.isArray(subs)) {
    for (const v of subs) {
      _arr.push(...__objToArr__(v, opt, _newObj.level));
    }
  }
  return _arr;
}
function plain(valObj) {
  const _obj = /* @__PURE__ */ Object.create(null);
  const _arr = Object.entries(valObj);
  for (const [a, b] of _arr) {
    _obj[a] = b;
  }
  return _obj;
}
function clone(valObj, useDeep) {
  console.log(useDeep);
  return valObj;
}
function toArrTree(valObj, options) {
  return __objToArr__(valObj, options);
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

var tObj = /*#__PURE__*/Object.freeze({
	__proto__: null,
	plain: plain,
	clone: clone,
	toArrTree: toArrTree,
	getByPath: getByPath
});

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
const _strPowerBy = "80-111-119-101-114-32-98-121-32-116-70-114-97-109-101-32-118-49-48-32-45-32-116-104-101-32-101-110-103-105-110-32-111-102-32-116-67-111-102-102-101";
const _strAppCopy1 = "67-111-112-121-114-105-103-104-116-32-169-32-50-48-49-53-32-45-32";
const _strAppCopy2 = encode(`${new Date().getFullYear() - 1}`).join("-");
const _strAppCopy3 = "32-28145-26222-32-83-77-80-79-79-46-99-111-109-32-29256-26435-25152-26377";
const _strCompany = "19978-28023-28145-26222-36719-20214-26377-38480-20844-21496";
const _strWebSite = "119-119-119-46-115-109-112-111-111-46-99-111-109";
const rowBrand1 = "37-99-32-116-70-114-97-109-101-32-37-99-32-86-49-48-32-37-99-32-19978-28023-28145-26222-36719-20214-26377-38480-20844-21496-32-80-111-119-101-114-32-98-121-32-116-67-111-102-102-101-32-101-110-103-105-110-46";
const rowBrand2 = "112-97-100-100-105-110-103-58-32-50-112-120-32-49-112-120-59-32-98-111-114-100-101-114-45-114-97-100-105-117-115-58-32-51-112-120-32-48-32-48-32-51-112-120-59-32-99-111-108-111-114-58-32-35-102-102-102-59-32-98-97-99-107-103-114-111-117-110-100-58-32-35-54-48-54-48-54-48-59-32-102-111-110-116-45-119-101-105-103-104-116-58-32-98-111-108-100-59";
const rowBrand3 = "112-97-100-100-105-110-103-58-32-50-112-120-32-49-112-120-59-32-98-111-114-100-101-114-45-114-97-100-105-117-115-58-32-48-32-51-112-120-32-51-112-120-32-48-59-32-99-111-108-111-114-58-32-35-102-102-102-59-32-98-97-99-107-103-114-111-117-110-100-58-32-111-114-97-110-103-101-59-32-102-111-110-116-45-119-101-105-103-104-116-58-32-98-111-108-100-59";
const rowBrand4 = "112-97-100-100-105-110-103-58-32-50-112-120-32-49-112-120-59-32-98-111-114-100-101-114-58-32-110-111-110-101-59-32-99-111-108-111-114-58-32-35-52-52-52-59-32-98-97-99-107-103-114-111-117-110-100-58-32-116-114-97-110-115-112-97-114-101-110-116-59-32-102-111-110-116-45-119-101-105-103-104-116-58-32-49-48-48-59";
const brand = decode(_strBrand);
const brandRow = [decode(rowBrand1), decode(rowBrand2), decode(rowBrand3), decode(rowBrand4)];
class smpoo {
  static get company() {
    return decode(_strCompany);
  }
  static get copyRight() {
    return decode(`${_strAppCopy1}-${_strAppCopy2}-${_strAppCopy3}`);
  }
  static get powerBy() {
    return decode(_strPowerBy);
  }
  static get website() {
    return decode(_strWebSite);
  }
  static printBrand(richText) {
    console.log(richText ? brand : brandRow);
  }
}

var smpoo$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	smpoo: smpoo
});

const toHex = (n) => `${n > 15 ? "" : 0}${n.toString(16)}`;
const toRgbString = (colorObj) => {
  const { r, g, b } = colorObj;
  return `rgb(${r},${g},${b})`;
};
const parseHexColor = (color) => {
  let hex = color.slice(1);
  let a = 1;
  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }
  if (hex.length === 8) {
    a = parseInt(hex.slice(6), 16) / 255;
    hex = hex.slice(0, 6);
  }
  const bigint = parseInt(hex, 16);
  return {
    r: bigint >> 16 & 255,
    g: bigint >> 8 & 255,
    b: bigint & 255,
    a
  };
};
const parseRgbaColor = (color) => {
  const arr = color.match(/(\d(\.\d+)?)+/g) || [];
  const res = arr.map((s) => parseInt(s, 10));
  return {
    r: res[0],
    g: res[1],
    b: res[2],
    a: parseFloat(arr[3])
  };
};
const toHexString = (colorObj) => {
  const { r, g, b, a = 1 } = colorObj;
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${a === 1 ? "" : toHex(Math.floor(a * 255))}`;
};
const toRgbaString = (colorObj, n = 1e4) => {
  const { r, g, b, a = 1 } = colorObj;
  return `rgba(${r},${g},${b},${Math.floor(a * n) / n})`;
};
const parseColorString = (color) => {
  if (color.startsWith("#")) {
    return parseHexColor(color);
  } else if (color.startsWith("rgb")) {
    return parseRgbaColor(color);
  } else if (color === "transparent") {
    return parseHexColor("#00000000");
  }
  throw new Error(`color string error: ${color}`);
};
const getColorInfo = (color) => {
  const colorObj = parseColorString(color);
  const hex = toHexString(colorObj);
  const rgba = toRgbaString(colorObj);
  const rgb = toRgbString(colorObj);
  return {
    hex,
    rgba,
    rgb,
    rgbaObj: colorObj
  };
};
const hexToRgba = (hex) => {
  const colorObj = parseColorString(hex);
  return toRgbaString(colorObj);
};
const rgbaToHex = (rgba) => {
  const colorObj = parseColorString(rgba);
  return toHexString(colorObj);
};

var tColor = /*#__PURE__*/Object.freeze({
	__proto__: null,
	toHexString: toHexString,
	toRgbaString: toRgbaString,
	parseColorString: parseColorString,
	getColorInfo: getColorInfo,
	hexToRgba: hexToRgba,
	rgbaToHex: rgbaToHex
});

const EN_LETTER = "abcdefghjklmnopqrstwxyz".split("");
const CH_LETTER = "\u963F\u516B\u5693\u54D2\u59B8\u53D1\u65EE\u54C8\u8BA5\u5494\u5783\u5417\u62CF\u5662\u5991\u4E03\u5465\u6268\u5B83\u7A75\u5915\u4E2B\u5E00".split("");
function firstLetter(word) {
  let k = 0;
  let currLetter = "";
  const str = word.charAt(0);
  for (const v of EN_LETTER) {
    if (CH_LETTER[k].localeCompare(str, "zh") <= 0 && str.localeCompare(CH_LETTER[k + 1], "zh") === -1) {
      currLetter = v;
      break;
    }
    k++;
  }
  return currLetter;
}
function groupLetter(arr, fullLetter) {
  const resObj = {};
  let i = 0;
  while (i < arr.length) {
    const va = arr[i];
    if (va && /^[a-zA-Z]/.test(va)) {
      const lt = va.charAt(0);
      if (lt) {
        if (!resObj[lt]) {
          resObj[lt] = [];
        } else {
          resObj[lt].push(va);
        }
      }
    } else {
      let k = 0;
      for (const v of EN_LETTER) {
        if (CH_LETTER[k].localeCompare(va, "zh") <= 0 && va.localeCompare(CH_LETTER[k + 1], "zh") === -1) {
          if (!resObj[v]) {
            resObj[v] = [];
          }
          resObj[v].push(va);
          break;
        } else if (fullLetter && !resObj[v]) {
          resObj[v] = [];
        }
        k++;
      }
    }
    i++;
  }
  return resObj;
}

var tPinyin = /*#__PURE__*/Object.freeze({
	__proto__: null,
	firstLetter: firstLetter,
	groupLetter: groupLetter
});

const isNum10 = (...val) => ({ result: !isNaN(+val) });
const hasSpace = (str) => {
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
	hasSpace: hasSpace,
	hasSpecialSymbol: hasSpecialSymbol,
	stringLen: stringLen
});

const now = (withTime, asTiemStamp) => {
  const _dt = new Date();
  if (asTiemStamp) {
    return _dt.getTime();
  } else {
    const _arr = [];
    _arr.push(`${_dt.getFullYear()}-${_dt.getMonth() + 1}-${_dt.getDate()}`);
    if (withTime) {
      _arr.push(`${_dt.getHours()}:${_dt.getMinutes()}:${_dt.getSeconds()}`);
    }
    return _arr.join(" ");
  }
};

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
var index = {
  tCheckType
};

export { index as default, now, smpoo$1 as smpoo, tClear, tColor, tDate, tEcho, tLine, tLog, tObj, tParse, tPinyin, tRow, tValidata };
