

import {param, string} from "@benev/argv"

export const essentialParams = {

	"in":
		param.required(string, {help: `
			source directory from where to load files.
		`}),

	"out":
		param.required(string, {help: `
			target directory to write new files to.
		`}),

}

