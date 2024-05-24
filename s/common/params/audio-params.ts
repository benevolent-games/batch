
import {number, param, validators} from "@benev/argv"

export const audioParams = {
	required: {
		"kbps":
			param.required(number, {
				validate: validators.integer_between(16, 320),
				help: `
					output bitrate in kilobits per second. eg, --kbps=192
				`,
			}),
	},

	remaining: {
		"mono":
			param.flag("-m", {
				help: `
					flatten audio to a single channel.
					you should consider lowering the bitrate kbps by about a third, to get similar fidelity as stereo.
				`
			}),
	},
}

