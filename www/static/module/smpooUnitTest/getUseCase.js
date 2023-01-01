/** 获取一个单元测试的用例
 *
 * @param { string } title 用例标题
 * @description ----------------------
 * @param { string } funcName 用例中，要测试的函数或属性名称
 * @description 如果 funcName 中，小数点中的其中某段是类库导出时定义的命名空间名称，
 * @description 那有时候需要把该命名空间名称在 funcName 中重复写一次，QUnit 测试时，才能正常通过小数点区分正常递归调用到目标函数或属性
 * @description 具体何时需要复写，是否需要复写，取决于打包前源码的结构组织。此处说明是为了避免后续测试时困扰。
 * @description 举例：加入 funcName 为：foo.bar，而其中的 foo 仅仅是一个命名空间名称，则该 funcName 需要写为：foo.foo.bar
 * @description 假如此时 foo 以用作该用例组的组名称，那此时 funcName 则变为：foo.bar
 * @description ----------------------

 * @param { any[] } param 用例目标为函数时，要传入测试函数的参数，用数组依次包含所有参数
 * @description ----------------------
 * @param { any } expect 预期值
 * @description 可以是值，或者自定义函数。
 * @description 如果通过函数提供预期，有且仅有一个参数，该参数代表实际值，且必须返回布尔类型的值，供 QUnit.ok 调用
 * @description 示例：expect: (actualVal) => !!(actualVal.result > 0)
 * @description 如果希望预期值为 undefind，则此处不提供 expect 属性，或该属性值写为 undefind
 * @description ----------------------
 * @param { 'ok' | 'equal' | 'deepEqual'  } assertFunc [可选]:指定 QUnit 的断言方法，默认为：equal
 * @description 目前暂时仅支持到 ok、equal、deepEqual 三种方法
 * @description ----------------------
 * @param { boolean  } needNew [可选]：表示该用例需要 new 一个实例来执行测试
 * @description 当 needNew 为真时，
 * 若 funcName 含有小数点，则会将最后一个小数点前面的部分视为类，
 * 如 foo.Bar.someFunc，会 执行 new foo.Bar()，
 * 若 funcName 不含小数点，则会将组名称视为类名
 * @description 为假时，则直接调用 funcName
 * @returns
 */
var getUseCase = function (title, funcName, param, expect, assertFunc = 'equal', needNew = false) {
	return {
		title: `${funcName}：${title}，断言方式: ${assertFunc}， 参数: ${typeof param === 'object' ? JSON.stringify(param) : param}`,
		funcName,
		param: param || [],
		expect,
		assertFunc,
		needNew
	};
};
