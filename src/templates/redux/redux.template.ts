import j from 'jscodeshift';
import BaseTemplate from '../base.template';
import { parser } from '../../parser';
import { addImport, findRootNode } from '../../utils/template';

class ReduxTemplate extends BaseTemplate {
	build(): string {
		throw new Error('Method not implemented.');
	}

	include(template: string, typescript: boolean) {
		const root = j(template, { parser });

		addImport(
			root,
			j.importDeclaration(
				[j.importSpecifier(j.identifier('connect'))],
				j.literal('react-redux')
			)
		);

		const stateIdentifier = j.identifier('state');
		const mapStateDeclaration = j.variableDeclaration('const', [
			j.variableDeclarator(
				j.identifier('mapStateToProps'),
				j.arrowFunctionExpression([stateIdentifier], j.blockStatement([]))
			),
		]);

		const dispatchFnIdentifier = j.identifier('dispatch');
		const mapDispatchDeclaration = j.variableDeclaration('const', [
			j.variableDeclarator(
				j.identifier('mapDispatchToProps'),
				j.arrowFunctionExpression([dispatchFnIdentifier], j.blockStatement([]))
			),
		]);

		if (typescript) {
			stateIdentifier.typeAnnotation = j.typeAnnotation(j.anyTypeAnnotation());
			dispatchFnIdentifier.typeAnnotation = j.typeAnnotation(j.anyTypeAnnotation());
		}

		const componentRootElement = findRootNode(root.findJSXElements().at(0).get());
		const componentRootElementValue = componentRootElement.get().value;
		const arrowFunction = root.find(j.ArrowFunctionExpression).at(0);

		if (componentRootElementValue.type === 'ExportDefaultDeclaration') {
			if (componentRootElementValue.declaration.type === 'ClassDeclaration') {
				componentRootElement.insertAfter(mapStateDeclaration);
				componentRootElement.insertAfter(mapDispatchDeclaration);

				root.get().value.program.body.push(
					j.exportDefaultDeclaration(
						j.callExpression(
							j.callExpression(j.identifier('connect'), [
								j.identifier('mapStateToProps'),
								j.identifier('mapDispatchToProps'),
							]),
							[componentRootElementValue.declaration.id]
						)
					)
				);

				componentRootElement.get().replace(componentRootElementValue.declaration);
			} else {
				componentRootElement.get().insertBefore(mapStateDeclaration);
				componentRootElement.get().insertBefore(mapDispatchDeclaration);

				componentRootElement
					.get()
					.replace(
						j.exportDefaultDeclaration(
							j.callExpression(
								j.callExpression(j.identifier('connect'), [
									j.identifier('mapStateToProps'),
									j.identifier('mapDispatchToProps'),
								]),
								[componentRootElementValue.declaration]
							)
						)
					);
			}
		} else if (componentRootElementValue.type === 'ExportNamedDeclaration') {
			if (componentRootElementValue.declaration.type === 'ClassDeclaration') {
				componentRootElement.get().insertBefore(mapStateDeclaration);
				componentRootElement.get().insertBefore(mapDispatchDeclaration);
			} else {
				componentRootElement.get().insertBefore(mapStateDeclaration);
				componentRootElement.get().insertBefore(mapDispatchDeclaration);

				arrowFunction.replaceWith(
					j.callExpression(
						j.callExpression(j.identifier('connect'), [
							j.identifier('mapStateToProps'),
							j.identifier('mapDispatchToProps'),
						]),
						[arrowFunction.get().value]
					)
				);
			}
		} else {
			let componentIdentifier;

			if (componentRootElementValue.type === 'VariableDeclaration') {
				componentIdentifier = componentRootElementValue.declarations[0].id;
			} else {
				componentIdentifier = componentRootElementValue.id;
			}

			const exportNamedIdentifier = root
				.find(j.ExportNamedDeclaration)
				.find(j.Identifier, { name: componentIdentifier.name })
				.at(0);

			const exportDefaultIdentifier = root
				.find(j.ExportDefaultDeclaration)
				.find(j.Identifier, { name: componentIdentifier.name })
				.at(0);

			if (exportNamedIdentifier.paths().length) {
				if (componentRootElementValue.type === 'VariableDeclaration') {
					componentRootElement.get().insertBefore(mapStateDeclaration);
					componentRootElement.get().insertBefore(mapDispatchDeclaration);

					arrowFunction.replaceWith(
						j.callExpression(
							j.callExpression(j.identifier('connect'), [
								j.identifier('mapStateToProps'),
								j.identifier('mapDispatchToProps'),
							]),
							[arrowFunction.get().value]
						)
					);
				} else {
					const exportIdentifierRoot = findRootNode(
						exportNamedIdentifier.get()
					);
					exportIdentifierRoot.get().insertBefore(mapStateDeclaration);
					exportIdentifierRoot.get().insertBefore(mapDispatchDeclaration);
				}
			} else if (exportDefaultIdentifier.paths().length) {
				const exportRoot = findRootNode(exportDefaultIdentifier.get());

				exportRoot.get().insertBefore(mapStateDeclaration);
				exportRoot.get().insertBefore(mapDispatchDeclaration);

				exportDefaultIdentifier
					.get()
					.replace(
						j.callExpression(
							j.callExpression(j.identifier('connect'), [
								j.identifier('mapStateToProps'),
								j.identifier('mapDispatchToProps'),
							]),
							[j.identifier(componentIdentifier.name)]
						)
					);
			}
		}

		return root.toSource({ lineTerminator: '\n' });
	}
}

export default ReduxTemplate;
