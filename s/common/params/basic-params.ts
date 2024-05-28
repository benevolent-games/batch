
import {availableParallelism} from "os"
import {list, number, param, string} from "@benev/argv"

export const basicParams = {
	required: {
		"in":
			param.required(string, {help: `
				source directory from where to load files.
			`}),

		"out":
			param.required(string, {help: `
				target directory to write new files to.
			`}),
	},

	remaining: {
		"ignores":
			param.optional(list(string), {help: `
				glob patterns to ignore from input, relative to the input directory. comma-separated. eg,
					--ignores="nope,**/_*"
						this would ignore a "nope" directory directly under the input directory, and anything starting with an underscore.
					don't forget to quote globs or your shell might bungle it.
			`}),

		"suffix":
			param.optional(string, {help: `
				insert a string into the output filename. eg,
					--suffix=potato
						"coolsound.webp" becomes "coolsound.potato.webp"
			`}),

		"concurrency":
			param.default(number, availableParallelism().toString(), {
				help: `
					how many operations to run simultaneously.
					the default number is automatically detected from your system.
					a higher number will gobble up more memory, but it might make things go faster.
				`,
				validate: n => {
					if (Number.isSafeInteger(n) && n > 0)
						return n
					else
						throw new Error(`must be a safe integer that is greater than 0`)
				},
			}),

		"verbose":
			param.flag("v", {help: `
				log information to stdout.
			`}),

		"dry-run":
			param.flag("d", {help: `
				don't actually write any files.
			`}),
	},
}

