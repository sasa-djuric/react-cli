import { cssStyleType } from '../types/config';
import TemplateBuilder, { InsertOptions } from './template-builder';

class CSSTemplateBuilder extends TemplateBuilder {
	constructor(private type: cssStyleType) {
		super('css');
	}

	private format(content: string) {
		if (this.type === 'sass') {
			return content.replace(/{|}/g, '');
		}

		return content;
	}

	public insertClass(className: string, content?: string, insertOptions?: InsertOptions) {
		const draft = `.${className} {\n\n}`;

		return this.insert(this.format(draft), insertOptions);
	}
}

export default CSSTemplateBuilder;
