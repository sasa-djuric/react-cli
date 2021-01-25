import BaseTemplate from '../base.template';
import { StyleConfig } from '../../configuration';
import { BaseStyleTypeTemplateI } from './base.style.type.template';
import JSTemplateBuilder, {
	JSBuilderActionType,
} from '../../builders/js-template.builder';

class StyleTemplate extends BaseTemplate {
	constructor(
		private name: string,
		private config: StyleConfig,
		private StyleTypeTemplate: BaseStyleTypeTemplateI
	) {
		super();
	}

	build() {
		const { name, config, StyleTypeTemplate } = this;

		return new StyleTypeTemplate(name, config).build();
	}

	include(template: JSTemplateBuilder, filePath: string) {
		let action;
		const { name, config, StyleTypeTemplate } = this;
		const functionAction = template
			.getActionsByType(JSBuilderActionType.Function)
			?.find((action) =>
				action?.args[0]?.content?.getActionsByType(JSBuilderActionType.Element)
			);
		const classAction = template
			.getActionsByType(JSBuilderActionType.Class)
			?.find((action) => action.args[0]?.methods?.[0]?.content);

		if (functionAction) {
			action = functionAction?.args[0].content;
		}

		if (classAction) {
			action = classAction?.args[0]?.methods?.[0]?.content;
		}

		const elementAction = action?.getActionsByType(JSBuilderActionType.Element)?.[0]
			?.args?.[0];

		new StyleTypeTemplate(name, config).include(
			template,
			name,
			filePath,
			elementAction
		);
	}
}

export default StyleTemplate;
