#!/usr/bin/env node

/**
 * Complete Setup Script
 * 
 * Installs all dependencies and Playwright browsers for all courses.
 * Run this once after cloning the repository.
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..');
const PATHWAY_CONFIG = join(REPO_ROOT, 'pathway-review', 'pathway-config.json');

function getCourseIds() {
  if (!existsSync(PATHWAY_CONFIG)) return [];
  const pathway = JSON.parse(readFileSync(PATHWAY_CONFIG, 'utf-8'));
  return (pathway.courses || []).map(c => c.id);
}

const courses = getCourseIds();
if (courses.length === 0) {
  console.warn('⚠️  No courses found in pathway-review/pathway-config.json. Add courses there, then run setup again.');
}

console.log('🚀 Challenge Engine - Complete Setup\n');
console.log('This will install all dependencies and Playwright browsers.');
console.log('This may take a few minutes...\n');

// Step 1: Install root dependencies (dashboard)
console.log('📦 Step 1/4: Installing dashboard dependencies...');
try {
  execSync('npm install', { cwd: join(REPO_ROOT, 'dashboard', 'app'), stdio: 'inherit' });
  console.log('✅ Dashboard dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install dashboard dependencies');
  process.exit(1);
}

// Step 2: Install all course project dependencies
console.log('📦 Step 2/4: Installing course project dependencies...');
for (const course of courses) {
  const projectDir = join(REPO_ROOT, 'courses', course, 'project');
  if (existsSync(join(projectDir, 'package.json'))) {
    console.log(`   Installing dependencies for ${course}...`);
    try {
      execSync('npm install', { cwd: projectDir, stdio: 'inherit' });
      console.log(`   ✅ ${course} dependencies installed`);
    } catch (error) {
      console.error(`   ❌ Failed to install ${course} dependencies`);
    }
  }
}
console.log('');

// Step 3: Install review engine dependencies
console.log('📦 Step 3/4: Installing review engine dependencies...');
for (const course of courses) {
  const reviewEngineDir = join(REPO_ROOT, 'courses', course, 'review-engine');
  if (existsSync(join(reviewEngineDir, 'package.json'))) {
    console.log(`   Installing review engine for ${course}...`);
    try {
      execSync('npm install', { cwd: reviewEngineDir, stdio: 'inherit' });
      console.log(`   ✅ ${course} review engine installed`);
    } catch (error) {
      console.error(`   ❌ Failed to install ${course} review engine`);
    }
  }
}
console.log('');

// Step 4: Install Playwright browsers for all courses
console.log('🌐 Step 4/4: Installing Playwright browsers (this may take a few minutes)...');
for (const course of courses) {
  const projectDir = join(REPO_ROOT, 'courses', course, 'project');
  if (existsSync(join(projectDir, 'playwright.config.ts')) || existsSync(join(projectDir, 'playwright.config.js'))) {
    console.log(`   Installing browsers for ${course}...`);
    try {
      execSync('npx playwright install', { cwd: projectDir, stdio: 'inherit' });
      console.log(`   ✅ ${course} browsers installed`);
    } catch (error) {
      console.error(`   ❌ Failed to install browsers for ${course}`);
      console.error(`   You can install them manually later: cd courses/${course}/project && npx playwright install`);
    }
  }
}
console.log('');

console.log('✅ Setup complete!');
console.log('\n📋 Next Steps:');
console.log('1. Build dashboard: npm run dashboard:build');
console.log('2. Start dashboard: npm run dashboard');
console.log('3. Work on challenges in course projects');
console.log('\n🎓 Happy learning!');
