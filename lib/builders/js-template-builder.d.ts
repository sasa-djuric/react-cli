import TemplateBuilder, { BuilderConfig, InsertOptions } from './template-builder';
interface GenerateDOMElement {
    tag: string;
    props?: {
        [key: string]: string;
    };
    selfClosing?: boolean;
    children?: string;
    spreadProps?: boolean;
    insertOptions?: InsertOptions;
}
interface GenerateClass {
    name: string;
    extendsName: string;
    methods: {
        name: string;
        args?: string[];
        content: string;
    }[];
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
declare class JSTemplateBuilder extends TemplateBuilder {
    constructor(config: BuilderConfig);
    insertImportStatement(importName: string, filePath: string, importAll?: boolean, insertOptions?: InsertOptions): string;
    exportStatement(exportName: string, defaultExport: boolean, wrapExport?: string, insertOptions?: InsertOptions): string;
    generateFunction({ name, args, arrow, anonymous, async, immidiateReturn, body, interfaceName, content, insertOptions, }: GenerateFunction): string;
    generateClass({ name, extendsName, methods, insertOptions }: GenerateClass): string;
    generateInterface(name: string, extendsName: string, content?: {}, insertOptions?: InsertOptions): string;
    generateDOMElement({ tag, props, selfClosing, children, spreadProps, insertOptions, }: GenerateDOMElement): string;
    wrapExport(wrapper: string): void;
}
export default JSTemplateBuilder;
