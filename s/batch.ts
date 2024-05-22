#!/usr/bin/env node

import {cli} from "@benev/argv"
import {m4a} from "./commands/audio/m4a.js"

await cli(process.argv, {
	name: "batch",
	commands: {audio: {m4a}},
	help: `convert and compress media files en mass.`,
}).execute()

