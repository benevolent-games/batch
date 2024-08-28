
import {Transform} from "@gltf-transform/core"
import {prune, draco} from "@gltf-transform/functions"

export const std_transforms = [
	prune({
		keepLeaves: true,
	}),
	draco(),
] satisfies Transform[]

