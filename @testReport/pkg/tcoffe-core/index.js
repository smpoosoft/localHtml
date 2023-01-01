const { module: QGroup, test, todo } = QUnit;

/** 对预期值或实际值格式化输出，以便正常显示对象，而非 [object, object] 形式
 *
 * @param {*} val 要格式化的值
 * @returns
 */
const fmtVal = (val) => {
  const _tp = typeof val;
  if (_tp === 'string') return `'${val}'`;
  if (Array.isArray(val)) return val.join(', ');
  if (_tp === 'object') return JSON.stringify(val, null, 2);
  return val;
};

/** 自动生成断言执行函数的尾参数 [message]（如 assert.ok，的最后一个参数）
 *
 * @param {*} actualVal 实际值
 * @param {*} expectVal 预期值
 * @param {*} title 本用例标题
 * @param {*} description 对本用例输出信息中的附加描述
 * @returns
 */
const getAssertMessage = (actualVal, expectVal, title, description) => {
  const _strAppend = description ? `\n${description}` : '';
  return `${title}\n预期值：${fmtVal(expectVal)}，实际值：${fmtVal(
    actualVal
  )}${_strAppend}`;
};

/** 判断是否为 Promise 函数 */
const isPromise = (fn) => {
  return (
    !!fn &&
    (typeof fn === 'object' || typeof fn === 'function') &&
    typeof fn.then === 'function'
  );
};

/** 判断实际值发生器是否为函数，若是，则输出函数运行后结果，若否，则直接输出发生器作为实际值
 *
 * @param {*} actualValCreator 实际值发生器
 * @param {*} param 参数列表
 * @returns
 */
const getVal = (actualValCreator, param) => {
  const _tp = typeof actualValCreator;
  if (_tp === 'function') {
    const valActual = actualValCreator.apply(actualValCreator, param || []);
    return [valActual, isPromise(valActual)];
  } else {
    return [actualValCreator];
  }
};

/** 将同一个 Module 下的 useCase 对象按照是否为 ToDo 进行分组 */
const groupCase = (caseObj) => {
  const _obj = {
    /** 常规测试 */
    groupGen: [],
    /** 有 TODO 标记的测试 */
    groupTodo: [],
  };
  const _arr = Object.entries(caseObj);
  for (const v of _arr) {
    const [a, b] = v;
    const { description, actualValCreator, expectVal, assertUse, param } = b;
    const _objTask = {
      title: a,
      description: '',
      actualValCreator,
      expectVal,
      assertUse,
      param,
    };
    if (typeof description === 'object') {
      _objTask.description = description.memo || '';
      if (description.todo) {
        _obj.groupTodo.push(_objTask);
      } else {
        _obj.groupGen.push(_objTask);
      }
    } else {
      _objTask.description = description;
      _obj.groupGen.push(_objTask);
    }
  }
  return _obj;
};

/** 将 assert 各种方法的调用签名进行统一
 *
 * @param {*} assert 要执行断言的 assert 实例
 * @param {*} method 断言采用的 assert 方法
 * @param {*} actualVal 实际值
 * @param {*} expectVal 预期值
 * @param {*} expectVal 情景标题
 * @param {*} appendMeg 附加描述
 */
const execAssert = (assert, method, actualVal, expectVal, title, description) => {
  if (typeof expectVal === 'object') {
    assert.deepEqual(actualVal, expectVal, getAssertMessage(actualVal, expectVal, title, description));
  } else {
    if (method === 'ok') {
      assert.ok(actualVal, getAssertMessage(actualVal, expectVal, title, description));
    } else {
      assert[method](actualVal, expectVal, getAssertMessage(actualVal, expectVal, title, description));
    }
  }
};

/** 对用例进行测试
 *
 * @param {*} taskList 要测试的用例情景集合
 * @param {*} testTag 测试标签
 * @param {*} isTodo 是否为 todo 类型
 */
const execTest = (taskList, tag, isTodo) => {
  if (taskList.length) {
    const fn = isTodo ? todo : test;
    fn(tag, (assert) => {
      for (const vItem of taskList) {
        const { title, description, actualValCreator, expectVal, assertUse, param } = vItem;
        const [valActual, valIsPromise] = getVal(actualValCreator, param);
        if (valIsPromise) {
          const done = assert.async();
          valActual.then((res) => {
            execAssert(assert, assertUse, res, expectVal, title, description);
            done();
          });
        } else {
          execAssert(assert, assertUse, valActual, expectVal, title, description);
        }
      }
    });
  }
}

/** 对测试用例执行测试并显示报告
 *
 * @param useCase 测试用例
 */
export const testFunc = function (useCase) {
  const _arrCaseGroup = Object.keys(useCase);
  for (const vGL1 of _arrCaseGroup) {
    QGroup(vGL1);
    const _arrL2 = Object.entries(useCase[vGL1]);
    for (const vUnit of _arrL2) {
      const [a, b] = vUnit;
      QGroup(`${vGL1} / ${a}`);
      const { groupGen, groupTodo } = groupCase(b);
      execTest(groupGen, '', false);
      execTest(groupTodo, '', true);
    }
  }
};

