// Libs
import j, { ExportDefaultDeclaration, ExportSpecifier } from 'jscodeshift';

// Types
import { ContextConfig } from '../../configuration';
import { constructTemplate } from '../../utils/template';

// Base
import BaseTemplate from '../base.template';

class ContextTemplate extends BaseTemplate {
	constructor(private name: string, private config: ContextConfig) {
		super();
	}

	build() {
		const body = [];
		const pureName = this.name.replace(/context/i, '');
		const interfaceName = `I${this.name}`;

		const exportSpecifiers: Array<ExportSpecifier> = [];
		const exportDeclaration = j.exportNamedDeclaration(null, exportSpecifiers);
		let exportDefaultDeclaration: ExportDefaultDeclaration | null = null;

		const importDeclaration = j.importDeclaration(
			[j.importSpecifier(j.identifier('createContext'))],
			j.literal('react')
		);

		body.push(importDeclaration);

		if (this.config.typescript) {
			body.push(
				j.interfaceDeclaration(
					j.identifier(interfaceName),
					j.objectTypeAnnotation([]),
					[]
				)
			);
		}

		const createContextExpression = j.callExpression(j.identifier('createContext'), [
			j.nullLiteral(),
		]);

		if (this.config.typescript) {
			createContextExpression.typeArguments = j.typeParameterInstantiation([
				j.unionTypeAnnotation([
					j.genericTypeAnnotation(j.identifier(interfaceName), null),
					j.nullTypeAnnotation(),
				]),
			]);
		}

		const context = j.variableDeclaration('const', [
			j.variableDeclarator(j.identifier(this.name), createContextExpression),
		]);

		const providerDestructureProperty = j.objectProperty(
			j.identifier('Provider'),
			j.identifier(this.config.customProvider ? 'Provider' : `${pureName}Provider`)
		);

		if (this.config.customProvider) {
			providerDestructureProperty.shorthand = true;
		}

		const destructureContextProperties = [
			j.objectProperty(
				j.identifier('Consumer'),
				j.identifier(`${pureName}Consumer`)
			),
		];

		if (!this.config.customProvider) {
			destructureContextProperties.push(providerDestructureProperty);
		}

		if (this.config.export.default) {
			if (
				this.config.export.inline &&
				!(this.config.hook || this.config.customProvider)
			) {
				exportDefaultDeclaration = j.exportDefaultDeclaration(
					createContextExpression
				);
			} else {
				body.push(context);
				exportDefaultDeclaration = j.exportDefaultDeclaration(
					j.identifier(this.name)
				);
			}
		} else if (this.config.export.destructure) {
			if (this.config.export.inline) {
				body.push(
					j.variableDeclaration('const', [
						j.variableDeclarator(
							j.identifier(this.name),
							createContextExpression
						),
					])
				);

				body.push(
					j.exportDeclaration(
						false,
						j.variableDeclaration('const', [
							j.variableDeclarator(
								j.objectPattern(destructureContextProperties),
								j.identifier(this.name)
							),
						])
					)
				);
			} else {
				body.push(
					j.variableDeclaration('const', [
						j.variableDeclarator(
							j.identifier(this.name),
							createContextExpression
						),
					])
				);

				body.push(
					j.variableDeclaration('const', [
						j.variableDeclarator(
							j.objectPattern([
								providerDestructureProperty,
								j.objectProperty(
									j.identifier('Consumer'),
									j.identifier(`${pureName}Consumer`)
								),
							]),
							j.identifier(this.name)
						),
					])
				);

				const consumerSpecifier: ExportSpecifier = {
					type: 'ExportSpecifier',
					local: j.identifier(`${pureName}Consumer`),
					exported: j.identifier(`${pureName}Consumer`),
				};

				exportSpecifiers.push(consumerSpecifier);

				if (!this.config.customProvider) {
					const providerSpecifier: ExportSpecifier = {
						type: 'ExportSpecifier',
						local: j.identifier(`${pureName}Provider`),
						exported: j.identifier(`${pureName}Provider`),
					};

					exportSpecifiers.push(providerSpecifier);
				}
			}
		} else {
			if (this.config.export.inline) {
				body.push(j.exportDeclaration(false, context));
			} else {
				body.push(context);

				const specifier: ExportSpecifier = {
					type: 'ExportSpecifier',
					local: j.identifier(this.name),
					exported: j.identifier(this.name),
				};

				exportSpecifiers.push(specifier);
			}
		}

		if (this.config.customProvider) {
			const providerIdentifier = j.identifier(`${pureName}Provider`);

			if (this.config.typescript) {
				providerIdentifier.typeAnnotation = j.typeAnnotation(
					j.genericTypeAnnotation(
						j.qualifiedTypeIdentifier(
							j.identifier('React'),
							j.identifier('FunctionComponent')
						),
						null
					)
				);
			}

			const childrenProperty = j.objectProperty(
				j.identifier('children'),
				j.identifier('children')
			);

			childrenProperty.shorthand = true;

			const providerElementIdentifier =
				!this.config.export.default &&
				this.config.export.destructure &&
				!(this.config.export.destructure && this.config.export.inline)
					? j.jsxIdentifier('Provider')
					: j.jsxMemberExpression(
							j.jsxIdentifier(this.name),
							j.jsxIdentifier('Provider')
					  );

			const providerDeclaration = j.variableDeclaration('const', [
				j.variableDeclarator(
					providerIdentifier,
					j.arrowFunctionExpression(
						[j.objectPattern([childrenProperty])],
						j.blockStatement([
							j.returnStatement(
								j.jsxElement(
									j.jsxOpeningElement(providerElementIdentifier, [
										j.jsxAttribute(
											j.jsxIdentifier('value'),
											j.jsxExpressionContainer(
												j.jsxEmptyExpression()
											)
										),
									]),
									j.jsxClosingElement(providerElementIdentifier),
									[
										j.jsxExpressionContainer(
											j.jsxIdentifier('children')
										),
									]
								)
							),
						])
					)
				),
			]);

			if (this.config.export.inline) {
				body.push(j.exportNamedDeclaration(providerDeclaration));
			} else {
				const identifier = { ...providerIdentifier };
				const specifier: ExportSpecifier = {
					type: 'ExportSpecifier',
					local: identifier,
					exported: identifier,
				};

				delete identifier.typeAnnotation;

				body.push(providerDeclaration);
				exportSpecifiers.push(specifier);
			}
		}

		if (this.config.hook) {
			importDeclaration.specifiers!.push(
				j.importSpecifier(j.identifier('useContext'))
			);

			const identifier = j.identifier(`use${pureName}`);

			const hookDeclaration = j.variableDeclaration('const', [
				j.variableDeclarator(
					identifier,
					j.arrowFunctionExpression(
						[],
						j.blockStatement([
							j.variableDeclaration('const', [
								j.variableDeclarator(
									j.identifier('context'),
									j.callExpression(j.identifier('useContext'), [
										j.identifier(this.name),
									])
								),
							]),
							j.ifStatement(
								j.unaryExpression('!', j.identifier('context')),
								j.blockStatement([
									j.throwStatement(
										j.newExpression(j.identifier('Error'), [
											j.stringLiteral(
												`${this.name} should be used within ${pureName}Provider`
											),
										])
									),
								])
							),
							j.returnStatement(j.identifier('context')),
						])
					)
				),
			]);

			if (this.config.export.inline) {
				body.push(j.exportNamedDeclaration(hookDeclaration));
			} else {
				const specifier: ExportSpecifier = {
					type: 'ExportSpecifier',
					local: identifier,
					exported: identifier,
				};

				body.push(hookDeclaration);
				exportSpecifiers.push(specifier);
			}
		}

		if (exportSpecifiers.length) {
			body.push(exportDeclaration);
		}

		if (exportDefaultDeclaration) {
			body.push(exportDefaultDeclaration);
		}

		return constructTemplate(body);
	}
}

export default ContextTemplate;
