
import {parse} from "path"
import draco3d from "draco3dgltf"
import {readFile, writeFile, mkdir} from "fs/promises"
import {ALL_EXTENSIONS} from "@gltf-transform/extensions"
import {NodeIO, Document, Logger} from "@gltf-transform/core"

export class GlbIo {

	static async make() {
		return new this(new NodeIO()
			.registerExtensions(ALL_EXTENSIONS)
			.registerDependencies({
				"draco3d.decoder": await draco3d.createDecoderModule(),
				"draco3d.encoder": await draco3d.createEncoderModule(),
			})
		)
	}

	constructor(private nodeIo: NodeIO) {}

	async read(path: string) {
		const binary = new Uint8Array(await readFile(path))
		const document = await this.nodeIo.readBinary(binary)
		const logger = new Logger(Logger.Verbosity.WARN)
		document.setLogger(logger)
		return {path, binary, document}
	}

	async write(path: string, document: Document) {
		const {dir} = parse(path)
		await mkdir(dir, {recursive: true})
		const binary = await this.nodeIo.writeBinary(document)
		await writeFile(path, binary)
		return {path, binary}
	}
}

