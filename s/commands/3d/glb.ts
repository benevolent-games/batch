
import {Transform} from "@gltf-transform/core"
import {dedup} from "@gltf-transform/functions"
import {ExecutionError, Type, choice, command, param, string} from "@benev/argv"

import {GlbIo} from "./parts/glb_io.js"
import {human} from "../../tools/human.js"
import {Logger} from "../../common/logger.js"
import {pathing} from "../../common/pathing.js"
import {isDryRun} from "../../tools/is-dry-run.js"
import {concurrently} from "../../tools/concurrently.js"
import {findParam} from "../../common/params/find-param.js"
import {prepareLogger} from "../../common/prepare-logger.js"
import {basicParams} from "../../common/params/basic-params.js"
import {assertDirectories} from "../../tools/assert-directories.js"
import {tiers, TierName, TextureFormat, textureFormats} from "./parts/tiers.js"

export const glb = command({
	help: `optimize and process glbs`,
	args: [],
	params: {
		...basicParams.required,
		"tier": param.required<TierName>(
			string as Type<TierName>,
			choice(Object.keys(tiers) as TierName[])
		),
		"texture-format": param.default<TextureFormat>(
			string as Type<TextureFormat>,
			"webp",
			choice(textureFormats as TextureFormat[]),
		),
		"find": findParam("glb"),
		...basicParams.remaining,
	},
	execute: async({params}) => {
		const logger = prepareLogger(params)
		const paths = await pathing("glb", params)
		if (isDryRun(paths, logger, params))
			return

		const outpaths = paths.map(([,outpath]) => outpath)
		await assertDirectories(outpaths)

		const io = await GlbIo.make()

		const tasks = paths.map(([inpath, outpath]) =>
			() => convert_glb({
				io,
				inpath,
				outpath,
				logger,
				transforms: tiers[params.tier]({
					textureFormat: params["texture-format"],
				}),
			})
		)

		await concurrently(params["concurrency"], tasks)
	},
})

//////////////////////////////////////////////////////////////

export async function convert_glb({
		io, logger, inpath, outpath, transforms,
	}: {
		io: GlbIo
		logger: Logger
		inpath: string
		outpath: string
		transforms: Transform[]
	}) {

	try {
		logger.in(inpath)
		const original = await io.read(inpath)
		await original.document.transform(dedup())

		const document = original.document
		// const document = cloneDocument(original.document)

		await document.transform(...transforms)

		const report = await io.write(outpath, document)
		logger.out(outpath, human.bytes(report.binary.byteLength))
	}
	catch(error) {
		if (error instanceof Error)
			throw new ExecutionError(`glb error: ${error.message}`)
		else throw error
	}

	// // print out glb content
	// for (const node of document.getRoot().listNodes())
	// 	console.log(` - ${node.getName()}`)
}

