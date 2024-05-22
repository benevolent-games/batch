#!/usr/bin/env node

import {m4a} from "./commands/audio/m4a.js"
import {cli, deathWithDignity} from "@benev/argv"

deathWithDignity()

await cli(process.argv, {
	name: "batch",
	commands: {audio: {m4a}},
	help: `convert and compress media files en mass.`,
}).execute()

