export interface InsertOptions {
    newLine?: {
        beforeCount?: number;
        afterCount?: number;
    };
    insertAfter?: string;
    insertBefore?: string;
}
export interface BuilderConfig {
    indent: {
        count: number;
        method: 'space' | 'tab';
    };
}
export declare type fileType = 'js' | 'ts' | 'css' | 'scss';
declare class TemplateBuilder {
    private config;
    private fileType;
    private template;
    constructor(config: BuilderConfig, fileType: fileType);
    private lineAfterIndex;
    private lineBeforeIndex;
    private insertOnIndex;
    private indent;
    wrap(wrapAfterIndexOf: string, wrapToIndexOf: string, strBefore: string, strAfter: string): void;
    insert(content: string, options?: InsertOptions): string;
    override(content: string): void;
    toString(): string;
}
export default TemplateBuilder;
