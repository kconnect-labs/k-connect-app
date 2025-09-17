const { execSync } = require('child_process');

function checkSecurity() {
  try {
    console.log('Running security audit...');
    execSync('npx audit-ci --moderate', { stdio: 'inherit' });
    console.log('Security audit passed');
  } catch (error) {
    process.exit(1);
  }
}

checkSecurity();