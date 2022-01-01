// Libs
import j from 'jscodeshift';

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

		const hook = j.variableDeclaration('const', [
			j.variableDeclarator(
				j.identifier(this.name),
				j.arrowFunctionExpression([], j.blockStatement([]))
			),
		]);

		if (this.config.defaultExport) {
			body.push(
				j.exportDefaultDeclaration(
					j.arrowFunctionExpression([], j.blockStatement([]))
				)
			);
		} else {
			body.push(j.exportDeclaration(false, hook));
		}

		return constructTemplate(body);
	}
}

export default HookTemplate;
