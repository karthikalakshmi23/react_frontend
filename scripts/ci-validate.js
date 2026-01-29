#!/usr/bin/env node

/**
 * CI/CD Validation Script
 * Validates system is ready for CI/CD pipeline
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

let errors = 0;

console.log('🔍 Running CI/CD Validation...\n');
console.log('='.repeat(60));

// GitHub Actions workflow
console.log('\n⚙️  Validating GitHub Actions workflow...');
const workflowPath = join(ROOT_DIR, '.github', 'workflows', 'solo-skill-review.yml');
if (!existsSync(workflowPath)) {
  console.log('   ❌ GitHub Actions workflow not found');
  errors++;
} else {
  const workflow = readFileSync(workflowPath, 'utf-8');
  if (!workflow.includes('run-all-reviews.js')) {
    console.log('   ❌ Global review script not referenced');
    errors++;
  } else {
    console.log('   ✅ GitHub Actions workflow valid');
  }
}

// Pathway config (source of course list)
const pathwayConfigPath = join(ROOT_DIR, 'pathway-review', 'pathway-config.json');
let courseIds = [];
if (!existsSync(pathwayConfigPath)) {
  console.log('   ❌ pathway-config.json missing');
  errors++;
} else {
  try {
    const config = JSON.parse(readFileSync(pathwayConfigPath, 'utf-8'));
    if (!config.courses || config.courses.length < 1) {
      console.log('   ❌ Pathway must have at least one course');
      errors++;
    } else {
      courseIds = config.courses.map(c => c.id);
      console.log(`   ✅ Pathway configuration valid (${courseIds.length} courses)`);
    }
  } catch (error) {
    console.log(`   ❌ Invalid JSON - ${error.message}`);
    errors++;
  }
}

// Course configs
console.log('\n📚 Validating course configurations...');
for (const courseId of courseIds) {
  const configPath = join(ROOT_DIR, 'courses', courseId, 'course-config.json');
  if (!existsSync(configPath)) {
    console.log(`   ❌ ${courseId}: course-config.json missing`);
    errors++;
    continue;
  }
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    if (!config.challenges || !Array.isArray(config.challenges) || config.challenges.length < 1) {
      console.log(`   ❌ ${courseId}: Expected at least one challenge`);
      errors++;
    } else {
      console.log(`   ✅ ${courseId}: Configuration valid (${config.challenges.length} challenges)`);
    }
  } catch (error) {
    console.log(`   ❌ ${courseId}: Invalid JSON - ${error.message}`);
    errors++;
  }
}

// Review engines
console.log('\n🔧 Validating review engines...');
for (const courseId of courseIds) {
  const reviewEnginePath = join(ROOT_DIR, 'courses', courseId, 'review-engine', 'index.js');
  if (!existsSync(reviewEnginePath)) {
    console.log(`   ❌ ${courseId}: review-engine/index.js missing`);
    errors++;
  } else {
    console.log(`   ✅ ${courseId}: Review engine exists`);
  }
}

// Global review
console.log('\n🌐 Validating global review system...');
if (!existsSync(join(ROOT_DIR, 'global-review', 'run-all-reviews.js'))) {
  console.log('   ❌ global-review/run-all-reviews.js missing');
  errors++;
} else {
  console.log('   ✅ Global review engine exists');
}

console.log('\n' + '='.repeat(60));
console.log('📊 CI/CD Validation Summary');
console.log('='.repeat(60));
if (errors === 0) {
  console.log('✅ All validations passed! System is ready for CI/CD.');
  process.exit(0);
} else {
  console.log(`❌ Found ${errors} validation error(s)`);
  process.exit(1);
}
