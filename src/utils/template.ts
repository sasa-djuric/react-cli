import { conditionalString } from '.';

export function insertBeforeSpace(str: string, insert: string, first = true) {
	const index: number = first ? str.indexOf('\n\n') : str.lastIndexOf('\n\n') + 1;

	return str.substr(0, index + 1) + insert + str.substr(index + 1);
}

export function wrapExport(template: string, wrapper: string) {
	const exportIndex = template.indexOf('export default');
	const exportName = template.substr(exportIndex + 15, template.lastIndexOf(';') - (exportIndex + 15));

	return template.substr(0, exportIndex + 15) + wrapper + `(${exportName});`;
}

export function importStatement(template: string, importName: string, filePath: string, importAll = false) {
	const lastImportIndex = template.lastIndexOf('import');
	const startIndex = template.substr(lastImportIndex).indexOf(';') + lastImportIndex + 2;
	const statement = `import ${conditionalString(importName && importAll, '* as ')}${
		importName ? importName + ' from ' : ''
	}'${filePath}';\n`;

	return template.substring(0, startIndex) + statement + template.substring(startIndex);
}

export function exportStatement(
	template: string,
	exportName: string,
	defaultExport: boolean,
	wrapExport?: string,
	spaceAbove = true
) {
	return `${template}${conditionalString(spaceAbove, '\n')}\nexport ${conditionalString(
		defaultExport,
		'default '
	)}${conditionalString(wrapExport)}${wrapExport ? `(${exportName})` : exportName};`;
}
