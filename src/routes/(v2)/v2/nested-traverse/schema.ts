import { z } from 'zod';

const deficitForm = z.object({
	grade: z.number().min(0).max(100).nullable().default(null).refine(value => value === null || value >= 0, {
		message: 'Grade must be greater than or equal to 0'
	}),
	comments: z.record(z.string()).default({}).refine(value => Object.values(value).every(v => v.length <= 10), {
		message: 'Comments must be less than 10 characters'
	})
});

const sideData = z.object({
	left: deficitForm,
	right: deficitForm
});

export const nerveForm = z.object({
	motor: sideData,
	sensory: sideData,
	dysesthesia: sideData
});

const schema = z.object({
	id: z.string(),
	options: z.record(z.string(), z.object({
		label: z.string().refine(value => value.length > 0, {
			message: "Label is required",
			path: ['error'], // without this, the error happens
		}),
	})),
})
