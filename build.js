const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

// Build configuration
esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/index.js',
  external: [],  // Bundle everything, no externals
  minify: true,
  sourcemap: true,
}).then(() => {
  console.log('✅ Build completed successfully!');
  console.log('📦 Bundled server: dist/index.js');
}).catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
