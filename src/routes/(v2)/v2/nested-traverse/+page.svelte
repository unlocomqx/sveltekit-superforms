<script lang="ts">
	import { superForm } from '$lib/index.js';
	import type { PageData } from './$types.js';

	export let data: PageData;

	const { form, enhance } = superForm(data.form, {
		dataType: 'json'
	});
	$: console.log($form);
</script>

<h1>Nested data validation issue</h1>

<form action="?/save" method="post" use:enhance>
	{#each Object.entries($form.options) as [id] (id)}
		<div>
			<label for="label-{id}">Label</label>
			<input bind:value={$form.options[id].label} id="label" type="text">
		</div>
	{/each}
	<p>
		<button type="submit">Save</button>
	</p>
</form>