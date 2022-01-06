// Libs
import j, { ExportSpecifier } from 'jscodeshift';

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

		if (this.config.export.default) {
			body.push(context);
			body.push(j.exportDefaultDeclaration(j.identifier(this.name)));
		} else if (this.config.export.destructure) {
			body.push(context);
			body.push(
				j.exportDeclaration(
					false,
					j.variableDeclaration('const', [
						j.variableDeclarator(
							j.objectPattern([
								j.objectProperty(
									j.identifier('Provider'),
									j.identifier(`${pureName}Provider`)
								),
								j.objectProperty(
									j.identifier('Consumer'),
									j.identifier(`${pureName}Consumer`)
								),
							]),
							this.config.export.inline
								? createContextExpression
								: j.identifier(this.name)
						),
					])
				)
			);
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

				body.push(j.exportNamedDeclaration(null, [specifier]));
			}
		}

		if (this.config.hook) {
			importDeclaration.specifiers!.push(
				j.importSpecifier(j.identifier('useContext'))
			);

			const hookDeclaration = j.exportNamedDeclaration(
				j.variableDeclaration('const', [
					j.variableDeclarator(
						j.identifier(`use${pureName}`),
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
				])
			);

			if (
				body[body.length - 1].type === 'ExportNamedDeclaration' ||
				body[body.length - 1].type === 'ExportDefaultDeclaration'
			) {
				body.splice(body.length - 1, 0, hookDeclaration);
			} else {
				body.push(hookDeclaration);
			}
		}

		return constructTemplate(body);
	}
}

export default ContextTemplate;
