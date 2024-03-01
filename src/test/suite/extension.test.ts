import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

import PeekFileDefinitionProvider from '../../PeekFileDefinitionProvider';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('PeekFileDefinitionProvider REGEX_PATTERN test', () => {
		const testStrings = [
			'@Named("getFoo=getFOO,getBar=getBAR")',
			'@Query(id="getHoge"',
			'@Query("getPiyo", type="row")',
			"#[DbQuery(id:'foo_bar_list')]",
			"#[DbQuery(id: 'foo_bar_list')]",
			"#[DbQuery('get_hoge_piyo')]",
		];
		testStrings.forEach(testString => {
			let match = testString.match(PeekFileDefinitionProvider.REGEX_PATTERN);
			assert.notStrictEqual(match, null);
		});
	});
});
