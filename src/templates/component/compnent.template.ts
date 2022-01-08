// Libs
import j, { ExportSpecifier, JSXAttribute } from 'jscodeshift';

// Utils
import { getDependencyVersion, doesDependencyExists } from '../../utils/dependency';
import { constructTemplate } from '../../utils/template';

// Types
import { ComponentConfig } from '../../configuration';

// Base
import BaseTemplate from '../base.template';

class ComponentTemplate extends BaseTemplate {
	constructor(private readonly name: string, private readonly config: ComponentConfig) {
		super();
	}

	build() {
		const body = [];
		const reactVersion = getDependencyVersion('react');
		const isReactNative = doesDependencyExists('react-native');
		const propsInterfaceName = this.name + 'Props';
		let elementTag = isReactNative ? 'View' : 'div';
		let elementAttributes: Array<JSXAttribute> = [];

		if (this.config.class || !reactVersion || reactVersion < 17.01) {
			body.push(
				j.importDeclaration(
					[j.importDefaultSpecifier(j.identifier('React'))],
					j.literal('react')
				)
			);
		}

		if (isReactNative) {
			body.unshift(
				j.importDeclaration(
					[j.importSpecifier(j.identifier('View'))],
					j.literal('react-native')
				)
			);
		}

		if (this.config.typescript) {
			const interfaceDeclaration = j.interfaceDeclaration(
				j.identifier(propsInterfaceName),
				j.objectTypeAnnotation([]),
				[]
			);

			if (this.config.story) {
				body.push(j.exportDeclaration(false, interfaceDeclaration));
			} else {
				body.push(interfaceDeclaration);
			}
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
						j.genericTypeAnnotation(j.identifier(propsInterfaceName), null),
					])
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

		if (this.config.class) {
			const classDeclaration = j.classDeclaration(
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
				classDeclaration.superTypeParameters = j.typeParameterInstantiation([
					j.genericTypeAnnotation(j.identifier(propsInterfaceName), null),
				]);
			}

			if (this.config.export.default) {
				if (this.config.export.inline) {
					body.push(j.exportDefaultDeclaration(classDeclaration));
				} else {
					body.push(classDeclaration);
					body.push(j.exportDefaultDeclaration(j.identifier(this.name)));
				}
			} else {
				if (this.config.export.inline) {
					body.push(j.exportNamedDeclaration(classDeclaration));
				} else {
					const exportSpecifier: ExportSpecifier = {
						type: 'ExportSpecifier',
						exported: j.identifier(this.name),
						local: j.identifier(this.name),
					};

					body.push(classDeclaration);
					body.push(j.exportNamedDeclaration(null, [exportSpecifier]));
				}
			}
		} else {
			const functionDeclaration = j.arrowFunctionExpression(
				[j.tsParameterProperty(j.identifier('props'))],
				j.blockStatement([j.returnStatement(element)])
			);
			const variableDeclaration = j.variableDeclaration('const', [
				j.variableDeclarator(componentIdentifier, functionDeclaration),
			]);

			if (this.config.export.default) {
				if (this.config.export.inline && !this.config.proptypes) {
					body.push(j.exportDefaultDeclaration(functionDeclaration));
				} else {
					body.push(variableDeclaration);
					body.push(j.exportDeclaration(true, j.identifier(this.name)));
				}
			} else {
				if (this.config.export.inline) {
					body.push(j.exportNamedDeclaration(variableDeclaration));
				} else {
					const exportSpecifier: ExportSpecifier = {
						type: 'ExportSpecifier',
						exported: j.identifier(this.name),
						local: j.identifier(this.name),
					};

					body.push(variableDeclaration);
					body.push(j.exportNamedDeclaration(null, [exportSpecifier]));
				}
			}
		}

		return constructTemplate(body);
	}
}

export default ComponentTemplate;
