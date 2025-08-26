#!/usr/bin/env node
// Generate a static HTML snapshot of all products and related info from the DB
// Usage: DATABASE_URL=... node test/generate-products-html.mjs
// Output: test/products.html and test/products.data.json

import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load DATABASE_URL from repo root .env, else .env.example
if (!process.env.DATABASE_URL) {
  try {
    const rootEnvPath = resolve(__dirname, '../.env');
    if (existsSync(rootEnvPath)) {
      const content = readFileSync(rootEnvPath, 'utf8');
      for (const line of content.split(/\r?\n/)) {
        const m = line.match(/^DATABASE_URL=(.*)$/);
        if (m) {
          let val = m[1].trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
          process.env.DATABASE_URL = val; break;
        }
      }
    }
    if (!process.env.DATABASE_URL) {
      const exampleEnvPath = resolve(__dirname, '../.env.example');
      if (existsSync(exampleEnvPath)) {
        const content = readFileSync(exampleEnvPath, 'utf8');
        for (const line of content.split(/\r?\n/)) {
          const m = line.match(/^DATABASE_URL=(.*)$/);
          if (m) {
            let val = m[1].trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
            process.env.DATABASE_URL = val; break;
          }
        }
      }
    }
  } catch {}
}

let PrismaClient;
try { ({ PrismaClient } = await import('@prisma/client')); }
catch (e) {
  console.error('Erreur: @prisma/client introuvable. Lancez: npx prisma generate --schema apps/api/prisma/schema.prisma');
  console.error(e?.message || e); process.exit(1);
}

const prisma = new PrismaClient({ log: process.env.NODE_ENV === 'development' ? ['error','warn'] : ['error'] });

function escapeHtml(s){return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');}

function layout({ title, body }){
  return `<!doctype html>
  <html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body{background:#09090b;color:#fafafa;font-family:Inter,system-ui,sans-serif;font-weight:300}
      .card{background:rgba(24,24,27,.6);border:1px solid rgba(63,63,70,.2);backdrop-filter:blur(8px);transition:all .3s}
      .card:hover{border-color:rgba(113,113,122,.3)}
      .mono{font-variant-ligatures:none}
      .json{white-space:pre-wrap;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;font-size:.85rem}
      .table th,.table td{border-bottom:1px solid rgba(63,63,70,.3)}
      .badge{background:#fff;color:#0a0a0a;padding:.125rem .5rem;font-size:.7rem;letter-spacing:.05em}
    </style>
  </head>
  <body>
    <header class="sticky top-0 z-10 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800/50">
      <div class="container mx-auto px-6 py-4 flex items-center justify-between">
        <div class="text-lg tracking-wide">VMCloud — Produits (snapshot)</div>
        <div class="text-xs text-zinc-500">Généré: ${escapeHtml(new Date().toLocaleString())}</div>
      </div>
    </header>
    ${body}
  </body>
  </html>`;
}

function render(products){
  const items = products.map((p) => {
    const specs = p.specsJson ? `<pre class="json text-zinc-300">${escapeHtml(JSON.stringify(p.specsJson, null, 2))}</pre>` : '<div class="text-zinc-500 text-sm">—</div>';
    const pricing = p.pricingJson ? `<pre class="json text-zinc-300">${escapeHtml(JSON.stringify(p.pricingJson, null, 2))}</pre>` : '<div class="text-zinc-500 text-sm">—</div>';
    const features = p.featuresJson ? `<pre class="json text-zinc-300">${escapeHtml(JSON.stringify(p.featuresJson, null, 2))}</pre>` : '<div class="text-zinc-500 text-sm">—</div>';
    const instances = (p.instances||[]).map(i=>`
      <tr>
        <td class="py-1 pr-3"><code class="mono">${escapeHtml(i.id)}</code></td>
        <td class="py-1 pr-3"><span class="badge">${escapeHtml(i.status)}</span></td>
        <td class="py-1 pr-3">${escapeHtml(i.name || '—')}</td>
        <td class="py-1 pr-3">${escapeHtml(i.hostname || '—')}</td>
        <td class="py-1 pr-3 text-zinc-400">${escapeHtml(i.userId||'')}</td>
        <td class="py-1 text-zinc-400">${i.createdAt ? escapeHtml(new Date(i.createdAt).toLocaleString()) : ''}</td>
      </tr>
    `).join('');
    return `
      <section class="card p-6 md:p-8">
        <div class="flex items-start justify-between gap-6">
          <div>
            <div class="text-xs tracking-widest text-zinc-500">${escapeHtml(p.category || 'PRODUIT')}</div>
            <h2 class="mt-1 text-2xl font-light">${escapeHtml(p.name)} <span class="text-zinc-500 text-sm">/${escapeHtml(p.slug)}</span></h2>
            <p class="mt-2 text-zinc-400 max-w-prose">${escapeHtml(p.description || '')}</p>
          </div>
          <div class="text-right text-sm text-zinc-400">
            <div>Statut: <span class="badge">${escapeHtml(p.status)}</span></div>
            <div class="mt-1">Ordre: ${p.sortOrder ?? ''}</div>
            <div class="mt-1">Instances liées: ${p._count?.instances ?? (p.instances?.length ?? 0)}</div>
            <div class="mt-1">Créé: ${p.createdAt ? escapeHtml(new Date(p.createdAt).toLocaleString()) : ''}</div>
            <div>MAJ: ${p.updatedAt ? escapeHtml(new Date(p.updatedAt).toLocaleString()) : ''}</div>
          </div>
        </div>
        <div class="grid md:grid-cols-3 gap-6 mt-6">
          <div>
            <h3 class="text-sm text-zinc-300 mb-2">Specs</h3>
            ${specs}
          </div>
          <div>
            <h3 class="text-sm text-zinc-300 mb-2">Pricing</h3>
            ${pricing}
          </div>
          <div>
            <h3 class="text-sm text-zinc-300 mb-2">Features</h3>
            ${features}
          </div>
        </div>
        <div class="mt-6">
          <h3 class="text-sm text-zinc-300 mb-2">Instances</h3>
          ${instances ? `<div class="overflow-x-auto"><table class="table w-full text-sm">
            <thead class="text-zinc-400"><tr>
              <th class="py-2 pr-3 text-left">ID</th>
              <th class="py-2 pr-3 text-left">Statut</th>
              <th class="py-2 pr-3 text-left">Nom</th>
              <th class="py-2 pr-3 text-left">Hostname</th>
              <th class="py-2 pr-3 text-left">User</th>
              <th class="py-2 text-left">Créée</th>
            </tr></thead>
            <tbody>${instances}</tbody>
          </table></div>` : '<div class="text-zinc-500 text-sm">Aucune instance.</div>'}
        </div>
      </section>
    `;
  }).join('\n');
  return layout({ title: 'Listing Produits — VMCloud', body: `<main class="container mx-auto px-6 py-10 space-y-6">${items || '<div class=\'text-zinc-400\'>Aucun produit trouvé.</div>'}</main>` });
}

async function main(){
  try {
    const products = await prisma.product.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: {
        _count: { select: { instances: true } },
        instances: { orderBy: { createdAt: 'desc' }, select: { id:true,status:true,createdAt:true,userId:true,name:true,hostname:true } }
      }
    });
    const html = render(products);
    const outHtml = resolve(__dirname, 'products.snapshot.html');
    const outJson = resolve(__dirname, 'products.data.json');
    writeFileSync(outHtml, html, 'utf8');
    writeFileSync(outJson, JSON.stringify(products, null, 2), 'utf8');
    console.log('Fichiers générés:', outHtml, 'et', outJson);
  } catch (e) {
    console.error('Erreur lors de la génération:', e?.message || e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

await main();

