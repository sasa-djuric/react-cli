import { CSSStyleType } from '../configuration';
import TemplateBuilder from './base-template.builder';

class CSSTemplateBuilder extends TemplateBuilder {
	constructor(private type: CSSStyleType) {
		super('css');
	}

	private format(content: string) {
		if (this.type === 'sass') {
			return content.replace(/{|}/g, '');
		}

		return content;
	}

	public insertClass(className: string) {
		const draft = `.${className} {\n\n}`;
		return this.insert(this.format(draft));
	}
}

export default CSSTemplateBuilder;
