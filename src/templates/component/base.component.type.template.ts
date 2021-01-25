// Builders
import JSTemplateBuilder from '../../builders/js-template.builder';

export interface BaseComponentTypeTemplateI {
	new (
		template: JSTemplateBuilder,
		element: JSTemplateBuilder,
		name: string,
		typescript: boolean
	): BaseComponentTypeTemplate;
	build(): void;
}

abstract class BaseComponentTypeTemplate {
	constructor(
		protected template: JSTemplateBuilder,
		protected element: JSTemplateBuilder,
		protected name: string,
		protected typescript: boolean
	) {}

	abstract build(): void;
}

export default BaseComponentTypeTemplate;
