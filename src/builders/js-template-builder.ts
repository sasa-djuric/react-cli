import { conditionalString } from '../utils';
import TemplateBuilder from './template-builder';

interface InsertOptions {
	newLine?: {
		beforeCount?: number;
		afterCount?: number;
	};
	insertAfter?: string;
	insertBefore?: string;
}

interface GenerateDOMElement {
	tag: string;
	props?: { [key: string]: string };
	selfClosing?: boolean;
	children?: string;
	spreadProps?: boolean;
	insertOptions?: InsertOptions;
}

interface GenerateClass {
	name: string;
	extendsName: string;
	methods: { name: string; args?: string[]; content: string }[];
	insertOptions?: InsertOptions;
}

interface GenerateFunction {
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
	public insertImportStatement(
		importName: string,
		filePath: string,
		importAll = false,
		insertOptions?: InsertOptions
	): string {
		const statement = `import ${conditionalString(importName && importAll, '* as ')}${
			importName ? importName + ' from ' : ''
		}'${filePath}';\n`;

		return this.insert(statement, { insertAfter: 'import', ...insertOptions });
	}

	public exportStatement(
		exportName: string,
		defaultExport: boolean,
		wrapExport?: string,
		insertOptions?: InsertOptions
	): string {
		const statement = `export ${conditionalString(defaultExport, 'default ')}${conditionalString(
			wrapExport
		)}${wrapExport ? `(${exportName})` : exportName};`;

		return this.insert(statement, insertOptions);
	}

	public generateFunction({
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
	}: GenerateFunction): string {
		const asyncStr = async ? 'async ' : '';
		const interfaceArrow = interfaceName ? ': ' + interfaceName : '';
		const interfaceFunction = interfaceName ? `<${interfaceName}>` : '';
		const declaration = !arrow
			? `${asyncStr}function ${interfaceFunction}${name}`
			: `const ${name}${interfaceArrow} = ${asyncStr}`;
		const contentBody = body
			? `{\n{{{indent}}}${body && immidiateReturn ? 'return ' : ''}${content}\n}`
			: content;
		const template = `${!anonymous ? declaration : ''}(${args.join(', ')}) ${
			arrow ? '=> ' : ''
		}${contentBody}${arrow ? ';' : ''}\n`;

		return this.insert(template, insertOptions);
	}

	public generateClass({ name, extendsName, methods, insertOptions }: GenerateClass): string {
		const packedMethods = methods.reduce((acc, cur, index) => {
			const packedArgs = cur.args?.join(', ') ?? '';
			const isLast = methods.length - 1 === index;

			return `${acc}${cur.name}(${packedArgs}) {\n{{{indent}}}{{{indent}}}${
				cur.content || ''
			}\n{{{indent}}}}${!isLast ? '\n\n{{{indent}}}' : ''}`;
		}, '');
		const template = `class ${name}${
			extendsName ? ` extends ${extendsName}` : ''
		} {\n{{{indent}}}${packedMethods}\n}`;

		return this.insert(template, insertOptions);
	}

	public generateInterface(
		name: string,
		extendsName: string,
		content = {},
		insertOptions?: InsertOptions
	): string {
		const contentDraft =
			Object.keys(content).length &&
			JSON.stringify(content, null, 4).split('"').join('').split(',').join(';').substr(6);
		const packedContent = contentDraft ? contentDraft.substr(0, contentDraft.length - 2) + ';' : '';
		const template = `interface ${name}${extendsName} {\n{{{indent}}}${packedContent}\n}`;

		return this.insert(template, insertOptions);
	}

	public generateDOMElement({
		tag,
		props = {},
		selfClosing = false,
		children = '',
		spreadProps,
		insertOptions,
	}: GenerateDOMElement): string {
		const packedProps = Object.entries(props)
			.map(([key, value]) => `${key}="${value}"`)
			.join(' ');
		const template = `<${tag}${packedProps ? ' ' + packedProps : ''}${spreadProps ? ' {...props} ' : ''}${
			selfClosing ? '/>' : '>'
		}${!selfClosing ? `${children}</${tag}>` : ''}`;

		return this.insert(template, insertOptions);
	}

	public wrapExport(wrapper: string): void {
		const exportIndex = this.toString().indexOf('export default');
		const exportName = this.toString().substr(
			exportIndex + 15,
			this.toString().lastIndexOf(';') - (exportIndex + 15)
		);
		const template = this.toString().substr(0, exportIndex + 15) + wrapper + `(${exportName});`;

		this.override(template);
	}
}

export default JSTemplateBuilder;
