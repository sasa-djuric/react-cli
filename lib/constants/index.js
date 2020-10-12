"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.styleTypes = exports.projectTypes = void 0;
exports.projectTypes = [
    { name: 'cra', label: 'Create React App' },
    { name: 'next', label: 'Next' },
    { name: 'gatsby', label: 'Gatsby' },
];
exports.styleTypes = ['css', 'scss', 'saas', 'less', 'styled-components'];
exports.defaultConfig = {
    project: {
        type: 'cra',
        typescript: false,
    },
    component: {
        path: './src/components',
        casing: 'kebab',
        naming: 'name',
        style: true,
        story: false,
        proptypes: false,
        test: false,
        index: false,
        inFolder: true,
        open: true,
    },
    style: {
        type: 'scss',
        modules: false,
    },
};
