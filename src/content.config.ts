import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

const rituals = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/rituals' }),
  schema: z.object({
    title: z.string(),
    author: z.object({ name: z.string(), url: z.string().url().optional() }),
    summary: z.string(),
    context: z.enum(['general', 'veyra', 'rewilding', 'other']),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date().optional(),
    // The toolkit's exported ritual definition. Validated loosely at the
    // envelope level; step shapes vary, so the parser stays defensive.
    definition: z.object({
      name: z.string(),
      devices: z
        .record(z.string(), z.object({ device_id: z.string(), role: z.enum(['read', 'write']) }))
        .optional(),
      start: z.string(),
      steps: z.record(z.string(), z.any()),
    }),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    context: z.enum(['game', 'rewilding', 'other']),
    order: z.number().default(0),
    cover: z.string().optional(),      // reserved for an image later
    coverAlt: z.string().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  rituals,
  gallery,
  blog,
};