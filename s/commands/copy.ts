
import {command, list, param, string} from "@benev/argv"

import {$} from "zx"
import {Logger} from "../common/logger.js"
import {pathing} from "../common/pathing.js"
import {isDryRun} from "../tools/is-dry-run.js"
import {concurrently} from "../tools/concurrently.js"
import {prepareLogger} from "../common/prepare-logger.js"
import {basicParams} from "../common/params/basic-params.js"
import {assertDirectories} from "../tools/assert-directories.js"

export const copy = command({
	help: `copy files from one place to another.`,
	args: [],
	params: {
		...basicParams.required,
		find: param.required(list(string), {
			help: `
				look for these file extensions as input.
				eg,
					--find=jpg,jpeg,png
						only copy files with these extensions
					--find="*"
						copy all files.
						don't forget to quote any globs like this or your shell might misbehave.
			`,
		}),
		...basicParams.remaining,
	},
	execute: async({params}) => {
		const logger = prepareLogger(params)
		const paths = await pathing(ext => ext, params)
		if (isDryRun(paths, logger, params))
			return

		const outpaths = paths.map(([,outpath]) => outpath)
		await assertDirectories(outpaths)

		const tasks = paths.map(([inpath, outpath]) =>
			() => copy_operation({
				logger,
				inpath,
				outpath,
			})
		)

		await concurrently(params["concurrency"], tasks)
	},
})

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

async function copy_operation({
		inpath, outpath, logger,
	}: {
		logger: Logger
		inpath: string
		outpath: string
	}) {

	logger.in(inpath)
	await $`cp -f ${inpath} ${outpath}`
	logger.out(outpath)
}

