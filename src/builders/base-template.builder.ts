// @ts-ignore
import indentJs from 'indent.js';

export type fileType = 'js' | 'ts' | 'css' | 'scss';

export interface InsertOptions {
	newLine?: {
		beforeCount?: number;
		afterCount?: number;
	};
	insertAfter?: string;
	insertBefore?: string;
	insertAtIndex?: number;
}

interface Actions {
	[id: number]: Action;
}

interface Action {
	type: string;
	tag?: string;
	method: Function;
	args: Array<any>;
}

interface ActionResult extends Action {
	id: number;
}

enum ActionType {
	Insert = 'insert',
	Overide = 'overide',
	NewLine = 'newLine',
}

class TemplateBuilder {
	private template: string = '';
	private nextId: number = 0;
	protected actions: Actions = {};

	constructor(private fileType: fileType) {}

	private lineAfter(content: string, text: string) {
		const index = content.lastIndexOf(text) + 1;
		const endIndex = content.substr(index).indexOf(';') + index + 2;

		return index <= 0 ? 0 : endIndex;
	}

	private lineBefore(content: string, text: string) {
		const index = content.lastIndexOf(text);
		const endIndex = content.substr(0, index).lastIndexOf('\n');

		return endIndex;
	}

	private insertAtIndex(content: string, insert: string, index: number) {
		return content.substr(0, index) + insert + content.substr(index);
	}

	private indent(code: string) {
		return indentJs[this.fileType](code, { tabString: '\t' });
	}

	public wrap(
		wrapAfterIndexOf: string,
		wrapToIndexOf: string,
		strBefore: string,
		strAfter: string
	) {
		const startIndexDraft = this.template.indexOf(wrapAfterIndexOf);
		const startIndex = startIndexDraft + wrapAfterIndexOf.length;
		const exportName = this.template.substr(
			startIndex,
			this.template.lastIndexOf(wrapToIndexOf) - startIndex
		);
		const start = this.template.substr(0, startIndex);
		const wrappedExport = strBefore + exportName + strAfter;
		const endStartIndex = startIndex + exportName.length;
		const end = this.template.substr(endStartIndex);

		if (startIndexDraft === -1) {
			return;
		}

		const template = start + wrappedExport + end;

		this._override(template);
	}

	protected _insert(content: string, options?: InsertOptions) {
		const newLineBefore = options?.newLine?.beforeCount
			? new Array(options.newLine.beforeCount).fill('\n').join('')
			: '';
		const newLineAfter = options?.newLine?.afterCount
			? new Array(options.newLine.afterCount).fill('\n').join('')
			: '';
		const draft = newLineBefore + content + newLineAfter;

		if (options?.insertAfter) {
			const index = this.lineAfter(this.template, options.insertAfter);
			this.template = this.insertAtIndex(this.template, draft, index);
		} else if (options?.insertBefore) {
			const index = this.lineBefore(this.template, options?.insertBefore);
			this.template = this.insertAtIndex(this.template, draft, index);
		} else if (options?.insertAtIndex) {
			this.template = this.insertAtIndex(
				this.template,
				content,
				options.insertAtIndex
			);
		} else {
			this.template = this.template + draft;
		}

		return this;
	}

	public insert(content: string, options?: InsertOptions) {
		return this.insertAction({
			type: ActionType.Insert,
			method: this._insert.bind(this),
			args: [content, options],
		});
	}

	private _insertNewLine(count: number = 1, options?: InsertOptions) {
		const lines = new Array(count).fill('\n').join('');
		this.template += lines;
		return this;
	}

	public insertNewLine(count?: number, options?: InsertOptions) {
		return this.insertAction({
			type: ActionType.NewLine,
			method: this._insertNewLine.bind(this),
			args: [count, options],
		});
	}

	private _override(content: string) {
		this.template = content;
		return this;
	}

	public override(content: string) {
		return this.insertAction({
			type: ActionType.Overide,
			method: this._override.bind(this),
			args: [content],
		});
	}

	protected insertAction(options: Action) {
		this.actions[this.nextId++] = options;

		return this;
	}

	public getActionsByType(type: string): ActionResult[] {
		return Object.entries(this.actions).reduce(
			(acc: any, [id, options]: [any, Action]) => {
				if (options.type === type) {
					return [...acc, { id, ...options }];
				}
				return acc;
			},
			[]
		);
	}

	public modifyAction(id: number, options: Action) {
		if (this.actions[id]) {
			this.actions[id] = options;
		}
	}

	public getByTag(tag: string) {
		const id: string | undefined = Object.entries(this.actions).find(
			([key, value]) => value.tag === tag
		)?.[0];

		if (!id) {
			return;
		}

		return this.actions[+id];
	}

	public removeActionById(id: number) {
		delete this.actions[id];
	}

	public get getActions() {
		return this.actions;
	}

	public toString(): string {
		Object.values(this.actions).forEach((action) => {
			action.method(...action.args);
		});

		const template = this.template;

		this.template = '';

		return this.indent(template);
	}
}

export default TemplateBuilder;
