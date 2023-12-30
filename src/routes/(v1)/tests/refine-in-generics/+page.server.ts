import type { Actions, PageServerLoad } from './$types.js';
import { superValidate } from '$lib/server/index.js';
import { zod } from '$lib/adapters/index.js';

import { RegisterSchema } from './schemas.js';

export const load = (async (event) => {
	const form = await superValidate(event, RegisterSchema);
	return { form };
}) satisfies PageServerLoad;

type FormSubmitResultMessage = {
	status: 'error' | 'success';
	text: string;
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const form = await superValidate<typeof RegisterSchema, FormSubmitResultMessage>(
			data,
			RegisterSchema
		);
		console.log('POST', form);

		return { form };
	}
} satisfies Actions;
