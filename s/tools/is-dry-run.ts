
import {color} from "@benev/argv"
import {Logger} from "../common/logger.js"

export function isDryRun(
		paths: [string, string][],
		logger: Logger,
		params: {"dry-run": boolean},
	) {

	if (params["dry-run"]) {
		console.log(color.yellow("dry-run"))
		for (const [inpath, outpath] of paths) {
			logger.in(inpath)
			logger.out(outpath)
		}
		return true
	}

	return false
}

