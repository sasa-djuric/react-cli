export type scope = 'global' | 'project';

export interface Options {
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
