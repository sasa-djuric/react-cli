import j from 'jscodeshift';
import { namedTypes } from 'ast-types/gen/namedTypes';
import BaseTemplate from '../base.template';
import { toImportPath } from '../../utils/path';
import { constructTemplate, formatTemplate } from '../../utils/template';

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

	include(source: string) {
		const root = j(source);
		const lastExportDeclaration = root.find(j.ExportDeclaration);

		let exportDeclaration;

		if (this.exportProp === 'all') {
			exportDeclaration = j.exportAllDeclaration(
				j.stringLiteral(toImportPath(this.importPath)),
				null
			);
		} else {
			const specifier: namedTypes.ExportSpecifier = {
				type: 'ExportSpecifier',
				local: j.identifier('default'),
				exported: j.identifier('default'),
			};

			exportDeclaration = j.exportNamedDeclaration(
				null,
				[specifier],
				j.stringLiteral(toImportPath(this.importPath))
			);
		}

		if (lastExportDeclaration.paths().length) {
			lastExportDeclaration.insertAfter(exportDeclaration);
		} else {
			root.get().value.program.body.push(exportDeclaration);
		}

		return formatTemplate(root.toSource({ lineTerminator: '\n' }));
	}
}

export default IndexTemplate;
