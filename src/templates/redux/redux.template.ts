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

		const defaultExportSpecifier = root.find(j.ExportDefaultDeclaration).at(0);
		const arrowFunction = root.find(j.ArrowFunctionExpression).at(0);

		if (defaultExportSpecifier.paths().length) {
			findRootNode(root.findJSXElements().at(0).get()).insertAfter(
				mapStateDeclaration
			);
			findRootNode(root.findJSXElements().at(0).get()).insertAfter(
				mapDispatchDeclaration
			);

			defaultExportSpecifier.get().value.declaration = j.callExpression(
				j.callExpression(j.identifier('connect'), [
					j.identifier('mapStateToProps'),
					j.identifier('mapDispatchToProps'),
				]),
				[j.identifier(defaultExportSpecifier.get().value.declaration.name)]
			);
		} else if (arrowFunction.paths().length) {
			findRootNode(root.findJSXElements().at(0).get()).insertBefore(
				mapStateDeclaration
			);
			findRootNode(root.findJSXElements().at(0).get()).insertBefore(
				mapDispatchDeclaration
			);

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

		return root.toSource({ lineTerminator: '\n' });
	}
}

export default ReduxTemplate;
