
import {list, param, string} from "@benev/argv"

export function findParam(fallback: string) {
	return param.default(list(string), fallback, {
		help: `sniff out files with these extensions from the input directory.`,
		validate: extensions => {
			if (extensions.length > 0)
				return extensions
			else
				throw new Error(`you need at least one`)
		},
	})
}

