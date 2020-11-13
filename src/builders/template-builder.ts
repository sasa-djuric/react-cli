// @ts-ignore
import indentJs from 'indent.js';

export interface InsertOptions {
	newLine?: {
		beforeCount?: number;
		afterCount?: number;
	};
	insertAfter?: string;
	insertBefore?: string;
	insertAtIndex?: number;
}

export type fileType = 'js' | 'ts' | 'css' | 'scss';

class TemplateBuilder {
	private template: string = '';

	constructor(private fileType: fileType) {}

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

	private insertAtIndex(content: string, insert: string, index: number) {
		return content.substr(0, index) + insert + content.substr(index);
	}

	private indent(code: string) {
		const indent = new Array(1).fill('\t').join('');
		return indentJs[this.fileType](code, { tabString: indent });
	}

	public wrap(wrapAfterIndexOf: string, wrapToIndexOf: string, strBefore: string, strAfter: string) {
		const startIndex = this.template.indexOf(wrapAfterIndexOf) + wrapAfterIndexOf.length;
		const exportName = this.template.substr(
			startIndex,
			this.template.lastIndexOf(wrapToIndexOf) - startIndex
		);
		const start = this.template.substr(0, startIndex);
		const wrappedExport = strBefore + exportName + strAfter;
		const endStartIndex = startIndex + exportName.length;
		const end = this.template.substr(endStartIndex);
		const template = start + wrappedExport + end;

		this.override(template);
	}

	public insert(content: string, options?: InsertOptions) {
		const newLineBefore = options?.newLine?.beforeCount
			? new Array(options.newLine.beforeCount).fill('\n').join('')
			: '';
		const newLineAfter = options?.newLine?.afterCount
			? new Array(options.newLine.afterCount).fill('\n').join('')
			: '';
		const draft = newLineBefore + content + newLineAfter;

		if (options?.insertAfter) {
			const index = this.lineAfterIndex(this.template, options.insertAfter);
			this.template = this.insertAtIndex(this.template, draft, index);
		} else if (options?.insertBefore) {
			const index = this.lineBeforeIndex(this.template, options?.insertBefore);
			this.template = this.insertAtIndex(this.template, draft, index);
		} else if (options?.insertAtIndex) {
			this.template = this.insertAtIndex(this.template, content, options.insertAtIndex);
		} else {
			this.template = this.template + draft;
		}

		return this;
	}

	public override(content: string) {
		this.template = content;

		return this;
	}

	public toString(): string {
		return this.indent(this.template);
	}
}

export default TemplateBuilder;
