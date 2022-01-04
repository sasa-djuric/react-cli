import j from 'jscodeshift';
import BaseTemplate from '../base.template';
import { parser } from '../../parser';
import { addImport, insertAfterComponentDeclaration } from '../../utils/template';

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

		const defaultExportSpecifier = root.find(j.ExportDefaultDeclaration).at(0);
		const arrowFunction = root.find(j.ArrowFunctionExpression).at(0);

		if (defaultExportSpecifier.paths().length) {
			defaultExportSpecifier.get().value.declaration = j.callExpression(
				j.callExpression(j.identifier('connect'), [
					j.identifier('mapStateToProps'),
					j.identifier('mapDispatchToProps'),
				]),
				[j.identifier(defaultExportSpecifier.get().value.declaration.name)]
			);
		} else if (arrowFunction.paths().length) {
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

		insertAfterComponentDeclaration(root, mapStateDeclaration);
		insertAfterComponentDeclaration(root, mapDispatchDeclaration);

		return root.toSource({ lineTerminator: '\n' });
	}
}

export default ReduxTemplate;
