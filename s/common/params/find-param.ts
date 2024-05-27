
import {list, multipleChoice, param, string} from "@benev/argv"

export function findParam(allowable: string[], fallback: string) {
	return param.default(list(string), fallback, multipleChoice(
		allowable,
		{help: `look for these file extensions as input.`},
	))
}

