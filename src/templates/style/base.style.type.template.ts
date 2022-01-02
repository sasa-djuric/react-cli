import TemplateBuilder from '../../builders/base-template.builder';
import { StyleConfig } from '../../configuration';

export interface BaseStyleTypeTemplateI {
	new (name: string, config: StyleConfig): BaseStyleTypeTemplate;
	build(): TemplateBuilder;
}

abstract class BaseStyleTypeTemplate {
	constructor(protected name: string, protected config: StyleConfig) {}

	abstract build(): string;

	abstract include(template: string, name: string, importPath: string): string;
}

export default BaseStyleTypeTemplate;
