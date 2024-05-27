
import path from "path"
import {globby} from "globby"
import {ExecutionError} from "@benev/argv"

import {replaceExtension} from "../tools/replace-extension.js"

export const pathing = async(extension: string, params: {
		in: string
		out: string
		find: string[]
		suffix: string | undefined
	}) => planPaths({
	inputs: {
		directory: params.in,
		extensions: params.find,
	},
	outputs: {
		directory: params.out,
		suffix: params.suffix,
		extension,
	},
})

async function planPaths({
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

	const extensionGlob = inputs.extensions.length > 1
		? `{${inputs.extensions.join(",")}}`
		: inputs.extensions[0]

	const found = await globby(
		[`**/*.${extensionGlob}`],
		{cwd: path.resolve(inputs.directory), caseSensitiveMatch: false},
	)

	if (found.length === 0)
		throw new ExecutionError(`no files found, looked for "${inputs.extensions.join(",")}" under "${inputs.directory}"`)

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

