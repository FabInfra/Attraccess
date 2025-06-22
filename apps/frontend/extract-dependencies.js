#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Script to extract dependencies from package.json and create dependencies.json
// This script reads the root package.json and creates a detailed list of all dependencies

async function extractDependencies() {
  try {
    // Get the workspace root
    const workspaceRoot = process.cwd();
    const packageJsonPath = path.join(workspaceRoot, 'package.json');
    const outputFile = path.join(workspaceRoot, 'apps/frontend/public/dependencies.json');

    // Check if package.json exists
    if (!fs.existsSync(packageJsonPath)) {
      console.error(`Error: package.json not found at ${packageJsonPath}`);
      process.exit(1);
    }

    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`Extracting dependencies from ${packageJsonPath}...`);

    // Read package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Get all dependencies (both regular and dev)
    const allDeps = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    };

    const dependencies = [];

    console.log('Processing', Object.keys(allDeps).length, 'dependencies...');

    // Process each dependency
    for (const [name, version] of Object.entries(allDeps)) {
      try {
        console.log('Processing:', name);

        // Get package info from npm
        const npmInfoJson = execSync(`npm view ${name} --json`, {
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'ignore'],
        });

        const npmInfo = JSON.parse(npmInfoJson);

        // Extract required information
        const depInfo = {
          name: name,
          version: version,
          author: npmInfo.author
            ? typeof npmInfo.author === 'string'
              ? npmInfo.author
              : npmInfo.author.name || 'Unknown'
            : 'Unknown',
          license: npmInfo.license || 'Unknown',
          url:
            npmInfo.homepage ||
            npmInfo.repository?.url ||
            npmInfo.repository ||
            `https://www.npmjs.com/package/${name}`,
        };

        // Clean up git URLs
        if (depInfo.url && depInfo.url.startsWith('git+')) {
          depInfo.url = depInfo.url.replace('git+', '').replace('.git', '');
        }

        dependencies.push(depInfo);
      } catch (error) {
        console.error(`Warning: Could not get info for ${name}:`, error.message);

        // Fallback info
        dependencies.push({
          name: name,
          version: version,
          author: 'Unknown',
          license: 'Unknown',
          url: `https://www.npmjs.com/package/${name}`,
        });
      }
    }

    // Sort dependencies by name
    dependencies.sort((a, b) => a.name.localeCompare(b.name));

    // Write to output file
    fs.writeFileSync(outputFile, JSON.stringify(dependencies, null, 2));

    console.log(`Dependencies list written to ${outputFile}`);
    console.log(`Total dependencies: ${dependencies.length}`);
    console.log('✅ Dependencies extraction complete!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the script
extractDependencies();
