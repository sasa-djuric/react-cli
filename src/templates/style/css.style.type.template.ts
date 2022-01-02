import j, { JSXElement } from 'jscodeshift';
import casing from 'case';
import BaseStyleTypeTemplate from './base.style.type.template';
import CSSTemplateBuilder from '../../builders/css-template.builder';
import { cssStyleType } from '../../configuration';
import { parser } from '../../parser';
import { toImportPath } from '../../utils/path';

class CSSStyleTypeTemplate extends BaseStyleTypeTemplate {
	build() {
		const template = new CSSTemplateBuilder(this.config.type as cssStyleType);
		const className = casing.kebab(this.name);
		template.insertClass(className);
		return template.toString();
	}

	include(template: string, name: string, importPath: string) {
		const root = j(template, { parser });
		const className = casing.kebab(name);

		root.find(j.ImportDeclaration)
			.at(-1)
			.insertAfter(
				j.importDeclaration(
					this.config.modules
						? [j.importDefaultSpecifier(j.identifier('styles'))]
						: [],
					j.literal(toImportPath(importPath))
				)
			);

		const jsxElement: JSXElement = root.findJSXElements().at(0).get().value;

		jsxElement.openingElement.attributes?.push(
			j.jsxAttribute(
				j.jsxIdentifier('className'),
				j.jsxExpressionContainer(
					j.memberExpression(j.identifier('styles'), j.identifier(className))
				)
			)
		);

		return root.toSource();
	}
}

export default CSSStyleTypeTemplate;
