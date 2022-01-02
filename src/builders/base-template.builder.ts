// @ts-ignore
import indentJs from 'indent.js';

export type fileType = 'js' | 'ts' | 'css' | 'scss';
interface Actions {
	[id: number]: Action;
}

interface Action {
	type: string;
	tag?: string;
	method: Function;
	args: Array<any>;
}

enum ActionType {
	Insert = 'insert',
	Overide = 'overide',
	NewLine = 'newLine',
}

export const createAction =
	<T>() =>
	(type: T) => {
		return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
			const originalFn = descriptor.value;

			descriptor.value = function () {
				// @ts-ignore
				this.actions[this.nextId++] = {
					type,
					method: originalFn.bind(this),
					args: arguments,
				};

				return this;
			};
		};
	};

class TemplateBuilder {
	private template: string = '';
	private nextId: number = 0;
	protected actions: Actions = {};

	constructor(private fileType: fileType) {}

	private indent(code: string) {
		return indentJs[this.fileType](code, { tabString: '\t' });
	}

	protected _insert(content: string) {
		this.template = this.template + content;
		return this;
	}

	public insert(content: string) {
		return this.insertAction({
			type: ActionType.Insert,
			method: this._insert.bind(this),
			args: [content],
		});
	}

	protected insertAction(options: Action) {
		this.actions[this.nextId++] = options;

		return this;
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
