#!/usr/bin/env node

import {m4a} from "./commands/audio/m4a.js"
import {webp} from "./commands/images/webp.js"
import {cli, deathWithDignity} from "@benev/argv"

deathWithDignity()

await cli(process.argv, {
	name: "batch",
	commands: {
		images: {webp},
		audio: {m4a},
	},
	help: `
		convert and compress media files en mass.
			ffmpeg for audio and video.
			sharp for images.

		batch always operates on *directories*.
			relevant files are recursively read from the --in directory.
			output is written into the --out directory, but with the same relative directory substructure.
	`,
}).execute()

