
import {color} from "@benev/argv"

export class Logger {
	log(s: string) {
		console.log(s)
	}

	error(s: string) {
		console.error(s)
	}

	inOut(inpath: string, outpath: string) {
		console.log(` in ${color.blue(inpath)}`)
		console.log(`out ${color.green(outpath)}`)
	}
}

export class DisabledLogger extends Logger {
	log() {}
	error() {}
}

