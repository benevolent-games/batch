
export type Task<T = any> = () => Promise<T>

export async function concurrently<T>(
		limit: number,
		tasks: Task<T>[],
	): Promise<T[]> {

	tasks.reverse()
	const originalTaskCount = tasks.length

	let happening = 0
	const finished: T[] = []

	return new Promise<T[]>((resolve, reject) => {
		function check() {
			const done = finished.length === originalTaskCount
			const tasksAreAvailable = tasks.length > 0
			const belowCapacity = happening < limit

			if (done)
				return resolve(finished)

			else if (tasksAreAvailable && belowCapacity) {
				const task = tasks.pop()!
				happening++
				task()
					.then(result => {
						finished.push(result)
					})
					.catch(reject)
					.finally(() => {
						happening--
						check()
					})
			}
		}

		for (const _ of Array(limit))
			check()
	})
}

