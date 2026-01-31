#!/usr/bin/env node
/**
 * End-to-end test: dashboard API, progress, and review trigger.
 * Run from repo root: node scripts/e2e-test.js
 * Prerequisites: dashboard built (npm run dashboard:build), dashboard not running (or we start it).
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BASE = 'http://localhost:7700';

async function fetch(url, opts = {}) {
  const res = await globalThis.fetch(url, opts);
  return { ok: res.ok, status: res.status, json: () => res.json(), text: () => res.text() };
}

async function main() {
  console.log('E2E Test: Dashboard + Review pipeline\n');
  console.log('='.repeat(50));

  // 1. Progress API
  console.log('\n1. GET /api/progress');
  try {
    const r = await fetch(`${BASE}/api/progress`);
    if (!r.ok) throw new Error(`Status ${r.status}`);
    const data = await r.json();
    console.log('   OK – pathway:', data.pathway?.name, '| courses:', Object.keys(data.courses || {}).length);
  } catch (e) {
    console.log('   FAIL –', e.message);
    console.log('   Is the dashboard running? Start: npm run dashboard');
    process.exit(1);
  }

  // 2. Courses API
  console.log('\n2. GET /api/courses');
  try {
    const r = await fetch(`${BASE}/api/courses?page=1&limit=5`);
    if (!r.ok) throw new Error(`Status ${r.status}`);
    const data = await r.json();
    console.log('   OK – total courses:', data.total, '| page:', data.page);
  } catch (e) {
    console.log('   FAIL –', e.message);
    process.exit(1);
  }

  // 3. Challenge detail (instructions)
  console.log('\n3. GET /api/courses/01-react-fundamentals/challenges/01-static-task-display');
  try {
    const r = await fetch(`${BASE}/api/courses/01-react-fundamentals/challenges/01-static-task-display`);
    if (!r.ok) throw new Error(`Status ${r.status}`);
    const data = await r.json();
    const hasInstructions = (data.instructions || '').length > 0;
    console.log('   OK – instructions:', hasInstructions ? 'yes' : 'no', '| score:', data.score ?? '—');
  } catch (e) {
    console.log('   FAIL –', e.message);
    process.exit(1);
  }

  // 4. POST /api/review (run review for one challenge)
  console.log('\n4. POST /api/review (01-react-fundamentals / 01-static-task-display)');
  try {
    const r = await fetch(`${BASE}/api/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId: '01-react-fundamentals', challengeId: '01-static-task-display' })
    });
    const data = await r.json();
    if (!data.ok) throw new Error(data.error || 'Review failed');
    console.log('   OK – progress updated, lastRun:', data.progress?.courses?.['01-react-fundamentals']?.challenges?.['01-static-task-display']?.lastRun ? 'yes' : '—');
  } catch (e) {
    console.log('   FAIL –', e.message);
    process.exit(1);
  }

  console.log('\n' + '='.repeat(50));
  console.log('E2E tests passed. Dashboard and review pipeline are working.');
  console.log('\nTo enable AI review: set GROQ_API_KEY, then run: npm run test:ai-review');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
