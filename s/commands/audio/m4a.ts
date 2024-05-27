
import ffmpeg from "ffmpeg-static"
import {$, ProcessOutput} from "zx"
import {ExecutionError, command} from "@benev/argv"

import {Logger} from "../../common/logger.js"
import {pathing} from "../../common/pathing.js"
import {isDryRun} from "../../tools/is-dry-run.js"
import {concurrently} from "../../tools/concurrently.js"
import {findParam} from "../../common/params/find-param.js"
import {prepareLogger} from "../../common/prepare-logger.js"
import {basicParams} from "../../common/params/basic-params.js"
import {audioParams} from "../../common/params/audio-params.js"
import {assertDirectories} from "../../tools/assert-directories.js"

export const audioInputTypes = [
	"wav",
	"mp3",
	"m4a",
	"mka",
	"ogg",
]

export const m4a = command({
	help: `convert audio to m4a format, aac codec.`,
	args: [],
	params: {
		...basicParams.required,
		...audioParams.required,
		find: findParam(audioInputTypes, audioInputTypes.join(",")),
		...audioParams.remaining,
		...basicParams.remaining,
	},
	execute: async({params}) => {
		const logger = prepareLogger(params)
		const paths = await pathing(() => "m4a", params)
		if (isDryRun(paths, logger, params))
			return

		const outpaths = paths.map(([,outpath]) => outpath)
		await assertDirectories(outpaths)

		const tasks = paths.map(([inpath, outpath]) =>
			() => convert_m4a_audio({
				logger,
				inpath,
				outpath,
				kbps: params["kbps"],
				mono: params["mono"],
			})
		)

		await concurrently(params["concurrency"], tasks)
	},
})

/////////////////////////////////////////////////
/////////////////////////////////////////////////

async function convert_m4a_audio({
		inpath, outpath, kbps, mono, logger,
	}: {
		inpath: string
		outpath: string
		kbps: number
		mono: boolean
		logger: Logger
	}) {

	logger.in(inpath)
	logger.out(outpath)

	try {
		await $`
			${ffmpeg} \\
				-i ${inpath} \\
				-c:a aac \\
				-b:a ${kbps}k \\
				${mono ? ["-ac", "1"] : []} \\
				-y \\
				-loglevel error \\
				${outpath}
		`.quiet()
	}
	catch(error) {
		if (error instanceof ProcessOutput)
			throw new ExecutionError(`ffmpeg error: ${error.stderr}`)
		else throw error
	}
}

