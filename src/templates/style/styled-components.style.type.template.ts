import j, { ExportSpecifier, JSXElement } from 'jscodeshift';
import BaseStyleTypeTemplate from './base.style.type.template';
import { removeExtension } from '../../utils/path';
import { addImport, constructTemplate } from '../../utils/template';
import { parser } from '../../parser';

class StyledComponentsStyleTypeTemplate extends BaseStyleTypeTemplate {
	build() {
		const body = [];

		body.push(
			j.importDeclaration(
				[j.importDefaultSpecifier(j.identifier('styled'))],
				j.literal('styled-components')
			)
		);

		const variableIdentifier = j.identifier(`Styled${this.name}`);
		const styledExpression = j.taggedTemplateExpression(
			j.memberExpression(j.identifier('styled'), j.identifier('div')),
			j.templateLiteral([j.templateElement({ raw: '', cooked: '' }, true)], [])
		);

		const variableDeclaration = j.variableDeclaration('const', [
			j.variableDeclarator(variableIdentifier, styledExpression),
		]);

		if (this.config.export.default) {
			if (this.config.export.inline) {
				body.push(j.exportDefaultDeclaration(styledExpression));
			} else {
				body.push(variableDeclaration);
				body.push(j.exportDefaultDeclaration(variableIdentifier));
			}
		} else {
			if (this.config.export.inline) {
				body.push(j.exportNamedDeclaration(variableDeclaration));
			} else {
				const exportSpecifier: ExportSpecifier = {
					type: 'ExportSpecifier',
					exported: variableIdentifier,
					local: variableIdentifier,
				};

				body.push(variableDeclaration);
				body.push(j.exportNamedDeclaration(null, [exportSpecifier]));
			}
		}

		return constructTemplate(body);
	}

	include(template: string, name: string, importPath: string) {
		const root = j(template, { parser });
		const elementName = `Styled${name}`;

		const importSpecifier = this.config.export.default
			? j.importDefaultSpecifier
			: j.importSpecifier;

		addImport(
			root,
			j.importDeclaration(
				[importSpecifier(j.identifier(elementName))],
				j.literal(removeExtension(importPath))
			)
		);

		const jsxElement: JSXElement = root.findJSXElements().at(0).get().value;

		jsxElement.openingElement.name = j.jsxIdentifier(elementName);

		if (jsxElement.closingElement) {
			jsxElement.closingElement.name = j.jsxIdentifier(elementName);
		}

		return root.toSource({ lineTerminator: '\n' });
	}
}

export default StyledComponentsStyleTypeTemplate;
