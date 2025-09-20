// Script to add environment variable to Vercel
const { execSync } = require('child_process');
const fs = require('fs');

// Read the service account key
const serviceAccountKey = JSON.parse(fs.readFileSync('service-account-key.json', 'utf8'));
const keyString = JSON.stringify(serviceAccountKey);

console.log('Adding GOOGLE_SERVICE_ACCOUNT_KEY to Vercel...');

try {
  // Use echo to pipe the JSON content to vercel env add
  const command = `echo "${keyString}" | vercel env add GOOGLE_SERVICE_ACCOUNT_KEY`;
  execSync(command, { stdio: 'inherit' });
  console.log('✅ Environment variable added successfully!');
} catch (error) {
  console.error('❌ Failed to add environment variable:', error.message);
  console.log('\n📝 Manual steps:');
  console.log('1. Go to https://vercel.com/dashboard');
  console.log('2. Select your project: aitrystt');
  console.log('3. Go to Settings > Environment Variables');
  console.log('4. Add GOOGLE_SERVICE_ACCOUNT_KEY with this value:');
  console.log(keyString);
}
