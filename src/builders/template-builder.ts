import _ from 'lodash';

interface InsertOptions {
	newLine?: {
		beforeCount?: number;
		afterCount?: number;
	};
	insertAfter?: string;
	insertBefore?: string;
}

class TemplateBuilder {
	private template: string = '';
	private config;

	constructor(config?: { indent?: number }) {
		this.config = config;
	}

	private lineAfterIndex(content: string, text: string) {
		const index = content.lastIndexOf(text) + 1;
		const endIndex = content.substr(index).indexOf(';') + index + 2;

		return endIndex;
	}

	private lineBeforeIndex(content: string, text: string) {
		const index = content.lastIndexOf(text);
		const endIndex = content.substr(0, index).lastIndexOf('\n');

		return endIndex;
	}

	private insertOnIndex(content: string, insert: string, index: number) {
		return content.substr(0, index) + insert + content.substr(index);
	}

	private indent(str: string) {
		const space = new Array(this.config?.indent).fill(' ').join('');
		return _.replace(str, /{{{indent}}}/g, space);
	}

	public insert(content: string, options?: InsertOptions): string {
		const newLineBefore = options?.newLine?.beforeCount
			? new Array(options.newLine.beforeCount).fill('\n').join('')
			: '';
		const newLineAfter = options?.newLine?.afterCount
			? new Array(options.newLine.afterCount).fill('\n').join('')
			: '';
		const draft = newLineBefore + content + newLineAfter;

		if (options?.insertAfter) {
			const index = this.lineAfterIndex(this.toString(), options.insertAfter);
			this.template = this.insertOnIndex(this.template, draft, index);
		} else if (options?.insertBefore) {
			const index = this.lineBeforeIndex(this.template.toString(), options?.insertBefore);
			this.template = this.insertOnIndex(this.template, draft, index);
		} else {
			this.template = this.template + draft;
		}

		this.template = this.indent(this.template);

		return this.template;
	}

	public override(content: string) {
		this.template = content;
	}

	public toString(): string {
		return this.template;
	}
}

export default TemplateBuilder;
