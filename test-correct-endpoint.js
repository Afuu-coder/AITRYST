// Test the corrected endpoint format
require('dotenv').config({ path: '.env.local' });
const { GoogleAuth } = require('google-auth-library');
const path = require('path');

async function testCorrectEndpoint() {
  console.log('\n🔍 Testing CORRECTED Endpoint Format\n');
  
  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = process.env.GOOGLE_CLOUD_REGION || 'us-central1';
    const keyfilePath = path.join(process.cwd(), 'service-account-key.json');

    // Auth
    const auth = new GoogleAuth({
      keyFilename: keyfilePath,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    
    if (!accessToken.token) {
      throw new Error('Failed to get access token');
    }

    // Start video
    console.log('Starting video generation...');
    const startEndpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/veo-3.0-generate-001:predictLongRunning`;
    
    const videoPrompt = 'A 8-second video of a handwoven silk sari with Diwali decorations.';
    
    const requestBody = {
      instances: [{ prompt: videoPrompt }],
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

    const startResponse = await fetch(startEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!startResponse.ok) {
      throw new Error(`Start failed: ${startResponse.statusText}`);
    }

    const result = await startResponse.json();
    console.log('✅ Video started!\n');

    const operationName = result.name;
    console.log('Full operation name:');
    console.log(operationName);
    console.log('');

    // Extract operation ID
    const operationIdMatch = operationName.match(/operations\/([^\/]+)$/);
    if (!operationIdMatch) {
      throw new Error('Could not extract operation ID');
    }
    
    const operationId = operationIdMatch[1];
    console.log(`Operation ID: ${operationId}\n`);

    // CORRECTED endpoint format
    const statusEndpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/operations/${operationId}`;
    
    console.log('Status endpoint (CORRECTED):');
    console.log(statusEndpoint);
    console.log('');

    console.log('Waiting 10 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log('Checking status...');
    const statusResponse = await fetch(statusEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken.token}`
      }
    });

    console.log(`Status: ${statusResponse.status} ${statusResponse.statusText}\n`);

    if (statusResponse.ok) {
      const statusResult = await statusResponse.json();
      console.log('✅ SUCCESS! Status check works!\n');
      console.log('Response:');
      console.log(JSON.stringify(statusResult, null, 2));
      console.log('');
      console.log(`Done: ${statusResult.done || false}`);
      
      if (statusResult.done) {
        console.log('\n🎉 Video is already complete!');
        if (statusResult.response) {
          console.log('Has response data: YES');
        }
        if (statusResult.error) {
          console.log('Has error: YES');
          console.log(JSON.stringify(statusResult.error, null, 2));
        }
      } else {
        console.log('\n⏳ Video still generating (expected - only 10 seconds elapsed)');
      }
    } else {
      const errorText = await statusResponse.text();
      console.log('❌ Status check failed:');
      console.log(errorText.substring(0, 500));
    }

  } catch (error) {
    console.log('\n❌ Error:', error.message);
  }
}

testCorrectEndpoint();
