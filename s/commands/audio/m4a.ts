
import ffmpeg from "ffmpeg-static"
import {$, ProcessOutput} from "zx"
import {ExecutionError, color, command} from "@benev/argv"

import {planPaths} from "../../common/plan-paths.js"
import {findParam} from "../../common/utils/find-param.js"
import {universalStart} from "../../common/universal-start.js"
import {basicParams} from "../../common/params/basic-params.js"
import {audioParams} from "../../common/params/audio-params.js"
import {concurrently} from "../../common/utils/concurrently.js"
import {assertDirectories} from "../../common/utils/assert-directories.js"

export const m4a = command({
	help: `convert audio to m4a format, aac codec.`,
	args: [],
	params: {
		...basicParams.required,
		...audioParams.required,
		find: findParam("wav,mp3,m4a,ogg"),
		...audioParams.remaining,
		...basicParams.remaining,
	},
	execute: async({params}) => {
		const {dryRun, loggingEnabled} = universalStart(params)

		const paths = await planPaths({
			inputs: {
				directory: params["in"],
				extensions: params["find"],
			},
			outputs: {
				directory: params["out"],
				suffix: params["suffix"],
				extension: "m4a",
			},
		})

		await assertDirectories(paths.map(([,outpath]) => outpath))

		const tasks = paths.map(([inpath, outpath]) =>
			() => convert_m4a_audio({
				dryRun,
				inpath,
				outpath,
				loggingEnabled,
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
		inpath, outpath, kbps, mono, dryRun, loggingEnabled,
	}: {
		inpath: string
		outpath: string
		kbps: number
		mono: boolean
		dryRun: boolean
		loggingEnabled: boolean
	}) {

	if (loggingEnabled) {
		console.log(` in ${color.blue(inpath)}`)
		console.log(`out ${color.green(outpath)}`)
	}

	if (!dryRun) {
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
}

