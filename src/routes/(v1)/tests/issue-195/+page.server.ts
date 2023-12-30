import type { Actions, PageServerLoad } from './$types.js';
import { message, superValidate } from '$lib/server/index.js';
import { zod } from '$lib/adapters/index.js';

import { schema } from './schema';
import { fail } from '@sveltejs/kit';

export const load = (async () => {
	const form = await superValidate(zod(schema));
	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		console.log('🚀 ~ file: +page.server.ts:14 ~ default: ~ formData:', formData);
		const form = await superValidate(formData, zod(schema));

		console.log('POST', form);

		if (!form.valid) return fail(400, { form });

		return message(form, 'Posted OK!');
	}
} satisfies Actions;
