#!/usr/bin/env node

/**
 * Structure Validation Script
 * 
 * Validates that the repository structure matches requirements
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');
const PATHWAY_CONFIG = join(ROOT_DIR, 'pathway-review', 'pathway-config.json');

let courseIds = [];
if (existsSync(PATHWAY_CONFIG)) {
  try {
    const pathway = JSON.parse(readFileSync(PATHWAY_CONFIG, 'utf-8'));
    courseIds = (pathway.courses || []).map(c => c.id);
  } catch (e) { /* ignore */ }
}

let errors = 0;

console.log('🔍 Validating repository structure...\n');

// Validate each course (from pathway config)
for (const courseId of courseIds) {
  const courseDir = join(ROOT_DIR, 'courses', courseId);
  
  console.log(`Checking ${courseId}...`);
  
  // Required files
  const requiredFiles = [
    'course-config.json',
    'project/package.json',
    'review-engine/index.js',
    'review-engine/package.json',
    'ai-review/index.js',
    'results/.gitkeep'
  ];
  
  for (const file of requiredFiles) {
    const filePath = join(courseDir, file);
    if (!existsSync(filePath)) {
      console.error(`  ❌ Missing: ${file}`);
      errors++;
    }
  }
  
  // Validate course config
  try {
    const configPath = join(courseDir, 'course-config.json');
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    if (!config.challenges || config.challenges.length < 1) {
      console.error(`  ❌ ${courseId}: Expected at least one challenge, found ${config.challenges?.length || 0}`);
      errors++;
    }
  } catch (error) {
    console.error(`  ❌ ${courseId}: Invalid course-config.json - ${error.message}`);
    errors++;
  }
}

// Validate global structure
console.log('\nChecking global structure...');
const globalFiles = [
  'global-review/run-all-reviews.js',
  'global-review/scoring-engine/index.js',
  'global-review/ai-review/index.js',
  'pathway-review/pathway-config.json',
  '.github/workflows/solo-skill-review.yml'
];

for (const file of globalFiles) {
  const filePath = join(ROOT_DIR, file);
  if (!existsSync(filePath)) {
    console.error(`  ❌ Missing: ${file}`);
    errors++;
  }
}

if (errors === 0) {
  console.log('\n✅ All structure validations passed!');
  process.exit(0);
} else {
  console.log(`\n❌ Found ${errors} validation error(s)`);
  process.exit(1);
}
