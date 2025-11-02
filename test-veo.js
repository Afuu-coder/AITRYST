const { GoogleAuth } = require('google-auth-library');
const path = require('path');

async function testVeoAPI() {
  console.log('🧪 Testing Veo 3.1 Fast Generate Preview API...\n');
  
  try {
    // Configuration
    const projectId = 'craftai-476916';
    const location = 'us-central1';
    const serviceAccountPath = 'E:\\Downloads\\aitrystt\\service-account-key.json';
    
    console.log('📋 Configuration:');
    console.log('  Project ID:', projectId);
    console.log('  Location:', location);
    console.log('  Service Account:', serviceAccountPath);
    console.log('  Working Directory:', process.cwd());
    console.log('');
    
    // Check if service account file exists
    const fs = require('fs');
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(`Service account file not found at: ${serviceAccountPath}`);
    }
    console.log('✅ Service account file found\n');
    
    // Initialize Google Auth
    console.log('🔐 Authenticating with Google Cloud...');
    const auth = new GoogleAuth({
      keyFilename: serviceAccountPath,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    
    if (!accessToken.token) {
      throw new Error('Failed to get access token');
    }
    console.log('✅ Authentication successful\n');
    
    // Prepare test request
    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/veo-3.1-fast-generate-preview:predict`;
    
    const testPrompt = `A 8-second cinematic product showcase for a handcrafted silk scarf. 
The camera slowly pans around the scarf displayed on an elegant wooden table with soft lighting. 
Professional product photography style, high quality, 4K.`;
    
    const requestBody = {
      instances: [{
        prompt: testPrompt
      }],
      parameters: {
        aspectRatio: '16:9',
        sampleCount: 1,
        durationSeconds: 8,
        personGeneration: 'allow_all'
      }
    };
    
    console.log('📤 Sending request to Veo 3.1 Fast API...');
    console.log('  Endpoint:', endpoint);
    console.log('  Prompt:', testPrompt.substring(0, 100) + '...');
    console.log('');
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('📥 Response received:');
    console.log('  Status:', response.status, response.statusText);
    console.log('');
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error Response:', errorText);
      
      // Parse error for better understanding
      try {
        const errorData = JSON.parse(errorText);
        if (response.status === 403) {
          console.log('\n💡 Solution: Enable Vertex AI API');
          console.log('   Run: gcloud services enable aiplatform.googleapis.com --project=craftai-476916');
        } else if (response.status === 429) {
          console.log('\n💡 Solution: Quota exceeded');
          console.log('   Wait 60 seconds or check quota at:');
          console.log('   https://console.cloud.google.com/apis/api/aiplatform.googleapis.com/quotas?project=craftai-476916');
        } else if (response.status === 404) {
          console.log('\n💡 Solution: Model not available in this region');
          console.log('   Try region: us-central1');
        }
      } catch (e) {
        // Error text is not JSON
      }
      
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    console.log('✅ SUCCESS! Veo 3.1 Fast API is working!\n');
    console.log('📊 Response Details:');
    console.log('  Has predictions:', !!result.predictions);
    console.log('  Prediction count:', result.predictions?.length || 0);
    
    if (result.predictions && result.predictions[0]) {
      const video = result.predictions[0];
      console.log('  Video format:', video.mimeType || 'video/mp4');
      console.log('  Has video data:', !!video.bytesBase64Encoded);
      console.log('  Video size:', video.bytesBase64Encoded ? `${(video.bytesBase64Encoded.length / 1024 / 1024).toFixed(2)} MB` : 'N/A');
    }
    
    console.log('\n🎉 All tests passed! Veo 3.1 Fast is ready to use!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run the test
testVeoAPI();
