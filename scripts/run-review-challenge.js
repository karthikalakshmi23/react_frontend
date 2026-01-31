#!/usr/bin/env node
/**
 * Run review for a single challenge. Updates progress after.
 * Usage: node scripts/run-review-challenge.js --course=01-react-fundamentals --challenge=01-static-task-display
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

function main() {
  const args = process.argv.slice(2);
  const courseArg = args.find(a => a.startsWith('--course='));
  const challengeArg = args.find(a => a.startsWith('--challenge='));
  const courseId = courseArg ? courseArg.split('=')[1] : null;
  const challengeId = challengeArg ? challengeArg.split('=')[1] : null;
  if (!courseId || !challengeId) {
    console.error('Usage: node scripts/run-review-challenge.js --course=<courseId> --challenge=<challengeId>');
    console.error('Example: node scripts/run-review-challenge.js --course=01-react-fundamentals --challenge=01-static-task-display');
    process.exit(1);
  }

  const courseDir = join(ROOT_DIR, 'courses', courseId);
  const reviewScript = join(courseDir, 'review-engine', 'index.js');
  if (!existsSync(reviewScript)) {
    console.error(`❌ Review engine not found: ${courseId}`);
    process.exit(1);
  }

  console.log(`📝 Reviewing ${courseId} → ${challengeId}\n`);
  execSync(`node "${reviewScript}" --challenge=${challengeId}`, { cwd: courseDir, stdio: 'inherit' });
  console.log('\n📊 Updating progress...');
  execSync('node scripts/update-progress.js', { cwd: ROOT_DIR, stdio: 'inherit' });
  console.log('\n✅ Done.');
}

main();
