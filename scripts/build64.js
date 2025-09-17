const { build } = require('esbuild');

build({ entryPoints: ['src/index.js'], bundle: true, minify: true, platform: 'node', target: 'node16', outfile: 'dist/index.js', external: ['pg-native'] }).catch(()=> process.exit(1));