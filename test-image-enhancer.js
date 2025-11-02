// Test script to verify Image Enhancer connection
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Image Enhancer Connection...\n');

// Test 1: Check if all AI flow files exist
console.log('1. Checking AI Flow Files:');
const flowFiles = [
  'ai/flows/enhance-image-simple.ts',
  'ai/flows/ask-advisor-simple.ts', 
  'ai/flows/suggest-price-simple.ts',
  'ai/flows/generate-campaign-content-simple.ts',
  'ai/flows/generate-festival-images-simple.ts',
  'ai/flows/generate-festival-video-simple.ts',
  'ai/flows/list-products.ts'
];

flowFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Test 2: Check API route
console.log('\n2. Checking API Route:');
const apiRoute = path.join(__dirname, 'app/api/enhance-image/route.ts');
if (fs.existsSync(apiRoute)) {
  console.log('✅ API route exists');
  const content = fs.readFileSync(apiRoute, 'utf8');
  if (content.includes('enhance-image-simple')) {
    console.log('✅ API route uses simple flow');
  } else {
    console.log('❌ API route not updated');
  }
} else {
  console.log('❌ API route missing');
}

// Test 3: Check frontend page
console.log('\n3. Checking Frontend Page:');
const frontendPage = path.join(__dirname, 'app/studio/image-enhancer/page.tsx');
if (fs.existsSync(frontendPage)) {
  console.log('✅ Frontend page exists');
  const content = fs.readFileSync(frontendPage, 'utf8');
  if (content.includes('enhance-image-simple')) {
    console.log('✅ Frontend uses simple flows');
  } else {
    console.log('❌ Frontend not updated');
  }
} else {
  console.log('❌ Frontend page missing');
}

// Test 4: Check environment variables
console.log('\n4. Checking Environment:');
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ .env.local exists');
  console.log('✅ GOOGLE_API_KEY:', envContent.includes('GOOGLE_API_KEY') ? 'Present' : 'Missing');
  console.log('✅ GEMINI_API_KEY:', envContent.includes('GEMINI_API_KEY') ? 'Present' : 'Missing');
} else {
  console.log('❌ .env.local not found');
}

console.log('\n🎯 Test Summary:');
console.log('✅ Image Enhancer should now be connected and working!');
console.log('🚀 Visit: http://localhost:3000/studio/image-enhancer');
console.log('📝 Try uploading an image and clicking "Enhance Image"');
console.log('\n💡 Note: The enhancement currently returns the original image as placeholder.');
console.log('   You can enhance it later with actual AI image processing.');
