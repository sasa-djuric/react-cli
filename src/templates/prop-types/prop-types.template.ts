import j from 'jscodeshift';
import BaseTemplate from '../base.template';
import { parser } from '../../parser';

class PropTypesTemplate extends BaseTemplate {
	build(): string {
		throw new Error('Method not implemented.');
	}

	include(template: string, componentName: string) {
		const root = j(template, { parser });

		const lastExportDeclaration = root.find(j.ExportNamedDeclaration).at(-1);
		const lastClassDeclaration = root.find(j.ClassDeclaration).at(-1);
		const lastVariableDeclaration = root.find(j.VariableDeclaration).at(-1);
		const lastImportDeclaration = root.find(j.ImportDeclaration).at(-1);

		const importDeclaration = j.importDeclaration(
			[j.importDefaultSpecifier(j.identifier('PropTypes'))],
			j.literal('prop-types')
		);

		if (lastImportDeclaration.paths().length) {
			lastImportDeclaration.get().insertAfter();
		} else {
			root.get().value.program.body.unshift(importDeclaration);
		}

		const propTypesExpression = j.expressionStatement(
			j.assignmentExpression(
				'=',
				j.memberExpression(
					j.identifier(componentName),
					j.identifier('propTypes')
				),
				j.objectExpression([])
			)
		);

		if (lastExportDeclaration.paths().length) {
			lastExportDeclaration.get().insertAfter(propTypesExpression);
		} else if (lastClassDeclaration.paths().length) {
			lastClassDeclaration.get().insertAfter(propTypesExpression);
		} else {
			lastVariableDeclaration.get().insertAfter(propTypesExpression);
		}

		return root.toSource({ lineTerminator: '\n' });
	}
}

export default PropTypesTemplate;
