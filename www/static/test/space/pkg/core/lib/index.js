(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.tmindPlusCore = {}));
})(this, (function (exports) { 'use strict';

  const addPi = (x, y) => {
      return x + y + 100;
  };

  exports.addPi = addPi;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
