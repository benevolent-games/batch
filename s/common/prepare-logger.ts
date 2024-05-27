
import {DisabledLogger, Logger} from "./logger.js"

export function prepareLogger(params: {
		"dry-run": boolean
		verbose: boolean
	}) {

	return (params.verbose || params["dry-run"])
		? new Logger()
		: new DisabledLogger()
}

