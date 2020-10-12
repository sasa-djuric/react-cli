"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureToggle = exports.dependencyExists = exports.getProjectRoot = exports.conditionalString = exports.makeIndexFileExport = exports.parseConstraints = exports.parseOptions = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function parseOptions(args) {
    return Object.values(args.options).reduce((acc, optionConfig) => {
        const option = optionConfig.long.replace('--', '');
        if (option.startsWith('no-')) {
            return acc;
        }
        return args[option] ? { ...acc, [option]: args[option] } : acc;
    }, {});
}
exports.parseOptions = parseOptions;
function parseConstraints(args) {
    return Object.values(args.parent.args).reduce((acc, arg) => {
        const option = arg.replace('--', '');
        if (!option.startsWith('no-')) {
            return acc;
        }
        return { ...acc, [option.replace('no-', '')]: true };
    }, {});
}
exports.parseConstraints = parseConstraints;
function makeIndexFileExport(filePath, importName, fileName, extension = 'js') {
    const template = `import ${importName} from './${fileName}';\n\nexport default ${importName};`;
    fs_1.default.writeFileSync(path_1.default.resolve(filePath, `index.${extension}`), template, { encoding: 'utf-8' });
}
exports.makeIndexFileExport = makeIndexFileExport;
function conditionalString(condition, result) {
    return condition ? (result ? result : condition) : '';
}
exports.conditionalString = conditionalString;
function getProjectRoot() {
    const currentPath = process.cwd();
    const directories = currentPath.split(path_1.default.sep);
    for (let i = 0; i < directories.length; i++) {
        const currentPath = directories.join(path_1.default.sep);
        if (fs_1.default.existsSync(path_1.default.resolve(currentPath, 'package.json'))) {
            return currentPath;
        }
        directories.pop();
    }
    throw new Error('Project not found');
}
exports.getProjectRoot = getProjectRoot;
function dependencyExists(dependency) {
    try {
        const packageFile = path_1.default.resolve(getProjectRoot(), 'package.json');
        const packageJson = JSON.parse(fs_1.default.readFileSync(packageFile, { encoding: 'utf-8' }));
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
        return !!Object.keys(dependencies).find(dep => dep.includes(dependency));
    }
    catch (err) {
        return;
    }
}
exports.dependencyExists = dependencyExists;
function featureToggle(scope, config, options, constraints) {
    return (name, fn) => {
        if ((options[name] || config[scope][name]) && !constraints[name]) {
            fn();
        }
    };
}
exports.featureToggle = featureToggle;
