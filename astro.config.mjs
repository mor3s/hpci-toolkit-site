import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://hpci-toolkit.netlify.app',   // set once you have the URL (step 7)
	integrations: [
		starlight({
			title: 'HPCI Toolkit',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/mor3s/hpci-toolkit' },
			],
			sidebar: [
				{ label: 'Understand', items: ['concepts'] },
				{ label: 'Tutorial', items: [{ autogenerate: { directory: 'tutorial' } }] },
				{ label: 'Developers', items: [{ autogenerate: { directory: 'developers' } }] },
				{
					label: 'Showcase',
					items: [
						{ label: 'Veyra', slug: 'showcase/veyra' },
						{ label: 'Ritual Grove', slug: 'showcase/ritual-grove' },
					],
				},
			],
		}),
	],
});