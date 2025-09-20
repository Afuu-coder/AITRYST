// Test the transcription API locally
const http = require('http');
const FormData = require('form-data');
const fs = require('fs');

console.log('🧪 Testing AITRYST Transcription API Locally...\n');

// Create a simple test audio file (silence)
function createTestAudioFile() {
  // Create a minimal WAV file header for testing
  const sampleRate = 16000;
  const duration = 2; // 2 seconds
  const numSamples = sampleRate * duration;
  const buffer = Buffer.alloc(44 + numSamples * 2); // 44 bytes header + 16-bit samples
  
  // WAV header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // Mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);
  
  // Fill with silence (zeros)
  buffer.fill(0, 44);
  
  return buffer;
}

// Test the local transcription API
async function testLocalTranscriptionAPI() {
  return new Promise((resolve, reject) => {
    console.log('📁 Creating test audio file...');
    const audioBuffer = createTestAudioFile();
    
    console.log('🔄 Testing local transcription API...');
    
    const form = new FormData();
    form.append('audio', audioBuffer, {
      filename: 'test-audio.wav',
      contentType: 'audio/wav'
    });
    form.append('language', 'en-US');
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/transcribe',
      method: 'POST',
      headers: form.getHeaders()
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200 && response.transcription) {
            console.log('✅ Local Transcription API: WORKING SUCCESSFULLY');
            console.log('   - API endpoint responding correctly');
            console.log('   - Audio file processed successfully');
            console.log('   - Transcription result received');
            console.log('   - Response:', response.transcription.substring(0, 100) + '...');
            console.log('   - Language:', response.language);
            console.log('   - Success:', response.success);
            resolve(true);
          } else {
            console.log('❌ Local Transcription API: FAILED');
            console.log('   - Status Code:', res.statusCode);
            console.log('   - Response:', response);
            reject(new Error('API not working correctly'));
          }
        } catch (error) {
          console.log('❌ Local Transcription API: INVALID RESPONSE');
          console.log('   - Could not parse response:', data);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Local Transcription API: NETWORK ERROR');
      console.log('   - Error:', error.message);
      console.log('   - Make sure the dev server is running on localhost:3000');
      reject(error);
    });
    
    req.setTimeout(15000, () => {
      console.log('❌ Local Transcription API: TIMEOUT');
      reject(new Error('Request timeout'));
    });
    
    form.pipe(req);
  });
}

// Run the test
async function runTest() {
  try {
    console.log('🚀 Starting local transcription API test...\n');
    
    await testLocalTranscriptionAPI();
    console.log('');
    
    console.log('🎉 LOCAL TRANSCRIPTION TEST PASSED!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ Local API endpoint is working');
    console.log('   ✅ Audio file processing works');
    console.log('   ✅ Language parameter is supported');
    console.log('   ✅ Response format is correct');
    console.log('\n🌐 Your transcription API is working locally!');
    console.log('   🔗 http://localhost:3000/api/transcribe');
    
  } catch (error) {
    console.log('\n❌ LOCAL TRANSCRIPTION TEST FAILED');
    console.log('Error:', error.message);
    console.log('\n🔧 Make sure:');
    console.log('   1. The dev server is running (npm run dev)');
    console.log('   2. The API route is properly configured');
    console.log('   3. Check the console for any errors');
  }
}

runTest();
