import j, { Collection, ExpressionStatement, ImportDeclaration } from 'jscodeshift';
import { DeclarationKind } from 'ast-types/gen/kinds';

export function removeSpaceBetweenImports(source: string, isFirst = true): string {
	const importIndex = source.indexOf('import');

	if (importIndex === -1) {
		return isFirst ? source : source.startsWith('\n\n') ? source : '\n' + source;
	}

	const semiIndex = source.substring(importIndex).indexOf(';') + importIndex;
	const draft = source.substring(semiIndex + 1).startsWith('\n\n')
		? source.substring(0, semiIndex + 1) + source.substring(semiIndex + 2)
		: source;

	return (
		draft.substring(0, semiIndex + 1) +
		removeSpaceBetweenImports(draft.substring(semiIndex + 1), false)
	);
}

export function addNewLines(
	source: string,
	afterString: string,
	afterStringLength: number = afterString.length
): string {
	const afterStringIndex = source.indexOf(afterString);

	if (afterStringIndex === -1) {
		return source;
	}

	const draft = !source
		.substring(afterStringIndex + afterStringLength)
		.startsWith('\n\n')
		? source.substring(0, afterStringIndex + afterStringLength) +
		  '\n' +
		  source.substring(afterStringIndex + afterStringLength)
		: source;

	return (
		draft.substring(0, afterStringIndex + afterStringLength) +
		addNewLines(draft.substring(afterStringIndex + afterStringLength), afterString)
	);
}

export function formatTemplate(source: string) {
	return addNewLines(
		addNewLines(
			addNewLines(
				removeSpaceBetweenImports(source.replace(/\n\s*\n\s*\n/g, '\n\n')),
				'\n});'
			),
			'};'
		),
		'\n}\n',
		2
	).trim();
}

export function constructTemplate(body: Array<any>) {
	const template = j('');
	template.get().value.program.body = body;
	return template.toSource({ lineTerminator: '\n' });
}

export function insertAfterComponentDeclaration(
	root: Collection<any>,
	expression: ExpressionStatement | DeclarationKind
) {
	const lastExportDeclaration = root.find(j.ExportNamedDeclaration).at(-1);
	const lastClassDeclaration = root.find(j.ClassDeclaration).at(-1);
	const lastVariableDeclaration = root.find(j.VariableDeclaration).at(-1);

	if (lastClassDeclaration.paths().length) {
		if (
			lastClassDeclaration.get().parent.get().value.type ===
			'ExportNamedDeclaration'
		) {
			lastClassDeclaration.get().parent.get().insertAfter(expression);
		} else {
			lastClassDeclaration.get().insertAfter(expression);
		}
	} else if (lastVariableDeclaration.paths().length) {
		if (
			lastVariableDeclaration.get().parent.get().value.type ===
			'ExportNamedDeclaration'
		) {
			lastVariableDeclaration.get().parent.get().insertAfter(expression);
		} else {
			lastVariableDeclaration.get().insertAfter(expression);
		}
	} else if (lastExportDeclaration.paths().length) {
		lastExportDeclaration.get().insertAfter(expression);
	}
}

export function addImport(root: Collection<any>, declaration: ImportDeclaration) {
	const lastImportDeclaration = root.find(j.ImportDeclaration).at(-1);

	if (lastImportDeclaration.paths().length) {
		lastImportDeclaration.get().insertAfter(declaration);
	} else {
		root.get().value.program.body.unshift(declaration);
	}
}
