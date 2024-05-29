#!/usr/bin/env node

import {copy} from "./commands/copy.js"
import {glb} from "./commands/3d/glb.js"
import {m4a} from "./commands/audio/m4a.js"
import {webp} from "./commands/images/webp.js"
import {cli, deathWithDignity} from "@benev/argv"

deathWithDignity()

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

