import adapter from 'svelte-adapter-bun';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import * as child_process from 'node:child_process';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	compilerOptions: {
		experimental: {
			async: true,
		}
	},
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		experimental: {
			remoteFunctions: true
		},
		adapter: adapter({
			out: 'dist'
		}),
		alias: {
			'@/*': './src/lib/*'
		},
		version: {
			pollInterval: 3000,
			name: child_process.execSync('git rev-parse HEAD').toString().trim()
		}
	}
};

export default config;
