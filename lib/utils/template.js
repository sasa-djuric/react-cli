"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportStatement = exports.importStatement = exports.wrapExport = exports.insertBeforeSpace = void 0;
const _1 = require(".");
function insertBeforeSpace(str, insert, first = true) {
    const index = first ? str.indexOf('\n\n') : str.lastIndexOf('\n\n') + 1;
    return str.substr(0, index + 1) + insert + str.substr(index + 1);
}
exports.insertBeforeSpace = insertBeforeSpace;
function wrapExport(template, wrapper) {
    const exportIndex = template.indexOf('export default');
    const exportName = template.substr(exportIndex + 15, template.lastIndexOf(';') - (exportIndex + 15));
    return template.substr(0, exportIndex + 15) + wrapper + `(${exportName});`;
}
exports.wrapExport = wrapExport;
function importStatement(template, importName, filePath, importAll = false) {
    const lastImportIndex = template.lastIndexOf('import');
    const startIndex = template.substr(lastImportIndex).indexOf(';') + lastImportIndex + 2;
    const statement = `import ${_1.conditionalString(importName && importAll, '* as ')}${importName ? importName + ' from ' : ''}'${filePath}';\n`;
    return template.substring(0, startIndex) + statement + template.substring(startIndex);
}
exports.importStatement = importStatement;
function exportStatement(template, exportName, defaultExport, wrapExport, spaceAbove = true) {
    return `${template}${_1.conditionalString(spaceAbove, '\n')}\nexport ${_1.conditionalString(defaultExport, 'default ')}${_1.conditionalString(wrapExport)}${wrapExport ? `(${exportName})` : exportName};`;
}
exports.exportStatement = exportStatement;
