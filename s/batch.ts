#!/usr/bin/env node

import {ProcessOutput} from "zx"
import {cli, color, deathWithDignity} from "@benev/argv"

import {copy} from "./commands/copy.js"
import {glb} from "./commands/3d/glb.js"
import {m4a} from "./commands/audio/m4a.js"
import {webp} from "./commands/images/webp.js"

deathWithDignity()

try {
	await cli(process.argv, {
		name: "batch",
		commands: {
			copy,
			"3d": {glb},
			"audio": {m4a},
			"images": {webp},
		},
		help: `
			convert and compress media files en mass.
			batch operates on directories, and requires a unixlike environment.
			batch uses 'ffmpeg' for audio and video, 'sharp' for images.
		`,
	}).execute()
}
catch (error) {
	const errheading = (s: string) => console.log(color.brightRed(color.bold(s)))
	const errlog = (s: string) => console.log(color.red(s))
	errheading("@benev/batch internal error")
	if (error instanceof ProcessOutput)
		errlog(error.stderr)
	else if (error instanceof Error)
		errlog(error.message)
	else
		throw error
}

