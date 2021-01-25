import TemplateBuilder from '../builders/base-template.builder';

abstract class BaseTemplate {
	abstract build(): TemplateBuilder;
}

export default BaseTemplate;
