import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://loquacious-mandazi-e99539.netlify.app',   // set once you have the URL (step 7)
	integrations: [
		starlight({
			title: 'HPCI Toolkit',
			customCss: ['./src/styles/custom.css'],
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
						{ label: 'Overview', slug: 'showcase' },
						{ label: 'Veyra', slug: 'showcase/veyra' },
						{ label: 'Ritual Grove', slug: 'showcase/ritual-grove' },
					],
				},
			],
		}),
	],
});