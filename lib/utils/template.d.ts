export declare function insertBeforeSpace(str: string, insert: string, first?: boolean): string;
export declare function wrapExport(template: string, wrapper: string): string;
export declare function importStatement(template: string, importName: string, filePath: string, importAll?: boolean): string;
export declare function exportStatement(template: string, exportName: string, defaultExport: boolean, wrapExport?: string, spaceAbove?: boolean): string;
