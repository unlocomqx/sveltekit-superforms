import {superValidate} from '$lib/index.js';
import {z} from 'zod';
import {zod} from '$lib/adapters/zod.js';

const schema = z.object({
	id: z.string(),
	options: z.record(z.string(), z.object({
		label: z.string().refine(value => value.length > 0, {
			message: "Label is required"
		}),
	})),
})

const row = {
	id: "1",
	options: {
		"1": {
			label: "Option 1",
		},
		"2": {
			label: "",
		},
	}
}

export const actions = {
	async save({request}) {
		const form = await superValidate(request, zod(schema))

		console.log(form)
	}
}

export const load = async () => {
	const form = await superValidate(row, zod(schema));

	return {form}
};