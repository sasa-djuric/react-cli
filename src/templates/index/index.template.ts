import j from 'jscodeshift';
import { namedTypes } from 'ast-types/gen/namedTypes';
import BaseTemplate from '../base.template';
import { toImportPath } from '../../utils/path';
import { constructTemplate } from '../../utils/template';

class IndexTemplate extends BaseTemplate {
	constructor(
		private importPath: string,
		private exportProp: 'default' | 'all' | string
	) {
		super();
	}

	build() {
		const body = [];

		if (this.exportProp === 'all') {
			body.push(
				j.exportAllDeclaration(
					j.stringLiteral(toImportPath(this.importPath)),
					null
				)
			);
		} else {
			const specifier: namedTypes.ExportSpecifier = {
				type: 'ExportSpecifier',
				local: j.identifier('default'),
				exported: j.identifier('default'),
			};

			body.push(
				j.exportNamedDeclaration(
					null,
					[specifier],
					j.stringLiteral(toImportPath(this.importPath))
				)
			);
		}

		return constructTemplate(body);
	}
}

export default IndexTemplate;
