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
	nameTypes?: Dictionary<string>;
	postfixTypes?: Dictionary<string>;
	postfix?: Array<string>;
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
		const nameTypes: Dictionary<string> = {
			'{name}': namePreferred,
			...(this.data.nameTypes || {}),
		};

		const preferredCasing = this.data.config.fileNaming.casing;

		const rawName =
			nameTypes[this.data.config.fileNaming.name] ||
			this.data.config.fileNaming.name ||
			this.data.name;

		const namePostfix = this.getPostfix(
			[this.data.config.fileNaming.postfix, ...(this.data.postfix || [])],
			this.data.config.fileNaming.postfixDevider,
			this.data.postfixTypes
		);

		const name =
			this.data.fileName || casing[preferredCasing](rawName!) + namePostfix;

		return name;
	}

	private getPostfix(
		name: string | Array<string>,
		devider: string = '',
		types: Dictionary<string> = {}
	) {
		const handleConstruct = (name: string) =>
			devider + (types?.[name] ? types[name] : name);

		if (Array.isArray(name)) {
			return name.reduce(
				(acc, name) => acc + (name ? handleConstruct(name) : ''),
				''
			);
		}

		return name?.length ? handleConstruct(name) : '';
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
