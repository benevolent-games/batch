
import path, { extname } from "path"
import {globby} from "globby"
import {ExecutionError} from "@benev/argv"

import {replaceExtension} from "../tools/replace-extension.js"

export const pathing = async(extensionFn: (e: string) => string, params: {
		in: string
		out: string
		find: string[]
		ignores: string[] | undefined
		suffix: string | undefined
	}) => planPaths({
	inputs: {
		directory: params.in,
		extensions: params.find,
		ignores: params.ignores ?? [],
	},
	outputs: {
		directory: params.out,
		suffix: params.suffix,
		extensionFn,
	},
})

async function planPaths({
		inputs,
		outputs,
	}: {
		inputs: {
			directory: string
			extensions: string[]
			ignores: string[]
		}
		outputs: {
			suffix?: string
			directory: string
			extensionFn: (e: string) => string
		}
	}): Promise<[string, string][]> {

	const patterns = (() => {
		if (inputs.extensions.includes("*"))
			return ["**/*"]

		const extensionGlob = inputs.extensions.length > 1
			? `{${inputs.extensions.join(",")}}`
			: inputs.extensions[0]

		return [`**/*.${extensionGlob}`]
	})()

	const found = await globby(patterns, {
		cwd: path.resolve(inputs.directory),
		caseSensitiveMatch: false,
		ignore: inputs.ignores,
	})

	return found.map(relativePath => {
		const inpath = path.join(inputs.directory, relativePath)
		const outpath = replaceExtension({
			filepath: path.join(outputs.directory, relativePath),
			suffix: outputs.suffix,
			extension: outputs.extensionFn(extname(relativePath).slice(1)),
		})
		return [inpath, outpath]
	})
}

