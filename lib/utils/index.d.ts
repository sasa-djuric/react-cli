export declare function parseOptions(args: any): unknown;
export declare function parseConstraints(args: any): unknown;
export declare function makeIndexFileExport(filePath: string, importName: string, fileName: string, extension?: string): void;
export declare function conditionalString(condition: any, result?: string): any;
export declare function getProjectRoot(): string;
export declare function dependencyExists(dependency: string): boolean | undefined;
export declare function featureToggle(scope: 'project' | 'component' | 'style', config: any, options: any, constraints: any): (name: string, fn: Function) => void;
