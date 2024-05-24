
import {color} from "@benev/argv"

export function universalStart(params: {
		"dry-run": boolean
		verbose: boolean
	}) {

	if (params["dry-run"])
		console.log(color.yellow("dry-run"))

	return {
		dryRun: params["dry-run"],
		loggingEnabled: params.verbose || params["dry-run"],
	}
}

