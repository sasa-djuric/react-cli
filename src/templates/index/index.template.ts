import j from 'jscodeshift';
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
			body.push(
				j.exportDeclaration(
					false,
					null,
					[j.exportSpecifier(j.identifier('default'), null)],
					j.literal(toImportPath(this.importPath))
				)
			);
		}

		return constructTemplate(body);
	}
}

export default IndexTemplate;
