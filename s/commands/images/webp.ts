
import sharp from "sharp"
import {command, number, param} from "@benev/argv"

import {Logger} from "../../common/logger.js"
import {pathing} from "../../common/pathing.js"
import {isDryRun} from "../../tools/is-dry-run.js"
import {findParam} from "../../common/params/find-param.js"
import {prepareLogger} from "../../common/prepare-logger.js"
import {basicParams} from "../../common/params/basic-params.js"
import {assertDirectories} from "../../tools/assert-directories.js"

export const webp = command({
	help: `convert images to webp format.`,
	args: [],
	params: {
		...basicParams.required,
		quality: param.required(number, {
			validate: n => {
				if (Number.isSafeInteger(n) && n >= 1 && n <= 100)
					return n
				else
					throw new Error(`must be integer from 1 to 100`)
			},
		}),
		find: findParam("jpg,jpeg,png,webp"),
		size: param.optional(number, {
			validate: n => {
				if (Number.isSafeInteger(n) && n > 0)
					return n
				else
					throw new Error(`must be integer greater than 0`)
			},
		}),
		...basicParams.remaining,
	},
	execute: async({params}) => {
		const logger = prepareLogger(params)
		const paths = await pathing("webp", params)
		if (isDryRun(paths, logger, params))
			return

		const outpaths = paths.map(([,outpath]) => outpath)
		await assertDirectories(outpaths)

		sharp.concurrency(params.concurrency)

		await Promise.all(paths.map(async([inpath, outpath]) => {
			await convert_webp_image({
				logger,
				inpath,
				outpath,
				size: params.size,
				quality: params.quality,
			})
		}))
	},
})

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

async function convert_webp_image({
		inpath, outpath, quality, size, logger,
	}: {
		logger: Logger
		inpath: string
		outpath: string
		quality: number
		size?: number
	}) {

	logger.in(inpath)
	logger.out(outpath)

	return pipe(sharp(inpath))
		.to(img => img.rotate())
		.to(size === undefined
			? img => img
			: img => img.resize({
				width: size,
				height: size,
				fit: "inside",
				withoutEnlargement: true,
			}))
		.to(img => img.webp({
			quality,
			alphaQuality: quality,
		}))
		.to(img => img.toFile(outpath))
		.done()
}

function pipe<X>(x: X) {
	return {
		to: <Y>(fn: (x: X) => Y) => pipe(fn(x)),
		done: () => x,
	}
}

