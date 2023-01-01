/* eslint-disable no-console */
import { addPi } from '/static/test/space/pkg/core/lib/index.esm.js';

export const testFunc = () => {
	/* eslint-disable no-undef */
	// @ts-ignore
	QUnit.test('hello test', assert => {
		assert.ok(addPi(2, 3) === 105, 'Test hello wordl');
	});
};
