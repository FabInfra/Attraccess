const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');
const glob = require('glob');

// Get all migration files
const migrationFiles = glob.sync('apps/api/src/database/migrations/**/*.ts');
const migrationEntries = migrationFiles.reduce((acc, file) => {
  const key = './' + file.replace('apps/api/src/database/', '');
  acc[key] = file;
  return acc;
}, {});

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/typeorm-migration'),
    library: {
      type: 'commonjs2'
    }
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/database/datasource.ts',
      tsConfig: './tsconfig.app.json',
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
    })
  ],
  externals: {
    typeorm: 'commonjs typeorm',
    tslib: 'commonjs tslib',
    zod: 'commonjs zod'
  },
  entry: {
    main: './apps/api/src/database/datasource.ts',
    ...migrationEntries
  }
};
