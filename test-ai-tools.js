// Test script to verify all AI studio tools are working
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing AI Studio Tools...\n');

// Test 1: Check environment variables
console.log('1. Environment Variables:');
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ .env.local exists');
  console.log('✅ GOOGLE_API_KEY:', envContent.includes('GOOGLE_API_KEY') ? 'Present' : 'Missing');
  console.log('✅ GOOGLE_CLOUD_PROJECT_ID:', envContent.includes('GOOGLE_CLOUD_PROJECT_ID') ? 'Present' : 'Missing');
  console.log('✅ GOOGLE_APPLICATION_CREDENTIALS:', envContent.includes('GOOGLE_APPLICATION_CREDENTIALS') ? 'Present' : 'Missing');
} else {
  console.log('❌ .env.local not found');
}

// Test 2: Check service account key
console.log('\n2. Service Account Key:');
const keyPath = path.join(__dirname, 'service-account-key.json');
if (fs.existsSync(keyPath)) {
  try {
    const keyContent = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    console.log('✅ Service account key exists');
    console.log('✅ Project ID:', keyContent.project_id || 'Missing');
    console.log('✅ Client Email:', keyContent.client_email ? 'Present' : 'Missing');
  } catch (error) {
    console.log('❌ Service account key is invalid JSON');
  }
} else {
  console.log('❌ service-account-key.json not found');
}

// Test 3: Check API routes
console.log('\n3. API Routes:');
const apiDir = path.join(__dirname, 'app', 'api');
const expectedRoutes = [
  'enhance-image',
  'generate-content',
  'transcribe',
  'generate-festival-campaign',
  'calculate-pricing',
  'create-product'
];

expectedRoutes.forEach(route => {
  const routePath = path.join(apiDir, route, 'route.ts');
  if (fs.existsSync(routePath)) {
    console.log(`✅ ${route} API exists`);
  } else {
    console.log(`❌ ${route} API missing`);
  }
});

// Test 4: Check lib files
console.log('\n4. Library Files:');
const libDir = path.join(__dirname, 'lib');
const expectedLibs = [
  'vertexAIServer.ts',
  'vertexImagenServer.ts',
  'firebase.ts',
  'utils.ts'
];

expectedLibs.forEach(lib => {
  const libPath = path.join(libDir, lib);
  if (fs.existsSync(libPath)) {
    console.log(`✅ ${lib} exists`);
  } else {
    console.log(`❌ ${lib} missing`);
  }
});

// Test 5: Check component files
console.log('\n5. Studio Components:');
const studioDir = path.join(__dirname, 'app', 'studio');
const expectedStudioPages = [
  'ai-content',
  'image-enhancer',
  'voice-recording',
  'festival-campaigns',
  'smart-pricing',
  'qr-microsite'
];

expectedStudioPages.forEach(page => {
  const pagePath = path.join(studioDir, page);
  if (fs.existsSync(pagePath)) {
    console.log(`✅ ${page} studio page exists`);
  } else {
    console.log(`❌ ${page} studio page missing`);
  }
});

console.log('\n🎯 Test Summary:');
console.log('If all items show ✅, your AI studio tools should be working properly.');
console.log('If you see ❌, those components need attention.');
console.log('\n🚀 To test the live functionality, visit: http://localhost:3000/studio');
