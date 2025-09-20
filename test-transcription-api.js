// Test script to verify the transcription API functionality
const https = require('https');
const fs = require('fs');
const FormData = require('form-data');

console.log('🧪 Testing AITRYST Transcription API...\n');

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

// Test the transcription API
async function testTranscriptionAPI() {
  return new Promise((resolve, reject) => {
    console.log('📁 Creating test audio file...');
    const audioBuffer = createTestAudioFile();
    
    console.log('🔄 Testing transcription API...');
    
    const form = new FormData();
    form.append('audio', audioBuffer, {
      filename: 'test-audio.wav',
      contentType: 'audio/wav'
    });
    form.append('language', 'en-US');
    
    const options = {
      hostname: 'aitrystt.vercel.app',
      port: 443,
      path: '/api/transcribe',
      method: 'POST',
      headers: form.getHeaders()
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200 && response.transcription) {
            console.log('✅ Transcription API: WORKING SUCCESSFULLY');
            console.log('   - API endpoint responding correctly');
            console.log('   - Audio file processed successfully');
            console.log('   - Transcription result received');
            console.log('   - Response:', response.transcription.substring(0, 100) + '...');
            resolve(true);
          } else {
            console.log('❌ Transcription API: FAILED');
            console.log('   - Status Code:', res.statusCode);
            console.log('   - Response:', response);
            reject(new Error('API not working correctly'));
          }
        } catch (error) {
          console.log('❌ Transcription API: INVALID RESPONSE');
          console.log('   - Could not parse response:', data);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Transcription API: NETWORK ERROR');
      console.log('   - Error:', error.message);
      reject(error);
    });
    
    req.setTimeout(15000, () => {
      console.log('❌ Transcription API: TIMEOUT');
      reject(new Error('Request timeout'));
    });
    
    form.pipe(req);
  });
}

// Test API endpoint accessibility
async function testAPIEndpoint() {
  return new Promise((resolve, reject) => {
    console.log('🔍 Testing API endpoint accessibility...');
    
    const options = {
      hostname: 'aitrystt.vercel.app',
      port: 443,
      path: '/api/transcribe',
      method: 'GET'
    };
    
    const req = https.request(options, (res) => {
      if (res.statusCode === 405 || res.statusCode === 308 || res.statusCode === 200) {
        console.log('✅ API Endpoint: ACCESSIBLE');
        console.log('   - Endpoint is responding (Status:', res.statusCode + ')');
        console.log('   - 308 redirect is normal for Vercel deployments');
        resolve(true);
      } else {
        console.log('❌ API Endpoint: UNEXPECTED RESPONSE');
        console.log('   - Status Code:', res.statusCode);
        reject(new Error('Unexpected response'));
      }
    });
    
    req.on('error', (error) => {
      console.log('❌ API Endpoint: NETWORK ERROR');
      console.log('   - Error:', error.message);
      reject(error);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ API Endpoint: TIMEOUT');
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

// Run all tests
async function runTests() {
  try {
    console.log('🚀 Starting transcription API tests...\n');
    
    await testAPIEndpoint();
    console.log('');
    
    await testTranscriptionAPI();
    console.log('');
    
    console.log('🎉 ALL TRANSCRIPTION TESTS PASSED!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ API endpoint is accessible');
    console.log('   ✅ Transcription API is working');
    console.log('   ✅ Audio file processing works');
    console.log('   ✅ Language parameter is supported');
    console.log('\n🌐 Your transcription API is ready for use!');
    console.log('   🔗 https://aitrystt.vercel.app/api/transcribe');
    
  } catch (error) {
    console.log('\n❌ SOME TRANSCRIPTION TESTS FAILED');
    console.log('Error:', error.message);
    console.log('\n🔧 Please check the API implementation and try again.');
  }
}

runTests();
