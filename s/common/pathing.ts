
import path from "path"
import {globby} from "globby"
import {replaceExtension} from "../tools/replace-extension.js"
import { ExecutionError } from "@benev/argv"

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

	console.log(inputs)

	const found = await globby(
		[`**/*.{${inputs.extensions.join(",")}}`],
		{cwd: path.resolve(inputs.directory)},
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

