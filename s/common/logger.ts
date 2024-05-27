
import {color} from "@benev/argv"

export class Logger {
	log(s: string) {
		console.log(s)
	}

	error(s: string) {
		console.error(s)
	}

	in(inpath: string) {
		console.log(` in ${color.blue(inpath)}`)
	}

	out(outpath: string, report: string = "") {
		console.log(`out ${color.green(outpath)} ${report}`)
	}
}

export class DisabledLogger extends Logger {
	log() {}
	error() {}
}

