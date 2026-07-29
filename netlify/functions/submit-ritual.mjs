import { Octokit } from '@octokit/core';
import { createPullRequest } from 'octokit-plugin-create-pull-request';

const MyOctokit = Octokit.plugin(createPullRequest);
const OWNER = 'mor3s';
const REPO = 'hpci-toolkit-site';

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').slice(0, 60);

// Light structural validation of a ritual definition.
function validateDefinition(def) {
  if (typeof def !== 'object' || def === null) return 'Definition must be a JSON object.';
  if (!def.name) return 'Definition is missing a "name".';
  if (!def.start) return 'Definition is missing a "start" step id.';
  if (!def.steps || typeof def.steps !== 'object') return 'Definition is missing "steps".';
  if (!def.steps[def.start]) return `"start" points to "${def.start}", which is not a step.`;
  const ids = new Set(Object.keys(def.steps));
  for (const [id, step] of Object.entries(def.steps)) {
    for (const key of ['next', 'then', 'else']) {
      if (step[key] && !ids.has(step[key])) return `Step "${id}" points to "${step[key]}", which does not exist.`;
    }
    if (step.answer_routes) {
      for (const target of Object.values(step.answer_routes)) {
        if (!ids.has(target)) return `Step "${id}" routes to "${target}", which does not exist.`;
      }
    }
  }
  return null; // valid
}

const yamlEscape = (s = '') => `"${String(s).replace(/"/g, '\\"')}"`;

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  let body;
  try { body = await req.json(); } catch { return json({ error: 'Invalid request body.' }, 400); }

  const { title, summary, authorName, authorUrl, context, tags, definitionText, hp } = body;

  // Honeypot: bots fill hidden fields; humans leave them empty.
  if (hp) return json({ ok: true }); // silently accept-and-drop

  if (!title || !summary || !authorName || !definitionText) {
    return json({ error: 'Please fill in title, summary, author, and the ritual JSON.' }, 400);
  }

  let definition;
  try { definition = JSON.parse(definitionText); }
  catch { return json({ error: 'The ritual JSON could not be parsed. Paste the exported definition exactly.' }, 400); }

  const problem = validateDefinition(definition);
  if (problem) return json({ error: problem }, 400);

  const slug = slugify(title) || `ritual-${Date.now()}`;
  const tagList = String(tags || '').split(',').map((t) => t.trim()).filter(Boolean);
  const ctx = ['general', 'veyra', 'rewilding', 'other'].includes(context) ? context : 'other';

  const frontmatter = [
    '---',
    `title: ${yamlEscape(title)}`,
    'author:',
    `  name: ${yamlEscape(authorName)}`,
    ...(authorUrl ? [`  url: ${yamlEscape(authorUrl)}`] : []),
    `summary: ${yamlEscape(summary)}`,
    `context: ${ctx}`,
    `tags: [${tagList.map(yamlEscape).join(', ')}]`,
    `date: ${new Date().toISOString().slice(0, 10)}`,
    `definition: ${JSON.stringify(definition)}`,
    '---',
    '',
    body.writeup ? String(body.writeup) : '_A ritual shared with the library._',
    '',
  ].join('\n');

  const token = process.env.GITHUB_TOKEN;
  if (!token) return json({ error: 'Server is not configured to accept submissions yet.' }, 500);

  try {
    const octokit = new MyOctokit({ auth: token });
    const pr = await octokit.createPullRequest({
      owner: OWNER,
      repo: REPO,
      title: `Ritual submission: ${title}`,
      body: `Submitted via the ritual library form by **${authorName}**.\n\nReview the added file, and use the Netlify deploy preview to see it rendered before merging.`,
      head: `ritual-${slug}-${Date.now()}`,
      base: 'main',
      changes: [{
        files: { [`src/content/rituals/${slug}.md`]: frontmatter },
        commit: `Add ritual: ${title}`,
      }],
    });
    return json({ ok: true, url: pr.data.html_url });
  } catch (e) {
    return json({ error: 'Could not open a pull request. Please try again later.' }, 502);
  }
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });