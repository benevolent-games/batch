
import {$} from "zx"
import path from "path"
import shell from "shelljs"
import {globby} from "globby"
import ffmpeg from "ffmpeg-static"
import {color, command, list, param, string} from "@benev/argv"

import {audioParams} from "./common/params.js"
import {replaceExtension} from "./common/replace-extension.js"

export const m4a = command({
	help: `convert audio files from indir, outputting them into outdir.`,
	args: [],
	params: {
		...audioParams,
		accept: param.default(list(string), "wav,mp3,m4a,ogg", {
			help: `sniff out files with these extensions from the input directory.`,
			validate: extensions => {
				if (extensions.length === 0)
					throw new Error("you need at least one")
				return extensions
			},
		}),
	},
	execute: async({params}) => {
		const patterns = [`**/*.{${params.accept.join(",")}}`]
		const cwd = path.resolve(params.indir)
		const filepaths = await globby(patterns, {cwd})

		if (params["dry-run"]) {
			console.log(color.yellow("dry-run"))
		}

		for (const filepath of filepaths) {
			const infile = path.join(params.indir, filepath)
			const outfile = replaceExtension(
				path.join(params.outdir, filepath),
				"m4a",
				params.suffix,
			)
			console.log(` in ${color.blue(infile)}`)
			console.log(`out ${color.green(outfile)}`)
			if (!params["dry-run"]) {
				shell.mkdir("-p", path.dirname(outfile))
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
		}
	},
})

