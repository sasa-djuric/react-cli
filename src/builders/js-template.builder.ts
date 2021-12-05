// Builders
import TemplateBuilder, { createAction, InsertOptions } from './base-template.builder';

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
	export?: boolean;
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
	export?: boolean;
}

interface InsertInterface {
	name: string;
	extendsName?: string;
	content?: any;
	insertOptions?: InsertOptions;
}

interface InsertImportStatement {
	importName: string;
	type?: 'default' | 'destructure' | 'all' | 'none-named';
	filePath: string;
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

const Action = createAction<JSBuilderActionType>();

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

	@Action(JSBuilderActionType.ImportStatement)
	public insertImportStatement({
		importName,
		filePath,
		type = 'default',
		insertOptions,
	}: InsertImportStatement) {
		const types: Record<Extract<InsertImportStatement['type'], string>, string> = {
			default: importName,
			destructure: `{ ${importName} }`,
			all: `* as ${importName}`,
			'none-named': '',
		};

		let statement = '';

		if (type !== 'none-named') {
			statement = `import ${types[type]} from '${filePath}';`;
		} else {
			statement = `import '${filePath}';`;
		}

		return this._insert(statement, {
			insertAfter: 'import',
			newLine: { afterCount: 1 },
			...insertOptions,
		});
	}

	@Action(JSBuilderActionType.ExportStatement)
	public insertExportStatement({
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

	@Action(JSBuilderActionType.Function)
	public insertFunction({
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
		export: exportProp,
	}: InsertFunction) {
		const exportStr = exportProp ? 'export ' : '';
		const asyncStr = async ? 'async ' : '';
		const interfaceArrow = interfaceName ? ': ' + interfaceName : '';
		const interfaceFunction = interfaceName ? `<${interfaceName}>` : '';
		const declaration = !arrow
			? `${exportStr}${asyncStr}function ${interfaceFunction}${name}`
			: `${exportStr}const ${name}${interfaceArrow} = ${asyncStr}`;
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

	@Action(JSBuilderActionType.Class)
	public insertClass({
		name,
		extendsName,
		methods,
		extendsTypeArguments,
		insertOptions,
		export: exportProp,
	}: InsertClass) {
		const exportStr = exportProp ? 'export ' : '';
		const packedMethods = methods.reduce((acc, cur, index) => {
			const packedArgs = cur.args?.join(', ') ?? '';
			const isLast = methods.length - 1 === index;

			return `${acc}${cur.name}(${packedArgs}) {\n${
				cur.immidiateReturn ? 'return ' : ''
			}${cur.content.toString() || ''}\n}${!isLast ? '\n\n' : ''}`;
		}, '');
		const template = `${exportStr}class ${name}${
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

	@Action(JSBuilderActionType.Interface)
	public insertInterface({
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

	@Action(JSBuilderActionType.Element)
	public insertElement({
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

	@Action(JSBuilderActionType.FunctionCall)
	public insertFunctionCall({ name, args, insertOptions }: InsertFunctionCall) {
		const packedArgs = args
			.map((item) => (item instanceof TemplateBuilder ? item.toString() : item))
			.join(', ');
		const template = `${name}(${packedArgs});`;

		return this._insert(template, insertOptions);
	}

	@Action(JSBuilderActionType.Body)
	public insertEmptyBody(insertOptions?: InsertOptions) {
		return this._insert('{\n\n};', insertOptions);
	}

	@Action(JSBuilderActionType.WrapExport)
	public wrapExport(wrapper: string) {
		this.wrap('export default ', ';', `${wrapper}(`, ')');
	}
}

export default JSTemplateBuilder;
