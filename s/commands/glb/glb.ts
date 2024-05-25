
import {choice, command, param, string} from "@benev/argv"

import {Logger} from "../../common/logger.js"
import {pathing} from "../../common/pathing.js"
import {findParam} from "../../common/params/find-param.js"
import {basicParams} from "../../common/params/basic-params.js"
import { concurrently } from "../../tools/concurrently.js"
import { assertDirectories } from "../../tools/assert-directories.js"
import { commonStart } from "../../common/common-start.js"
import { GlbIo } from "./parts/glb_io.js"
import { cloneDocument, dedup } from "@gltf-transform/functions"
import { tiers } from "./parts/tiers.js"

export const glb = command({
	help: `optimize glbs`,
	args: [],
	params: {
		...basicParams.required,
		find: findParam("glb"),
		tier: param.optional(string, choice(
			["potato", "mid", "fancy"],
		)),
		...basicParams.remaining,
	},
	execute: async({params}) => {
		const {dryRun, logger} = commonStart(params)
		const paths = await pathing("glb", params)
		const outpaths = paths.map(([,outpath]) => outpath)
		await assertDirectories(outpaths)

		const io = await GlbIo.make()

		const tasks = paths.map(([inpath, outpath]) =>
			() => convert_glb({
				io,
				dryRun,
				logger,
				inpath,
				outpath,
			})
		)

		await concurrently(params["concurrency"], tasks)
	},
})

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

export async function convert_glb({
		io, inpath, outpath, dryRun, logger,
	}: {
		io: GlbIo
		inpath: string
		outpath: string
		dryRun: boolean
		logger: Logger
	}) {

	const original = await io.read(inpath)

	await original.document.transform(dedup())

	// for (const [quality, transforms] of Object.entries(tiers)) {
	// 	const document = cloneDocument(original.document)
	// 	await document.transform(...transforms)
	// 	const report = await gio.write(outpath(quality), document)

	// 	log_glb(report)

	// 	if (!!verbose && quality === "fancy") {
	// 		for (const node of document.getRoot().listNodes()) {
	// 			console.log(` - ${node.getName()}`)
	// 		}
	// 	}
	// }
}

