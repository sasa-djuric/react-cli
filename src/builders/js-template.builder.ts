// Builders
import TemplateBuilder, { InsertOptions } from './base-template.builder';

interface InsertDOMElement {
	tag: string;
	props?: { [key: string]: string };
	selfClosing?: boolean;
	children?: string;
	spreadProps?: boolean;
	insertOptions?: InsertOptions;
}

interface InsertClass {
	name: string;
	extendsName: string;
	methods: Array<{
		name: string;
		args?: Array<string>;
		content: JSTemplateBuilder;
		immidiateReturn: boolean;
	}>;
	extendsTypeArguments?: Array<any>;
	insertOptions?: InsertOptions;
}

interface InsertFunction {
	name?: string;
	args?: Array<string>;
	arrow?: boolean;
	async?: boolean;
	anonymous?: boolean;
	immidiateReturn?: boolean;
	body?: boolean;
	interfaceName?: string | null;
	content?: JSTemplateBuilder;
	insertOptions?: InsertOptions;
}

interface InsertInterface {
	name: string;
	extendsName?: string;
	content?: any;
	insertOptions?: InsertOptions;
}

interface InsertImportStatement {
	importName: string;
	filePath: string;
	importAll?: boolean;
	insertOptions?: InsertOptions;
}

interface insertExportStatement {
	exportName: string;
	defaultExport: boolean;
	wrapExport?: string;
	exportFrom?: string;
	insertOptions?: InsertOptions;
}

interface InsertFunctionCall {
	name: string;
	args: Array<string | TemplateBuilder>;
	insertOptions?: InsertOptions;
}

export enum JSBuilderActionType {
	ImportStatement = 'importStatement',
	ExportStatement = 'exportStatement',
	Function = 'function',
	Class = 'class',
	Element = 'element',
	Interface = 'interface',
	Body = 'body',
	WrapExport = 'wrapExport',
	FunctionCall = 'functionCall',
}

class JSTemplateBuilder extends TemplateBuilder {
	constructor() {
		super('js');
	}

	private compileTypeArguments(args: any[]): string {
		const concat = (acc: string, cur: string) => (acc ? `${acc}, ${cur}` : cur);

		return args.reduce((acc, arg) =>
			concat(
				acc,
				typeof arg === 'object'
					? `${arg.type}<${this.compileTypeArguments(arg.arguments)}>`
					: arg
			)
		);
	}

	private _insertImportStatement({
		importName,
		filePath,
		importAll = false,
		insertOptions,
	}: InsertImportStatement) {
		const statement = `import ${importName && importAll ? '* as ' : ''}${
			importName ? importName + ' from ' : ''
		}'${filePath}';`;

		return this._insert(statement, {
			insertAfter: 'import',
			newLine: { afterCount: 1 },
			...insertOptions,
		});
	}

	public insertImportStatement(args: InsertImportStatement) {
		return this.insertAction({
			type: JSBuilderActionType.ImportStatement,
			method: this._insertImportStatement.bind(this),
			args: [args],
		});
	}

	private _insertExportStatement({
		exportName,
		defaultExport,
		wrapExport,
		exportFrom,
		insertOptions,
	}: insertExportStatement) {
		const statement = `export ${defaultExport ? 'default ' : ''}${
			wrapExport ? `(${exportName})` : exportName
		}${exportFrom ? ` from '${exportFrom}'` : ''};`;

		return this._insert(statement, insertOptions);
	}

	public insertExportStatement(args: insertExportStatement) {
		return this.insertAction({
			type: JSBuilderActionType.ExportStatement,
			method: this._insertExportStatement.bind(this),
			args: [args],
		});
	}

	private _insertFunction({
		name,
		args = [],
		arrow = false,
		anonymous = false,
		async = false,
		immidiateReturn = false,
		body = true,
		interfaceName,
		content,
		insertOptions,
	}: InsertFunction) {
		const asyncStr = async ? 'async ' : '';
		const interfaceArrow = interfaceName ? ': ' + interfaceName : '';
		const interfaceFunction = interfaceName ? `<${interfaceName}>` : '';
		const declaration = !arrow
			? `${asyncStr}function ${interfaceFunction}${name}`
			: `const ${name}${interfaceArrow} = ${asyncStr}`;
		const contentBody = body
			? `{\n${body && immidiateReturn ? 'return ' : ''}${
					content?.toString() ?? ''
			  }\n}`
			: content?.toString() ?? '';
		const template = `${!anonymous ? declaration : ''}(${args.join(', ')}) ${
			arrow ? '=> ' : ''
		}${contentBody}${arrow && !anonymous ? ';' : ''}${!anonymous ? '\n' : ''}`;

		return this._insert(template, insertOptions);
	}

	public insertFunction(options: InsertFunction) {
		return this.insertAction({
			type: JSBuilderActionType.Function,
			method: this._insertFunction.bind(this),
			args: [options],
		});
	}

	private _insertClass({
		name,
		extendsName,
		methods,
		extendsTypeArguments,
		insertOptions,
	}: InsertClass) {
		const packedMethods = methods.reduce((acc, cur, index) => {
			const packedArgs = cur.args?.join(', ') ?? '';
			const isLast = methods.length - 1 === index;

			return `${acc}${cur.name}(${packedArgs}) {\n${
				cur.immidiateReturn ? 'return ' : ''
			}${cur.content.toString() || ''}\n}${!isLast ? '\n\n' : ''}`;
		}, '');
		const template = `class ${name}${
			extendsName
				? ` extends ${extendsName}${
						extendsTypeArguments
							? `<${this.compileTypeArguments(extendsTypeArguments)}>`
							: ''
				  }`
				: ''
		} {\n${packedMethods}\n}`;

		return this._insert(template, insertOptions);
	}

	public insertClass(options: InsertClass) {
		return this.insertAction({
			type: JSBuilderActionType.Class,
			method: this._insertClass.bind(this),
			args: [options],
		});
	}

	private _insertInterface({
		name,
		extendsName = '',
		content = {},
		insertOptions,
	}: InsertInterface) {
		const contentDraft =
			Object.keys(content).length &&
			JSON.stringify(content, null, 4)
				.split('"')
				.join('')
				.split(',')
				.join(';')
				.substr(6);
		const packedContent = contentDraft
			? contentDraft.substr(0, contentDraft.length - 2) + ';'
			: '';
		const template = `interface ${name}${extendsName} {\n${packedContent}\n}`;

		return this._insert(template, insertOptions);
	}

	public insertInterface(options: InsertInterface) {
		return this.insertAction({
			type: JSBuilderActionType.Interface,
			method: this._insertInterface.bind(this),
			args: [options],
		});
	}

	private _insertElement({
		tag,
		props = {},
		selfClosing = false,
		children = '',
		spreadProps,
		insertOptions,
	}: InsertDOMElement) {
		const packedProps = Object.entries(props)
			.map(([key, value]) =>
				value.startsWith('{') ? `${key}=${value}` : `${key}="${value}"`
			)
			.join(' ');
		const template = `<${tag}${packedProps ? ' ' + packedProps : ''}${
			spreadProps ? ' {...props} ' : ''
		}${selfClosing ? '/>' : '>'}${!selfClosing ? `${children}</${tag}>` : ''}`;

		return this._insert(template, insertOptions);
	}

	public insertElement(args: InsertDOMElement) {
		return this.insertAction({
			type: JSBuilderActionType.Element,
			method: this._insertElement.bind(this),
			args: [args],
		});
	}

	private _insertFunctionCall({ name, args, insertOptions }: InsertFunctionCall) {
		const packedArgs = args
			.map((item) => (item instanceof TemplateBuilder ? item.toString() : item))
			.join(', ');
		const template = `${name}(${packedArgs});`;

		this._insert(template, insertOptions);
	}

	public insertFunctionCall(args: InsertFunctionCall) {
		return this.insertAction({
			type: JSBuilderActionType.FunctionCall,
			method: this._insertFunctionCall.bind(this),
			args: [args],
		});
	}

	private _insertEmptyBody(insertOptions?: InsertOptions) {
		return this._insert('{\n\n};', insertOptions);
	}

	public insertEmptyBody(insertOptions?: InsertOptions) {
		return this.insertAction({
			type: JSBuilderActionType.Body,
			method: this._insertEmptyBody.bind(this),
			args: [insertOptions],
		});
	}

	private _wrapExport(wrapper: string) {
		this.wrap('export default ', ';', `${wrapper}(`, ')');
	}

	public wrapExport(wrapper: string) {
		return this.insertAction({
			type: JSBuilderActionType.WrapExport,
			method: this._wrapExport.bind(this),
			args: [wrapper],
		});
	}
}

export default JSTemplateBuilder;
