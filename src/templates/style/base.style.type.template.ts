import TemplateBuilder from '../../builders/base-template.builder';
import JSTemplateBuilder from '../../builders/js-template.builder';
import { StyleConfig } from '../../configuration';

export interface BaseStyleTypeTemplateI {
	new (name: string, config: StyleConfig): BaseStyleTypeTemplate;
	build(): TemplateBuilder;
}

abstract class BaseStyleTypeTemplate {
	constructor(protected name: string, protected config: StyleConfig) {}

	abstract build(): TemplateBuilder;

	abstract include(
		template: JSTemplateBuilder,
		name: string,
		importPath: string,
		elementAction: any
	): void;
}

export default BaseStyleTypeTemplate;
