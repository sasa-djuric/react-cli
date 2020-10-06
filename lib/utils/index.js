"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeIndexFileExport = exports.getConfig = exports.saveFile = exports.haveOption = exports.parseOptions = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function parseOptions(args) {
    return Object.values(args.options).reduce((acc, optionConfig) => {
        const option = optionConfig.long.replace('--', '');
        return args[option] ? [...acc, option] : acc;
    }, []);
}
exports.parseOptions = parseOptions;
function haveOption(option, options) {
    return options.indexOf(option) >= 0;
}
exports.haveOption = haveOption;
function saveFile(path, content) {
    let finalContent;
    if (typeof content === 'object') {
        finalContent = JSON.stringify(content, null, 4);
    }
    else {
        finalContent = content;
    }
    fs_1.default.writeFileSync(path, finalContent, { encoding: 'utf8' });
}
exports.saveFile = saveFile;
function getConfig() {
    return JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'react-config.json'), { encoding: 'utf8' }));
}
exports.getConfig = getConfig;
function makeIndexFileExport(filePath, importName, fileName, extension = 'js') {
    const template = `import ${importName} from './${fileName}';\n\nexport default ${importName}`;
    fs_1.default.writeFileSync(path_1.default.resolve(filePath, `index.${extension}`), template, { encoding: 'utf-8' });
}
exports.makeIndexFileExport = makeIndexFileExport;
