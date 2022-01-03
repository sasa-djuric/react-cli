import j from 'jscodeshift';
import casing from 'case';
import BaseTemplate from '../base.template';
import { StorybookConfig } from '../../configuration';
import { toImportPath } from '../../utils/path';
import { getDependencyVersion } from '../../utils/dependency';
import { constructTemplate } from '../../utils/template';

class StoryBookTemplate extends BaseTemplate {
	constructor(
		private componentName: string,
		private importPath: string,
		private config: StorybookConfig,
		private componentDefaultImport: boolean,
		private componentType: string
	) {
		super();
	}

	build(): string {
		const body = [];
		const reactVersion = getDependencyVersion('react');

		if (!reactVersion || reactVersion < 17.01) {
			body.push(
				j.importDeclaration(
					[j.importDefaultSpecifier(j.identifier('React'))],
					j.literal('react')
				)
			);
		}

		if (this.config.typescript) {
			body.push(
				j.importDeclaration(
					[
						j.importSpecifier(j.identifier('Meta')),
						j.importSpecifier(j.identifier('Story')),
					],
					j.literal('@storybook/react')
				)
			);
		}

		const componentImportSpecifier = this.componentDefaultImport
			? j.importDefaultSpecifier
			: j.importSpecifier;

		body.push(
			j.importDeclaration(
				[componentImportSpecifier(j.identifier(this.componentName))],
				j.literal(toImportPath(this.importPath))
			)
		);

		const metaObject = j.objectExpression([
			j.objectProperty(
				j.identifier('title'),
				j.literal(`${casing.pascal(this.componentType)}/${this.componentName}`)
			),
			j.objectProperty(j.identifier('component'), j.identifier(this.componentName)),
		]);

		if (this.config.typescript) {
			body.push(
				j.exportDefaultDeclaration(
					j.tsAsExpression(metaObject, j.tsTypeReference(j.identifier('Meta')))
				)
			);
		} else {
			body.push(j.exportDefaultDeclaration(metaObject));
		}

		const templateComponentIdentifier = j.identifier('Template');

		if (this.config.typescript) {
			templateComponentIdentifier.typeAnnotation = j.typeAnnotation(
				j.genericTypeAnnotation(j.identifier('Story'), null)
			);
		}

		body.push(
			j.variableDeclaration('const', [
				j.variableDeclarator(
					templateComponentIdentifier,
					j.arrowFunctionExpression(
						[j.identifier('props')],
						j.jsxElement(
							j.jsxOpeningElement(
								j.jsxIdentifier(this.componentName),
								[j.jsxSpreadAttribute(j.identifier('props'))],
								true
							)
						)
					)
				),
			])
		);

		body.push(
			'\n',
			j.exportNamedDeclaration(
				j.variableDeclaration('const', [
					j.variableDeclarator(
						j.identifier('Default'),
						j.callExpression(
							j.memberExpression(
								j.identifier('Template'),
								j.identifier('bind')
							),
							[j.objectExpression([])]
						)
					),
				])
			)
		);

		body.push(
			'\n',
			j.expressionStatement(
				j.assignmentExpression(
					'=',
					j.memberExpression(j.identifier('Default'), j.identifier('args')),
					j.objectExpression([])
				)
			)
		);

		return constructTemplate(body);
	}
}

export default StoryBookTemplate;
