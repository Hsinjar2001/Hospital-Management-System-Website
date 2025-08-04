#!/usr/bin/env node

/**
 * Test Runner Script for Hospital Management System Backend
 * 
 * This script provides an easy way to run different types of tests
 * Usage: node run-tests.js [option]
 * 
 * Options:
 *   all       - Run all tests
 *   auth      - Run authentication tests only
 *   coverage  - Run tests with coverage report
 *   watch     - Run tests in watch mode
 */

const { spawn } = require('child_process');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    log(`\n🚀 Running: ${command} ${args.join(' ')}`, 'cyan');
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: __dirname
    });

    child.on('close', (code) => {
      if (code === 0) {
        log(`\n✅ Command completed successfully!`, 'green');
        resolve(code);
      } else {
        log(`\n❌ Command failed with exit code ${code}`, 'red');
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      log(`\n❌ Error running command: ${error.message}`, 'red');
      reject(error);
    });
  });
}

async function runTests(option = 'all') {
  try {
    log('🏥 Hospital Management System - Test Runner', 'bright');
    log('=' .repeat(50), 'blue');

    switch (option.toLowerCase()) {
      case 'all':
        log('\n📋 Running all tests...', 'yellow');
        await runCommand('npm', ['test']);
        break;

      case 'auth':
        log('\n🔐 Running authentication tests...', 'yellow');
        await runCommand('npm', ['run', 'test:auth']);
        break;

      case 'doctor':
        log('\n👨‍⚕️ Running doctor controller tests...', 'yellow');
        await runCommand('npm', ['run', 'test:doctor']);
        break;

      case 'patient':
        log('\n🏥 Running patient controller tests...', 'yellow');
        await runCommand('npm', ['run', 'test:patient']);
        break;

      case 'controllers':
        log('\n🎛️ Running all controller tests...', 'yellow');
        await runCommand('npm', ['run', 'test:controllers']);
        break;

      case 'coverage':
        log('\n📊 Running tests with coverage report...', 'yellow');
        await runCommand('npm', ['run', 'test:coverage']);
        break;

      case 'watch':
        log('\n👀 Running tests in watch mode...', 'yellow');
        log('Press Ctrl+C to stop watching', 'magenta');
        await runCommand('npm', ['run', 'test:watch']);
        break;

      default:
        log('\n❓ Unknown option. Available options:', 'yellow');
        log('  all         - Run all tests', 'cyan');
        log('  auth        - Run authentication tests only', 'cyan');
        log('  doctor      - Run doctor controller tests only', 'cyan');
        log('  patient     - Run patient controller tests only', 'cyan');
        log('  controllers - Run all controller tests', 'cyan');
        log('  coverage    - Run tests with coverage report', 'cyan');
        log('  watch       - Run tests in watch mode', 'cyan');
        log('\nExample: node run-tests.js doctor', 'magenta');
        process.exit(1);
    }

    log('\n🎉 Test execution completed!', 'green');
    
  } catch (error) {
    log(`\n💥 Test execution failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Get command line argument
const option = process.argv[2] || 'all';

// Run the tests
runTests(option);
