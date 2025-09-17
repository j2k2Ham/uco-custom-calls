const { execSync } = require('node:child_process');

const start = Date.now();
let exitCode = 0;
try {
  execSync('npm test --silent', { stdio: 'inherit' });
} catch (e) {
  exitCode = e.status || 1;
}
const elapsed = Date.now() - start;
console.log('TotalTestRuntimeMs=' + elapsed);
process.exit(exitCode);
