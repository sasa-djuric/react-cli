import fs from 'fs/promises'

export async function fileExists(filePath: string) {
	try {
		return (await fs.stat(filePath)).isFile()
	} catch {
		return false
	}
}
