import j from 'jscodeshift';
import BaseTemplate from '../base.template';
import { TestConfig } from '../../configuration';
import { toImportPath } from '../../utils/path';
import { constructTemplate } from '../../utils/template';

class TestTemplate extends BaseTemplate {
	constructor(
		private componentName: string,
		private importPath: string,
		private config: TestConfig,
		private componentDefaultImport: boolean
	) {
		super();
	}

	build() {
		const body = [];

		body.push(
			j.importDeclaration(
				[
					j.importSpecifier(j.identifier('render'), j.identifier('render')),
					j.importSpecifier(j.identifier('screen'), j.identifier('screen')),
				],
				j.literal('@testing-library/react')
			)
		);

		const componentImportSpecifier = this.componentDefaultImport
			? j.importDefaultSpecifier
			: j.importSpecifier;

		body.push(
			j.importDeclaration(
				[componentImportSpecifier(j.identifier(this.componentName))],
				j.literal(toImportPath(this.importPath))
			)
		);

		body.push(
			j.expressionStatement(
				j.callExpression(j.identifier('describe'), [
					j.literal(this.componentName),
					j.arrowFunctionExpression(
						[],
						j.blockStatement([
							j.expressionStatement(
								j.callExpression(j.identifier('it'), [
									j.literal(''),
									j.arrowFunctionExpression(
										[],
										j.blockStatement([
											j.expressionStatement(
												j.callExpression(j.identifier('render'), [
													j.jsxElement(
														j.jsxOpeningElement(
															j.jsxIdentifier(
																this.componentName
															),
															[],
															true
														)
													),
												])
											),
										])
									),
								])
							),
						])
					),
				])
			)
		);

		return constructTemplate(body);
	}
}

export default TestTemplate;
