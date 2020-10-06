import { getConfig } from '../utils';

export const projectTypes = [
	{ name: 'cra', label: 'Create React App' },
	{ name: 'next', label: 'Next' },
	{ name: 'gatsby', label: 'Gatsby' },
];

export const styleTypes = ['css', 'scss', 'saas', 'less', 'styled-components'];

export const config = getConfig();
