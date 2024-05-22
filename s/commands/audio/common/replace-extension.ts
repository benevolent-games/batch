
export function replaceExtension(
		filepath: string,
		extension: string,
		suffix?: string,
	) {

	if (filepath.includes(".")) {
		const parts = filepath.split(".")
		parts.pop()

		if (suffix)
			parts.push(suffix)

		parts.push(extension)
		return parts.join(".")
	}

	else return filepath
}

