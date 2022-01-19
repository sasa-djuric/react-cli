// Libs
import path from 'path';
import casing from 'case';

// Types
import { BaseConfig } from '../configuration';
import Dictionary from '../types/dictionary';
import { fixRelativePath } from '../utils/path';

interface FilePathConstructor {
	name?: string;
	fileName?: string;
	sourcePath: string;
	pathTypes?: Dictionary<string>;
	namePlaceholders?: Dictionary<string>;
	fileExtension: string;
	relativeToFilePath?: string;
	config: BaseConfig;
}

class FilePath {
	public name: string;
	public namePreferred: string;
	public base: string;
	public dir: string;
	public baseDir: string;
	public ext: string;
	public full: string;
	public fullRelative?: string;

	constructor(private data: FilePathConstructor) {
		this.namePreferred = this.getNamePreferred();
		this.name = this.getName(this.namePreferred);
		this.base = `${this.name}.${this.data.fileExtension}`;
		this.baseDir = this.getBaseDir();
		this.dir = this.getDir(this.namePreferred, this.baseDir);
		this.ext = this.data.fileExtension;
		this.full = this.getFull(this.dir, this.base);
		this.fullRelative = this.getFullRelative(this.dir, this.base);
	}

	private getBaseDir() {
		const pathByType = this.data.pathTypes?.[this.data.config.path];

		if (pathByType) {
			return pathByType;
		}

		const subFolders = this.data.name ? this.parseSubFolders(this.data.name) : [];
		const basePath = path.join(this.data.sourcePath, this.data.config.path || '');
		const baseDirectoryPath = path.join(basePath, ...subFolders);

		return baseDirectoryPath;
	}

	private getDir(namePreferred: string, baseDir: string) {
		const pathByType = this.data.pathTypes?.[this.data.config.path];

		if (pathByType) {
			return pathByType;
		}

		const directory = this.data.config.inFolder ? namePreferred : '';
		const directoryPath = path.join(baseDir, directory);

		return directoryPath;
	}

	private getNamePreferred() {
		if (!this.data.name) {
			return '';
		}

		const parsedName = this.parseName(this.data.name);
		const preferredCasing = this.data.config.fileNaming.casing;
		const namePreferred = casing[preferredCasing](parsedName);

		return namePreferred;
	}

	private getName(namePreferred: string) {
		const namePlaceholders: Dictionary<string> = Object.assign(
			{},
			{ '{name}': namePreferred },
			this.data.namePlaceholders
		);

		const preferredCasing = this.data.config.fileNaming.casing;

		const rawName = this.data.config.fileNaming.name
			? this.data.config.fileNaming.name.replace(
					new RegExp(Object.keys(namePlaceholders).join('|'), 'g'),
					(placeholder) => namePlaceholders[placeholder]
			  )
			: this.data.name;

		const name =
			this.data.fileName ||
			// Allow "."
			rawName!.split('.').map(casing[preferredCasing]).join('.');

		return name;
	}

	private getFull(dir: string, base: string) {
		return path.join(dir, base);
	}

	private getFullRelative(dir: string, base: string) {
		if (!this.data.relativeToFilePath) {
			return;
		}

		const relative = path.relative(dir, this.data.relativeToFilePath);
		const fullRelative = path.join(relative, base);

		return fixRelativePath(fullRelative);
	}

	private parseName(name: string) {
		if (!name) return '';
		return name.lastIndexOf('/') >= 0 ? name.substr(name.lastIndexOf('/') + 1) : name;
	}

	private parseSubFolders(path: string) {
		if (!path) return '';
		return path.split('/').slice(0, path.split('/').length - 1);
	}
}

export default FilePath;
