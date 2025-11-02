// Test Imagen and Veo APIs
require('dotenv').config({ path: '.env.local' });

async function testImageGeneration() {
  console.log('\n🧪 Testing Imagen 3 API...\n');
  
  try {
    // Small test image
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    const response = await fetch('http://localhost:3000/api/generate-festival-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        photoDataUri: testImage,
        productName: 'Test Product',
        artisanName: 'Test Artisan',
        festival: 'Diwali',
        language: 'en'
      })
    });

    const result = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (!result.success) {
      console.log('\n❌ Image Generation Failed');
      console.log('Error Details:', result.error || result.details);
    } else {
      console.log('\n✅ Image Generation Working');
    }
  } catch (error) {
    console.log('❌ Request Error:', error.message);
  }
}

async function testVideoGeneration() {
  console.log('\n🧪 Testing Veo 3.0 API...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/generate-festival-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        festival: 'Diwali',
        productName: 'Test Product',
        productDescription: 'A beautiful handcrafted product',
        aspectRatio: '16:9',
        durationSeconds: '8'
      })
    });

    const result = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (!result.success) {
      console.log('\n❌ Video Generation Failed');
      console.log('Error Details:', result.error || result.details);
    } else {
      console.log('\n✅ Video Generation Started');
    }
  } catch (error) {
    console.log('❌ Request Error:', error.message);
  }
}

async function checkServiceAccount() {
  console.log('\n📋 Checking Service Account Setup...\n');
  
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  
  console.log('Project ID:', projectId);
  console.log('Credentials Path:', credPath);
  
  const fs = require('fs');
  if (credPath && fs.existsSync(credPath)) {
    console.log('✅ Service account key file exists');
    try {
      const keyData = JSON.parse(fs.readFileSync(credPath, 'utf8'));
      console.log('Service Account Email:', keyData.client_email);
      console.log('Project ID in key:', keyData.project_id);
    } catch (e) {
      console.log('❌ Could not read key file:', e.message);
    }
  } else {
    console.log('❌ Service account key file NOT found at:', credPath);
  }
}

async function runTests() {
  await checkServiceAccount();
  await testImageGeneration();
  await testVideoGeneration();
}

runTests();
