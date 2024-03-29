import j, { JSXElement } from 'jscodeshift';
import casing from 'case';
import BaseStyleTypeTemplate from './base.style.type.template';
import CSSTemplateBuilder from '../../builders/css-template.builder';
import { CSSStyleType } from '../../configuration';
import { parser } from '../../parser';
import { toImportPath } from '../../utils/path';
import { addImport } from '../../utils/template';

class CSSStyleTypeTemplate extends BaseStyleTypeTemplate {
	build() {
		const template = new CSSTemplateBuilder(this.config.type as CSSStyleType);
		const className = casing.kebab(this.name);
		template.insertClass(className);
		return template.toString();
	}

	include(template: string, name: string, importPath: string) {
		const root = j(template, { parser });
		const className = casing.kebab(name);

		addImport(
			root,
			j.importDeclaration(
				this.config.modules
					? [j.importDefaultSpecifier(j.identifier('styles'))]
					: [],
				j.literal(toImportPath(importPath))
			)
		);

		const jsxElement: JSXElement = root.findJSXElements().at(0).get().value;
		const isValidClassName = !className.includes('-');

		jsxElement.openingElement.attributes?.unshift(
			j.jsxAttribute(
				j.jsxIdentifier('className'),
				this.config.modules
					? j.jsxExpressionContainer(
							j.memberExpression(
								j.identifier('styles'),
								isValidClassName
									? j.identifier(className)
									: j.stringLiteral(className),
								!isValidClassName
							)
					  )
					: j.stringLiteral(className)
			)
		);

		return root.toSource({ lineTerminator: '\n' });
	}
}

export default CSSStyleTypeTemplate;
