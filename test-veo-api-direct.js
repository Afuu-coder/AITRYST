// Test Veo 3.0 API directly with Google Auth
require('dotenv').config({ path: '.env.local' });
const { GoogleAuth } = require('google-auth-library');
const path = require('path');

async function testVeoDirectly() {
  console.log('\n🔍 Testing Veo 3.0 API Directly\n');
  
  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = process.env.GOOGLE_CLOUD_REGION || 'us-central1';
    const keyfilePath = path.join(process.cwd(), 'service-account-key.json');

    console.log('Configuration:');
    console.log(`  Project: ${projectId}`);
    console.log(`  Location: ${location}`);
    console.log(`  Key file: ${keyfilePath}`);
    console.log('');

    // Step 1: Get auth token
    console.log('Step 1: Authenticating...');
    const auth = new GoogleAuth({
      keyFilename: keyfilePath,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    
    if (!accessToken.token) {
      throw new Error('Failed to get access token');
    }
    console.log('✅ Authentication successful\n');

    // Step 2: Start video generation
    console.log('Step 2: Starting video generation...');
    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/veo-3.0-generate-001:predictLongRunning`;
    
    console.log(`Endpoint: ${endpoint}\n`);
    
    const videoPrompt = 'A cinematic 8-second video showcasing a handwoven silk sari with golden borders. The camera slowly pans around the product displayed on an elegant table decorated with glowing diyas and marigold flowers. Warm golden Diwali lighting. Professional product photography, 4K quality.';
    
    const requestBody = {
      instances: [{
        prompt: videoPrompt
      }],
      parameters: {
        aspectRatio: '16:9',
        sampleCount: 1,
        durationSeconds: '8',
        personGeneration: 'allow_all',
        addWatermark: false,
        generateAudio: false,
        resolution: '720p'
      }
    };

    const startResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log(`Response status: ${startResponse.status}`);

    if (!startResponse.ok) {
      const errorText = await startResponse.text();
      console.log('❌ Error response:');
      console.log(errorText);
      throw new Error(`Veo API error: ${startResponse.statusText}`);
    }

    const result = await startResponse.json();
    console.log('✅ Video generation started!\n');
    console.log('Response:');
    console.log(JSON.stringify(result, null, 2));
    console.log('');

    const operationName = result.name;
    if (!operationName) {
      throw new Error('No operation name in response');
    }

    console.log(`Operation name: ${operationName}\n`);

    // Step 3: Check status
    console.log('Step 3: Checking operation status...');
    console.log('Waiting 10 seconds before first check...\n');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Try different endpoint formats
    const endpoints = [
      `https://${location}-aiplatform.googleapis.com/v1/${operationName}`,
      `https://aiplatform.googleapis.com/v1/${operationName}`,
      `https://${location}-aiplatform.googleapis.com/v1beta1/${operationName}`
    ];

    for (let i = 0; i < endpoints.length; i++) {
      console.log(`\nTrying endpoint ${i + 1}:`);
      console.log(endpoints[i]);

      const statusResponse = await fetch(endpoints[i], {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken.token}`
        }
      });

      console.log(`Status: ${statusResponse.status} ${statusResponse.statusText}`);

      if (statusResponse.ok) {
        const statusResult = await statusResponse.json();
        console.log('✅ SUCCESS! This endpoint works!\n');
        console.log('Status result:');
        console.log(JSON.stringify(statusResult, null, 2));
        
        console.log('\n📝 Use this endpoint format in your code:');
        console.log(endpoints[i]);
        return;
      } else {
        const errorText = await statusResponse.text();
        console.log('Error:', errorText.substring(0, 200));
      }
    }

    console.log('\n⚠️  None of the endpoints worked. The operation might need more time.');

  } catch (error) {
    console.log('\n❌ Error:', error.message);
    console.log(error.stack);
  }
}

testVeoDirectly();
