// Utils
import { conditionalString } from '../utils';

// Builders
import TemplateBuilder, { InsertOptions } from './template-builder';

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
	methods: { name: string; args?: string[]; content: string }[];
	extendsTypeArguments?: any[];
	insertOptions?: InsertOptions;
}

interface InsertFunction {
	name?: string;
	args?: string[];
	arrow?: boolean;
	async?: boolean;
	anonymous?: boolean;
	immidiateReturn?: boolean;
	body?: boolean;
	interfaceName?: string | null;
	content?: string;
	insertOptions?: InsertOptions;
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
				typeof arg === 'object' ? `${arg.type}<${this.compileTypeArguments(arg.arguments)}>` : arg
			)
		);
	}

	public insertImportStatement(
		importName: string,
		filePath: string,
		importAll = false,
		insertOptions?: InsertOptions
	) {
		const statement = `import ${conditionalString(importName && importAll, '* as ')}${
			importName ? importName + ' from ' : ''
		}'${filePath}';`;

		return this.insert(statement, {
			insertAfter: 'import',
			newLine: { afterCount: 1 },
			...insertOptions,
		});
	}

	public insertExportStatement(
		exportName: string,
		defaultExport: boolean,
		wrapExport?: string,
		insertOptions?: InsertOptions
	) {
		const statement = `export ${conditionalString(defaultExport, 'default ')}${conditionalString(
			wrapExport
		)}${wrapExport ? `(${exportName})` : exportName};`;

		return this.insert(statement, insertOptions);
	}

	public insertFunction({
		name,
		args = [],
		arrow = false,
		anonymous = false,
		async = false,
		immidiateReturn = false,
		body = true,
		interfaceName,
		content = '',
		insertOptions,
	}: InsertFunction) {
		const asyncStr = async ? 'async ' : '';
		const interfaceArrow = interfaceName ? ': ' + interfaceName : '';
		const interfaceFunction = interfaceName ? `<${interfaceName}>` : '';
		const declaration = !arrow
			? `${asyncStr}function ${interfaceFunction}${name}`
			: `const ${name}${interfaceArrow} = ${asyncStr}`;
		const contentBody = body ? `{\n${body && immidiateReturn ? 'return ' : ''}${content}\n}` : content;
		const template = `${!anonymous ? declaration : ''}(${args.join(', ')}) ${
			arrow ? '=> ' : ''
		}${contentBody}${arrow ? ';' : ''}\n`;

		return this.insert(template, insertOptions);
	}

	public insertClass({ name, extendsName, methods, extendsTypeArguments, insertOptions }: InsertClass) {
		const packedMethods = methods.reduce((acc, cur, index) => {
			const packedArgs = cur.args?.join(', ') ?? '';
			const isLast = methods.length - 1 === index;

			return `${acc}${cur.name}(${packedArgs}) {\n${cur.content || ''}\n}${!isLast ? '\n\n' : ''}`;
		}, '');
		const template = `class ${name}${
			extendsName
				? ` extends ${extendsName}${
						extendsTypeArguments ? `<${this.compileTypeArguments(extendsTypeArguments)}>` : ''
				  }`
				: ''
		} {\n${packedMethods}\n}`;

		return this.insert(template, insertOptions);
	}

	public insertInterface(name: string, extendsName: string, content = {}, insertOptions?: InsertOptions) {
		const contentDraft =
			Object.keys(content).length &&
			JSON.stringify(content, null, 4).split('"').join('').split(',').join(';').substr(6);
		const packedContent = contentDraft ? contentDraft.substr(0, contentDraft.length - 2) + ';' : '';
		const template = `interface ${name}${extendsName} {\n${packedContent}\n}`;

		return this.insert(template, insertOptions);
	}

	public insertElement({
		tag,
		props = {},
		selfClosing = false,
		children = '',
		spreadProps,
		insertOptions,
	}: InsertDOMElement) {
		const packedProps = Object.entries(props)
			.map(([key, value]) => `${key}="${value}"`)
			.join(' ');
		const template = `<${tag}${packedProps ? ' ' + packedProps : ''}${spreadProps ? ' {...props} ' : ''}${
			selfClosing ? '/>' : '>'
		}${!selfClosing ? `${children}</${tag}>` : ''}`;

		return this.insert(template, insertOptions);
	}

	public wrapExport(wrapper: string): void {
		this.wrap('export default ', ';', `${wrapper}(`, ')');
	}
}

export default JSTemplateBuilder;
