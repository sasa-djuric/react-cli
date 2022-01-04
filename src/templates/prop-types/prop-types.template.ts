import j from 'jscodeshift';
import BaseTemplate from '../base.template';
import { parser } from '../../parser';
import { addImport, insertAfterComponentDeclaration } from '../../utils/template';

class PropTypesTemplate extends BaseTemplate {
	build(): string {
		throw new Error('Method not implemented.');
	}

	include(template: string, componentName: string) {
		const root = j(template, { parser });

		addImport(
			root,
			j.importDeclaration(
				[j.importDefaultSpecifier(j.identifier('PropTypes'))],
				j.literal('prop-types')
			)
		);

		insertAfterComponentDeclaration(
			root,
			j.expressionStatement(
				j.assignmentExpression(
					'=',
					j.memberExpression(
						j.identifier(componentName),
						j.identifier('propTypes')
					),
					j.objectExpression([])
				)
			)
		);

		return root.toSource({ lineTerminator: '\n' });
	}
}

export default PropTypesTemplate;
