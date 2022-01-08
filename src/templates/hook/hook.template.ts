// Libs
import j, { ExportSpecifier } from 'jscodeshift';

// Types
import { HookConfig } from '../../configuration';
import { constructTemplate } from '../../utils/template';

// Base
import BaseTemplate from '../base.template';

class HookTemplate extends BaseTemplate {
	constructor(private name: string, private config: HookConfig) {
		super();
	}

	build() {
		const body = [];

		const hookFunction = j.arrowFunctionExpression([], j.blockStatement([]));
		const hookVariableDeclaration = j.variableDeclaration('const', [
			j.variableDeclarator(j.identifier(this.name), hookFunction),
		]);

		if (this.config.export.default) {
			if (this.config.export.inline) {
				body.push(j.exportDefaultDeclaration(hookFunction));
			} else {
				body.push(hookVariableDeclaration);
				body.push(j.exportDeclaration(true, j.identifier(this.name)));
			}
		} else {
			if (this.config.export.inline) {
				body.push(j.exportDeclaration(false, hookVariableDeclaration));
			} else {
				const exportSpecifier: ExportSpecifier = {
					type: 'ExportSpecifier',
					exported: j.identifier(this.name),
					local: j.identifier(this.name),
				};

				body.push(hookVariableDeclaration);
				body.push(j.exportNamedDeclaration(null, [exportSpecifier]));
			}
		}

		return constructTemplate(body);
	}
}

export default HookTemplate;
