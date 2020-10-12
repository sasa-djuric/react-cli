import { styleType } from '../types/config';
declare function create(name: string, config: {
    modules: boolean;
    type: styleType;
}, filePath: string): void;
declare const _default: {
    create: typeof create;
};
export default _default;
