
import {asType, number, param, string, validators} from "@benev/argv"

const date = asType({
	name: "date",
	coerce: string => new Date(string),
})

export const audioParams = {
	date: param.required(date),

	indir: param.required(string, {help: `
		source directory from where to load audio files.
	`}),

	outdir: param.required(string, {help: `
		target directory to write new audio files to.
	`}),

	kbps: param.required(number, {
		validate: validators.integer_between(16, 320),
		help: `
			output bitrate in kilobits per second. eg, --kbps=192
		`,
	}),

	mono: param.flag("-m", {help: `
		flatten audio to a single channel.
		you should consider lowering the bitrate kbps by about a third, to get similar fidelity as stereo.
	`}),

	suffix: param.optional(string, {help: `
		insert a string into the output filename. eg,
			--suffix=potato
				"coolsound.m4a" becomes "coolsound.potato.m4a"
	`}),

	"dry-run": param.flag("d", {help: `
		don't actually write any files.
	`}),
}

