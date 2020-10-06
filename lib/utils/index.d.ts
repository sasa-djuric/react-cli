import { Config } from '../types/config';
export declare function parseOptions(args: any): unknown;
export declare function haveOption(option: never, options: []): boolean;
export declare function saveFile(path: string, content: string | object): void;
export declare function getConfig(): Config;
export declare function makeIndexFileExport(filePath: string, importName: string, fileName: string, extension?: string): void;
