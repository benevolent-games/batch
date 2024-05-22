
import {$} from "zx"
import path from "path"
import shell from "shelljs"
import {globby} from "globby"
import ffmpeg from "ffmpeg-static"
import {command} from "@benev/argv"
import {audioParams} from "./common/params.js"
import {replaceExtension} from "./common/replace-extension.js"

export const m4a = command({
	args: [],
	params: audioParams,
	execute: async({params}) => {
		const patterns = ["**/*.{wav,mp3,m4a,aac}"]
		const cwd = path.resolve(params.indir)
		const filepaths = await globby(patterns, {cwd})

		for (const filepath of filepaths) {
			const infile = path.join(params.indir, filepath)
			const outfile = replaceExtension(
				path.join(params.outdir, filepath),
				"m4a",
				params.suffix,
			)
			shell.mkdir("-p", path.dirname(outfile))
			console.log(`writing "${outfile}"`)
			await $`
				${ffmpeg} \\
					-i ${infile} \\
					-c:a aac \\
					-b:a ${params.kbps}k \\
					${params.mono ? ["-ac", "1"] : []} \\
					-y \\
					-loglevel quiet \\
					${outfile}
			`
		}
	},
})

