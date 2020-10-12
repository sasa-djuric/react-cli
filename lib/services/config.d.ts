import { Config } from '../types/config';
declare function get(): Config;
declare function create(config: any, scope: 'global' | 'project'): void;
declare const _default: {
    create: typeof create;
    get: typeof get;
};
export default _default;
