const { build } = require('esbuild');

const buildTargets = [
  {
    platform: 'node',
    target: 'node16',
    outfile: 'dist/node64/index.js'
  },
  {
    platform: 'browser',
    target: 'es2020',
    outfile: 'dist/web/index.js'
  }
];

buildTargets.forEach(config => { build({ entryPoints: ['src/index.js'], bundle: true, minify: true, ...config, external: config.platform === 'node' ? ['pg-native'] : [] }).catch(() => process.exit(1)); });