import { Octokit } from '@octokit/core';
import { createPullRequest } from 'octokit-plugin-create-pull-request';

const MyOctokit = Octokit.plugin(createPullRequest);
const OWNER = 'mor3s';
const REPO = 'hpci-toolkit-site';

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').slice(0, 60);
const yamlEscape = (s = '') => `"${String(s).replace(/"/g, '\\"')}"`;
const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  let body;
  try { body = await req.json(); } catch { return json({ error: 'Invalid request body.' }, 400); }

  const { title, description, authorName, tags, content, hp } = body;

  if (hp) return json({ ok: true });                        // honeypot: silently drop bots
  if (!title || !description || !authorName || !content) {
    return json({ error: 'Please fill in title, description, author, and the post body.' }, 400);
  }
  if (String(content).length < 200) {
    return json({ error: 'The post body looks very short — please write a little more.' }, 400);
  }

  const slug = slugify(title) || `post-${Date.now()}`;
  const tagList = String(tags || '').split(',').map((t) => t.trim()).filter(Boolean);

  const file = [
    '---',
    `title: ${yamlEscape(title)}`,
    `description: ${yamlEscape(description)}`,
    `author: ${yamlEscape(authorName)}`,
    `date: ${new Date().toISOString().slice(0, 10)}`,
    `tags: [${tagList.map(yamlEscape).join(', ')}]`,
    'draft: true',                                          // stays unpublished until you flip it
    '---',
    '',
    String(content).trim(),
    '',
  ].join('\n');

  const token = process.env.GITHUB_TOKEN;
  if (!token) return json({ error: 'Server is not configured to accept submissions yet.' }, 500);

  try {
    const octokit = new MyOctokit({ auth: token });
    const pr = await octokit.createPullRequest({
      owner: OWNER,
      repo: REPO,
      title: `Blog submission: ${title}`,
      body: `Submitted via the blog form by **${authorName}**.\n\nArrives as \`draft: true\` — merging adds the file; set \`draft: false\` to publish. Use the Netlify deploy preview to read it rendered.`,
      head: `post-${slug}-${Date.now()}`,
      base: 'main',
      changes: [{
        files: { [`src/content/blog/${slug}.md`]: file },
        commit: `Add blog submission: ${title}`,
      }],
    });
    return json({ ok: true, url: pr.data.html_url });
  } catch {
    return json({ error: 'Could not open a pull request. Please try again later.' }, 502);
  }
};