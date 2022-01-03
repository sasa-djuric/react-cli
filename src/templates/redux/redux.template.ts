import j from 'jscodeshift';
import BaseTemplate from '../base.template';
import { parser } from '../../parser';

class ReduxTemplate extends BaseTemplate {
	build(): string {
		throw new Error('Method not implemented.');
	}

	include(template: string, typescript: boolean) {
		const root = j(template, { parser });
		const lastImportDeclaration = root.find(j.ImportDeclaration).at(-1);

		const importDeclaration = j.importDeclaration(
			[j.importSpecifier(j.identifier('connect'))],
			j.literal('react-redux')
		);

		if (lastImportDeclaration.paths().length) {
			lastImportDeclaration.insertAfter(importDeclaration);
		} else {
			root.get().value.program.body.unshift(importDeclaration);
		}

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
		const lastExportDeclaration = root.find(j.ExportNamedDeclaration).at(-1);

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

		if (defaultExportSpecifier.paths().length) {
			defaultExportSpecifier.get().insertBefore(mapStateDeclaration);
			defaultExportSpecifier.get().insertBefore(mapDispatchDeclaration);
		} else {
			lastExportDeclaration.get().insertAfter(mapStateDeclaration);
			lastExportDeclaration.get().insertAfter(mapDispatchDeclaration);
		}

		return root.toSource({ lineTerminator: '\n' });
	}
}

export default ReduxTemplate;
