
import {$} from "zx"
import {dirname} from "path"

/** given an array of file paths, use `mkdir -p` to ensure their directories exist */
export async function assertDirectories(paths: string[]) {
	await $`mkdir -p ${paths.map(p => dirname(p))}`
}

