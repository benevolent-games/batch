
import {param, validators} from "@benev/argv"

export const audioParams = {
	indir: param.required(String),
	outdir: param.required(String),

	kbps: param.required(Number, {
		validate: validators.integer_between(16, 320),
		help: `
			output bitrate in kilobits per second. eg, --kbps=192
		`,
	}),

	mono: param.flag("-m", {help: `
		flatten audio to a single channel.
		you should consider lowering the bitrate kbps by about a third, to get similar fidelity as stereo.
	`}),

	suffix: param.optional(String, {
		help: `
			insert a string into the output filename. eg,
				--suffix=potato
					"coolsound.m4a" becomes "coolsound.potato.m4a"
		`,
	}),
}

