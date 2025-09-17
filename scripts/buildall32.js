// build_all32.js
const { build } = require('esbuild');

const buildTargets = [
  {
    platform: 'node',
    target: 'node14',
    outfile: 'dist/node32/index.js'
  },
  {
    platform: 'browser',
    target: 'es2015',
    outfile: 'dist/web32/index.js'
  }
];

buildTargets.forEach(config => {
  build({
    entryPoints: ['src/index.js'],
    bundle: true,
    minify: true,
    ...config,
    external: config.platform === 'node' ? ['pg-native'] : []
  }).catch(() => process.exit(1));
});