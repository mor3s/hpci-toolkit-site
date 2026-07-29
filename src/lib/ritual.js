// Definition-side relationship for a step (mirrors the toolkit's mapping).
const REL = {
  say:    () => ({ rel: 'say',    from: 'machine', to: 'human' }),
  ask:    () => ({ rel: 'ask',    from: 'human',   to: 'machine' }),
  sense:  (s) => ({ rel: 'sense', from: s.target === 'human' ? 'human' : 'plant', to: 'machine' }),
  act:    (s) => ({ rel: 'act',   from: 'machine', to: s.target === 'human' ? 'human' : 'plant' }),
  tend:   () => ({ rel: 'tend',   from: 'human',   to: 'plant' }),
  attend: () => ({ rel: 'attend', from: 'plant',   to: 'human' }),
};
const ORDER = ['sense', 'act', 'say', 'ask', 'tend', 'attend'];


// --- Step-by-step (transcript-style) view ---
const TYPE_GLYPH = {
  say: '💬', ask: '❓', sense: '🔍', act: '💡',
  tend: '🌿', attend: '👁️', wait: '⏳',
};
const UI      = { g: '🖥️', label: 'UI' };
const MACHINE = { g: '🖥️', label: 'Machine' };
const HUMAN   = { g: '🧑', label: 'You' };
const PLANT   = { g: '🌱', label: 'Plant' };

function stepChain(step) {
  switch (step.type) {
    case 'say':    return [UI, HUMAN];
    case 'ask':    return [HUMAN, UI];
    case 'sense':  return [step.target === 'human' ? HUMAN : PLANT, MACHINE];
    case 'act':    return [MACHINE, step.target === 'human' ? HUMAN : PLANT];
    case 'tend':   return [UI, HUMAN, PLANT];
    case 'attend': return [UI, HUMAN, PLANT];
    default:       return [];
  }
}

function stepContent(step) {
  switch (step.type) {
    case 'say':
    case 'ask':
    case 'tend':
    case 'attend': return `"${step.text ?? ''}"`;
    case 'sense':  return `if ${step.sensor ?? '?'} ${step.op ?? ''} ${step.value ?? ''}`;
    case 'act': {
      const c = step.color || {};
      return `set ${step.output ?? 'output'} → rgb(${c.r ?? 0},${c.g ?? 0},${c.b ?? 0})`;
    }
    case 'wait':   return `wait ${step.duration_ms ?? '?'}ms`;
    default:       return '';
  }
}

function stepAnswers(step) {
  if (step.type !== 'ask') return null;
  const opts = step.options || (step.answer_routes ? Object.keys(step.answer_routes) : null);
  return opts && opts.length ? opts : null;
}

export function deriveSteps(def) {
  const out = [];
  let n = 0;
  for (const [id, step] of Object.entries(def.steps || {})) {
    if (step.type === 'end') continue;
    n += 1;
    out.push({
      n, id, type: step.type,
      glyph: TYPE_GLYPH[step.type] || '•',
      chain: stepChain(step),
      content: stepContent(step),
      answers: stepAnswers(step),
    });
  }
  return out;
}


export function deriveRelationships(def) {
  const seen = new Map();
  for (const step of Object.values(def.steps || {})) {
    const fn = REL[step.type];
    if (!fn) continue;
    const r = fn(step);
    const key = `${r.rel}:${r.from}->${r.to}`;
    if (!seen.has(key)) seen.set(key, { ...r, label: `${r.rel} · ${r.from} → ${r.to}` });
  }
  return [...seen.values()].sort((a, b) => ORDER.indexOf(a.rel) - ORDER.indexOf(b.rel));
}

export function deriveHardware(def) {
  const sensors = new Set(), outputs = new Set();
  for (const step of Object.values(def.steps || {})) {
    if (step.type === 'sense' && step.sensor) sensors.add(step.sensor);
    if (step.type === 'act' && step.output) outputs.add(step.output);
  }
  return { sensors: [...sensors], outputs: [...outputs] };
}

// --- Mermaid generation ---
const esc = (s = '') => String(s).replace(/"/g, '&quot;').replace(/\s+/g, ' ').trim();
const edgeLabel = (s = '') => String(s).replace(/[^\w \-]/g, '').trim().slice(0, 14) || '…';
const trunc = (s = '', n = 28) => (String(s).length > n ? String(s).slice(0, n - 1) + '…' : String(s));
const nid = (id) => 'n_' + String(id).replace(/[^a-zA-Z0-9_]/g, '_');

function label(step) {
  switch (step.type) {
    case 'say':    return `say: "${esc(trunc(step.text))}"`;
    case 'ask':    return `ask: "${esc(trunc(step.text))}"`;
    case 'wait':   return `wait ${step.duration_ms ?? '?'}ms`;
    case 'act':    return `act: ${esc(step.output ?? 'output')}`;
    case 'sense':  return `sense: ${esc(step.sensor ?? '?')} ${esc(step.op ?? '')} ${esc(step.value ?? '')}`;
    case 'tend':   return `tend: "${esc(trunc(step.text))}"`;
    case 'attend': return `attend: "${esc(trunc(step.text))}"`;
    case 'end':    return 'end';
    default:       return esc(step.type);
  }
}

export function toMermaid(def) {
  const steps = def.steps || {};
  const lines = ['flowchart TD'];
  for (const [id, step] of Object.entries(steps)) {
    const n = nid(id), t = label(step);
    const branching = step.type === 'sense' || (step.type === 'ask' && step.answer_routes);
    if (branching)               lines.push(`  ${n}{"${t}"}`);
    else if (step.type === 'end') lines.push(`  ${n}(["${t}"])`);
    else                          lines.push(`  ${n}("${t}")`);
  }
  for (const [id, step] of Object.entries(steps)) {
    const from = nid(id);
    if (step.type === 'sense') {
      if (step.then) lines.push(`  ${from} -->|pass| ${nid(step.then)}`);
      if (step.else) lines.push(`  ${from} -->|else| ${nid(step.else)}`);
    } else if (step.type === 'ask' && step.answer_routes) {
      for (const [ans, target] of Object.entries(step.answer_routes))
        lines.push(`  ${from} -->|${edgeLabel(ans)}| ${nid(target)}`);
      if (step.next) lines.push(`  ${from} --> ${nid(step.next)}`);
    } else if (step.type !== 'end' && step.next) {
      lines.push(`  ${from} --> ${nid(step.next)}`);
    }
  }
  if (def.start) lines.push(`  start(( )) --> ${nid(def.start)}`);
  return lines.join('\n');
}