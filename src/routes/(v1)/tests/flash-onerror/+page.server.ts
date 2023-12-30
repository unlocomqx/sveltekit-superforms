import type { Actions, PageServerLoad } from './$types.js';
import { superValidate } from '$lib/server/index.js';
import { zod } from '$lib/adapters/index.js';

import { schema } from './schema';
import { error } from '@sveltejs/kit';

export const load = (async () => {
	const form = await superValidate(zod(schema));
	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async () => {
		throw error(500);
	}
} satisfies Actions;
