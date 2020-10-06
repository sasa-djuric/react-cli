export function insertBeforeSpace(str: string, insert: string, first = true) {
	const index: number = first ? str.indexOf('\n\n') : str.lastIndexOf('\n\n') + 1;

	return str.substr(0, index + 1) + insert + str.substr(index + 1);
}

export function wrapExport(template: string, wrapper: string) {
	const exportIndex = template.indexOf('export default');
	const exportName = template.substr(exportIndex + 15, template.lastIndexOf(';') - (exportIndex + 15));

	return template.substr(0, exportIndex + 15) + wrapper + `(${exportName});`;
}
