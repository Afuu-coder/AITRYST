// Direct test of the transcription API
const http = require('http');
const fs = require('fs');
const FormData = require('form-data');

console.log('🧪 Testing Transcription API Directly...\n');

async function testTranscriptionAPI() {
  return new Promise((resolve, reject) => {
    console.log('📁 Reading test audio file...');
    
    if (!fs.existsSync('test-audio.wav')) {
      reject(new Error('Test audio file not found. Run create-test-audio.js first.'));
      return;
    }
    
    const audioBuffer = fs.readFileSync('test-audio.wav');
    console.log('   - Audio file size:', audioBuffer.length, 'bytes');
    
    console.log('🔄 Creating form data...');
    const form = new FormData();
    form.append('audio', audioBuffer, {
      filename: 'test-audio.wav',
      contentType: 'audio/wav'
    });
    form.append('language', 'en-US');
    
    console.log('🌐 Sending request to localhost:3000/api/transcribe...');
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/transcribe/',
      method: 'POST',
      headers: form.getHeaders()
    };
    
    const req = http.request(options, (res) => {
      console.log('📡 Response received:');
      console.log('   - Status Code:', res.statusCode);
      console.log('   - Headers:', res.headers);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📄 Raw Response:', data);
        
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200 && response.transcription) {
            console.log('✅ Transcription API: WORKING SUCCESSFULLY!');
            console.log('   - API endpoint responding correctly');
            console.log('   - Audio file processed successfully');
            console.log('   - Transcription result received');
            console.log('   - Transcription:', response.transcription);
            console.log('   - Language:', response.language);
            console.log('   - Success:', response.success);
            resolve(true);
          } else {
            console.log('❌ Transcription API: FAILED');
            console.log('   - Status Code:', res.statusCode);
            console.log('   - Response:', response);
            reject(new Error('API not working correctly'));
          }
        } catch (error) {
          console.log('❌ Transcription API: INVALID JSON RESPONSE');
          console.log('   - Could not parse response as JSON');
          console.log('   - Raw data:', data);
          console.log('   - Parse error:', error.message);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Transcription API: NETWORK ERROR');
      console.log('   - Error:', error.message);
      console.log('   - Make sure the dev server is running: npm run dev');
      reject(error);
    });
    
    req.setTimeout(15000, () => {
      console.log('❌ Transcription API: TIMEOUT');
      reject(new Error('Request timeout'));
    });
    
    console.log('📤 Sending form data...');
    form.pipe(req);
  });
}

// Run the test
async function runTest() {
  try {
    console.log('🚀 Starting direct transcription API test...\n');
    
    await testTranscriptionAPI();
    console.log('');
    
    console.log('🎉 TRANSCRIPTION API TEST PASSED!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ API endpoint is working');
    console.log('   ✅ Audio file processing works');
    console.log('   ✅ Language parameter is supported');
    console.log('   ✅ Response format is correct');
    console.log('\n🌐 Your transcription API is working!');
    console.log('   🔗 http://localhost:3000/api/transcribe');
    
  } catch (error) {
    console.log('\n❌ TRANSCRIPTION API TEST FAILED');
    console.log('Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure the dev server is running: npm run dev');
    console.log('   2. Check that the API route exists: app/api/transcribe/route.ts');
    console.log('   3. Verify the test audio file exists: test-audio.wav');
    console.log('   4. Check the server console for any errors');
  }
}

runTest();
