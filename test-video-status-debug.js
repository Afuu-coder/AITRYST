// Debug video status API
require('dotenv').config({ path: '.env.local' });

async function debugVideoStatus() {
  console.log('\n🔍 DEBUG: Video Status API\n');
  
  try {
    // First, start a video
    console.log('Step 1: Starting video generation...');
    const startResponse = await fetch('http://localhost:3000/api/generate-festival-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        festival: 'Diwali',
        productName: 'Test Product',
        productDescription: 'Test description',
        aspectRatio: '16:9',
        durationSeconds: '8'
      })
    });

    const startResult = await startResponse.json();
    console.log('✅ Video started');
    console.log(`   Operation: ${startResult.operationName}\n`);

    // Now check status and see the full error
    console.log('Step 2: Checking status (this is failing)...\n');
    
    const statusUrl = `http://localhost:3000/api/generate-festival-video?operation=${encodeURIComponent(startResult.operationName)}`;
    console.log(`URL: ${statusUrl}\n`);
    
    const statusResponse = await fetch(statusUrl);
    console.log(`Status code: ${statusResponse.status}`);
    console.log(`Status text: ${statusResponse.statusText}\n`);
    
    const statusText = await statusResponse.text();
    console.log('Response body:');
    console.log(statusText);
    
    try {
      const statusJson = JSON.parse(statusText);
      console.log('\nParsed JSON:');
      console.log(JSON.stringify(statusJson, null, 2));
    } catch (e) {
      console.log('\n(Not valid JSON)');
    }
    
  } catch (error) {
    console.log('\n❌ Error:', error.message);
  }
}

debugVideoStatus();
