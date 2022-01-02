import j, { JSXElement } from 'jscodeshift';
import BaseStyleTypeTemplate from './base.style.type.template';
import { removeExtension } from '../../utils/path';
import { constructTemplate } from '../../utils/template';
import { parser } from '../../parser';

class JSStyleTypeTemplate extends BaseStyleTypeTemplate {
	build() {
		const body = [];

		body.push(
			j.importDeclaration(
				[j.importDefaultSpecifier(j.identifier('styled'))],
				j.literal('styled-components')
			)
		);

		body.push(
			j.exportNamedDeclaration(
				j.variableDeclaration('const', [
					j.variableDeclarator(
						j.identifier(`Styled${this.name}`),
						j.taggedTemplateExpression(
							j.memberExpression(
								j.identifier('styled'),
								j.identifier('div')
							),
							j.templateLiteral(
								[j.templateElement({ raw: '', cooked: '' }, true)],
								[]
							)
						)
					),
				])
			)
		);

		return constructTemplate(body);
	}

	include(template: string, name: string, importPath: string) {
		const root = j(template, { parser });
		const elementName = `Styled${name}`;

		root.find(j.ImportDeclaration)
			.at(-1)
			.insertAfter(
				j.importDeclaration(
					[j.importSpecifier(j.identifier(elementName))],
					j.literal(removeExtension(importPath))
				)
			);

		const jsxElement: JSXElement = root.findJSXElements().at(0).get().value;

		jsxElement.openingElement.name = j.jsxIdentifier(elementName);

		if (jsxElement.closingElement) {
			jsxElement.closingElement.name = j.jsxIdentifier(elementName);
		}

		return root.toSource();
	}
}

export default JSStyleTypeTemplate;
