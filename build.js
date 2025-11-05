const esbuild = require('esbuild');
const { copy } = require('esbuild-plugin-copy');
const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

// Build configuration
esbuild.build({
  entryPoints: ['src/server.ts'],
  bundle: true,
  platform: 'node',
  target: 'node16',
  outfile: 'dist/server.js',
  external: [],  // Bundle everything, no externals
  minify: true,
  sourcemap: true,
  plugins: [
    copy({
      resolveFrom: 'cwd',
      assets: {
        from: ['./public/**/*'],
        to: ['./dist/public'],
      },
      watch: false,
    }),
  ],
}).then(() => {
  console.log('✅ Build completed successfully!');
  console.log('📦 Bundled server: dist/server.js');
  console.log('📁 Frontend files: dist/public/');
  console.log('🚀 Ready to deploy - no dependencies needed!');
}).catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
