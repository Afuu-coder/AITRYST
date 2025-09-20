// Script to help set up Vercel environment variables
const fs = require('fs');

console.log('🔧 Setting up Vercel Environment Variables...\n');

// Read the service account key
const serviceAccountKey = JSON.parse(fs.readFileSync('service-account-key.json', 'utf8'));

console.log('📋 Environment Variables to set in Vercel:');
console.log('');
console.log('1. GOOGLE_CLOUD_PROJECT_ID');
console.log('   Value:', serviceAccountKey.project_id);
console.log('');
console.log('2. GOOGLE_CLOUD_REGION');
console.log('   Value: us-central1');
console.log('');
console.log('3. GOOGLE_SERVICE_ACCOUNT_KEY');
console.log('   Value:', JSON.stringify(serviceAccountKey));
console.log('');
console.log('🔗 To set these in Vercel:');
console.log('   1. Go to https://vercel.com/dashboard');
console.log('   2. Select your project: aitrystt');
console.log('   3. Go to Settings > Environment Variables');
console.log('   4. Add each variable above');
console.log('');
console.log('📝 Or use Vercel CLI:');
console.log('   vercel env add GOOGLE_CLOUD_PROJECT_ID');
console.log('   vercel env add GOOGLE_CLOUD_REGION');
console.log('   vercel env add GOOGLE_SERVICE_ACCOUNT_KEY');
console.log('');
console.log('⚠️  Make sure to set these for Production environment!');
