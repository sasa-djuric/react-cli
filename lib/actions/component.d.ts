import { Options, Constraints } from '../types/index';
declare function create(name: string, options: Options, constraints: Constraints): void;
declare function _delete(params: any): void;
declare function rename(params: any): void;
declare const _default: {
    create: typeof create;
    delete: typeof _delete;
    rename: typeof rename;
};
export default _default;
