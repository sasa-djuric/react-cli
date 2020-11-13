export declare type scope = 'global' | 'project';
export interface Options {
    typescript?: boolean;
    redux?: boolean;
    style?: boolean;
    test?: boolean;
    story?: boolean;
    proptypes?: boolean;
    index?: boolean;
    class?: boolean;
    path?: string;
}
export interface Constraints {
    style?: boolean;
    test?: boolean;
    story?: boolean;
    proptypes?: boolean;
    index?: boolean;
}
