const { execSync } = require('child_process');

try {
  const output = execSync('curl -s -w "%{http_code}" http://192.168.3.237:3005/cards', { encoding: 'utf-8' });
  console.log("Output:", output.substring(output.length - 10)); // Just the status code and end of html
} catch (e) {
  console.error("Error:", e.message);
}
