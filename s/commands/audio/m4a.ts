
import {$} from "zx"
import {dirname} from "path"
import ffmpeg from "ffmpeg-static"
import {color, command} from "@benev/argv"

import {planPaths} from "../../common/plan-paths.js"
import {findParam} from "../../common/utils/find-param.js"
import {universalStart} from "../../common/universal-start.js"
import {basicParams} from "../../common/params/basic-params.js"
import {audioParams} from "../../common/params/audio-params.js"
import {concurrently} from "../../common/utils/concurrently.js"

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
				extension: "webp",
			},
		})

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

		for (const task of tasks)
			await task()

		// await concurrently(params["concurrency"], tasks)
	},
})

/////////////////////////////////////////////////
/////////////////////////////////////////////////

async function convert_m4a_audio({
		inpath, outpath, dryRun, loggingEnabled, kbps, mono,
	}: {
		inpath: string
		outpath: string
		dryRun: boolean
		loggingEnabled: boolean
		kbps: number
		mono: boolean
	}) {

	if (loggingEnabled) {
		console.log(` in ${color.blue(inpath)}`)
		console.log(`out ${color.green(outpath)}`)
	}

	if (!dryRun) {
		await $`mkdir -p ${dirname(outpath)}`
		await $`
			${ffmpeg} \\
				-i ${inpath} \\
				-c:a aac \\
				-b:a ${kbps}k \\
				${mono ? ["-ac", "1"] : []} \\
				-y \\
				${outpath}
		`
	}
}

				// -loglevel quiet \\
