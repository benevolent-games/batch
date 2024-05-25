
import {color} from "@benev/argv"
import {DisabledLogger, Logger} from "./logger.js"

export function commonStart(params: {
		"dry-run": boolean
		verbose: boolean
	}) {

	if (params["dry-run"])
		console.log(color.yellow("dry-run"))

	return {
		dryRun: params["dry-run"],
		logger: (params.verbose || params["dry-run"])
			? new Logger()
			: new DisabledLogger(),
	}
}

