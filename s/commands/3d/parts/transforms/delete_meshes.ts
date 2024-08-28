
import {Document} from "@gltf-transform/core"

export function delete_meshes(...selectors: string[]) {
	return (document: Document) => {
		for (const node of document.getRoot().listNodes()) {
			const name = node.getName()
			const hasSelector = selectors.some(selector => name.includes(selector))

			if (hasSelector)
				node.setMesh(null)
		}
	}
}

