// Libs
import j, { JSXAttribute } from 'jscodeshift';
import { DeclarationKind } from 'ast-types/gen/kinds';

// Utils
import { getDependencyVersion, doesDependencyExists } from '../../utils/dependency';

// Types
import { ComponentConfig } from '../../configuration';

// Base
import BaseTemplate from '../base.template';

class ComponentTemplate extends BaseTemplate {
	constructor(private readonly name: string, private readonly config: ComponentConfig) {
		super();
	}

	build() {
		const template = j('');
		const body = [];
		const reactVersion = getDependencyVersion('react');
		const isReactNative = doesDependencyExists('react-native');
		let elementTag = isReactNative ? 'View' : 'div';
		let elementAttributes: Array<JSXAttribute> = [];
		let component: DeclarationKind;

		if (this.config.class || !reactVersion || reactVersion < 17.01) {
			body.push(
				j.importDeclaration(
					[j.importDefaultSpecifier(j.identifier('React'))],
					j.literal('react')
				)
			);
		}

		if (this.config.testId) {
			elementAttributes.push(
				j.jsxAttribute(
					j.jsxIdentifier('data-testid'),
					j.stringLiteral('ComponentName')
				)
			);
		}

		const element = j.jsxElement(
			j.jsxOpeningElement(j.jsxIdentifier(elementTag), elementAttributes),
			j.jsxClosingElement(j.jsxIdentifier(elementTag))
		);

		if (isReactNative) {
			body.unshift(
				j.importDeclaration(
					[j.importSpecifier(j.identifier('View'))],
					j.literal('react-native')
				)
			);
		}

		const componentIdentifier = j.identifier(this.name);

		if (this.config.typescript) {
			componentIdentifier.typeAnnotation = j.typeAnnotation(
				j.genericTypeAnnotation(
					j.qualifiedTypeIdentifier(
						j.identifier('React'),
						j.identifier('FunctionComponent')
					),
					j.typeParameterInstantiation([
						j.genericTypeAnnotation(j.identifier(this.name + 'Props'), null),
					])
				)
			);
		}

		if (this.config.class) {
			component = j.classDeclaration(
				j.identifier(this.name),
				j.classBody([
					j.classMethod(
						'method',
						j.identifier('render'),
						[],
						j.blockStatement([j.returnStatement(element)])
					),
				]),
				j.memberExpression(
					j.identifier('React'),
					j.identifier('Component'),
					false
				)
			);

			if (this.config.typescript) {
				component.superTypeParameters = j.typeParameterInstantiation([
					j.genericTypeAnnotation(j.identifier(this.name + 'Props'), null),
				]);
			}
		} else {
			component = j.variableDeclaration('const', [
				j.variableDeclarator(
					componentIdentifier,
					j.arrowFunctionExpression(
						[j.tsParameterProperty(j.identifier('props'))],
						j.blockStatement([j.returnStatement(element)])
					)
				),
			]);
		}

		if (this.config.defaultExport) {
			body.push(component);
			body.push(j.exportDeclaration(true, j.identifier(this.name)));
		} else {
			body.push(j.exportDeclaration(false, component));
		}

		template.get().value.program.body = body;

		return template.toSource();
	}
}

export default ComponentTemplate;
