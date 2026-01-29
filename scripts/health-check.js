#!/usr/bin/env node

/**
 * Health Check Script
 * Validates that the entire system is ready for use
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

let errors = 0;
let warnings = 0;

console.log('🏥 Running Health Check...\n');
console.log('='.repeat(60));

// Check Node.js version
console.log('\n📦 Checking Node.js version...');
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
  const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
  if (majorVersion >= 20) {
    console.log(`   ✅ Node.js ${nodeVersion} (required: v20+)`);
  } else {
    console.log(`   ❌ Node.js ${nodeVersion} (required: v20+)`);
    errors++;
  }
} catch (error) {
  console.log('   ❌ Node.js not found');
  errors++;
}

// Check npm
console.log('\n📦 Checking npm...');
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
  console.log(`   ✅ npm ${npmVersion}`);
} catch (error) {
  console.log('   ❌ npm not found');
  errors++;
}

// Check course structures (from pathway config)
console.log('\n📚 Checking course structures...');
let courseIds = [];
try {
  const pathwayPath = join(ROOT_DIR, 'pathway-review', 'pathway-config.json');
  if (existsSync(pathwayPath)) {
    const pathway = JSON.parse(readFileSync(pathwayPath, 'utf-8'));
    courseIds = (pathway.courses || []).map(c => c.id);
  }
} catch (e) { /* ignore */ }

for (const courseId of courseIds) {
  const courseDir = join(ROOT_DIR, 'courses', courseId);
  if (!existsSync(courseDir)) {
    console.log(`   ❌ Course ${courseId} directory not found`);
    errors++;
    continue;
  }
  const projectDir = join(courseDir, 'project');
  const reviewEngineDir = join(courseDir, 'review-engine');
  if (!existsSync(join(projectDir, 'package.json'))) {
    console.log(`   ❌ ${courseId}: project/package.json missing`);
    errors++;
  } else {
    console.log(`   ✅ ${courseId}: project OK`);
  }
  if (!existsSync(join(reviewEngineDir, 'index.js'))) {
    console.log(`   ❌ ${courseId}: review-engine/index.js missing`);
    errors++;
  } else {
    console.log(`   ✅ ${courseId}: review engine OK`);
  }
  if (!existsSync(join(courseDir, 'course-config.json'))) {
    console.log(`   ❌ ${courseId}: course-config.json missing`);
    errors++;
  }
}

// Check global review
console.log('\n🌐 Checking global review system...');
const globalReviewFiles = [
  'global-review/run-all-reviews.js',
  'global-review/scoring-engine/index.js',
  'global-review/ai-review/index.js'
];
for (const file of globalReviewFiles) {
  if (!existsSync(join(ROOT_DIR, file))) {
    console.log(`   ❌ Missing: ${file}`);
    errors++;
  }
}
if (errors === 0) {
  console.log('   ✅ Global review system OK');
}

// Check pathway config
console.log('\n📋 Checking pathway configuration...');
if (!existsSync(join(ROOT_DIR, 'pathway-review', 'pathway-config.json'))) {
  console.log('   ❌ pathway-config.json missing');
  errors++;
} else {
  console.log('   ✅ Pathway configuration OK');
}

// Check GitHub Actions
console.log('\n⚙️  Checking GitHub Actions...');
if (!existsSync(join(ROOT_DIR, '.github', 'workflows', 'solo-skill-review.yml'))) {
  console.log('   ⚠️  GitHub Actions workflow not found');
  warnings++;
} else {
  console.log('   ✅ GitHub Actions workflow OK');
}

// Dependencies (optional)
console.log('\n📦 Checking dependencies (optional)...');
let depsInstalled = 0;
for (const courseId of courseIds) {
  const nodeModules = join(ROOT_DIR, 'courses', courseId, 'project', 'node_modules');
  if (existsSync(nodeModules)) depsInstalled++;
}
if (depsInstalled === 0 && courseIds.length > 0) {
  console.log('   ⚠️  No dependencies installed (run setup scripts)');
  warnings++;
} else if (courseIds.length > 0) {
  console.log(`   ✅ Dependencies installed for ${depsInstalled}/${courseIds.length} courses`);
}

console.log('\n' + '='.repeat(60));
console.log('📊 Health Check Summary');
console.log('='.repeat(60));
if (errors === 0 && warnings === 0) {
  console.log('✅ All checks passed! System is healthy.');
  process.exit(0);
} else {
  if (errors > 0) console.log(`❌ Found ${errors} error(s)`);
  if (warnings > 0) console.log(`⚠️  Found ${warnings} warning(s)`);
  process.exit(errors > 0 ? 1 : 0);
}
