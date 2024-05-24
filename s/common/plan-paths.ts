
import path from "path"
import {globby} from "globby"
import {replaceExtension} from "./utils/replace-extension.js"

export async function planPaths({
		inputs,
		outputs,
	}: {
		inputs: {
			directory: string
			extensions: string[]
		}
		outputs: {
			suffix?: string
			extension: string
			directory: string
		}
	}): Promise<[string, string][]> {

	const found = await globby(
		[`**/*.{${inputs.extensions.join(",")}}`],
		{cwd: path.resolve(inputs.directory)},
	)

	return found.map(relativePath => {
		const inpath = path.join(inputs.directory, relativePath)
		const outpath = replaceExtension({
			filepath: path.join(outputs.directory, relativePath),
			suffix: outputs.suffix,
			extension: outputs.extension,
		})
		return [inpath, outpath]
	})
}

