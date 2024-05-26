#!/usr/bin/env node

import {glb} from "./commands/glb/glb.js"
import {m4a} from "./commands/audio/m4a.js"
import {webp} from "./commands/images/webp.js"
import {cli, deathWithDignity} from "@benev/argv"

deathWithDignity()

await cli(process.argv, {
	name: "batch",
	commands: {
		images: {webp},
		audio: {m4a},
		"3d": {glb},
	},
	help: `
		convert and compress media files en mass.
		using ffmpeg for audio and video.
		using sharp for images.

		batch operates on directories.
		relevant files are recursively read from the --in directory.
		output is written into the --out directory, but with the same relative directory substructure.
	`,
}).execute()

