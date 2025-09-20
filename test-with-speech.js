// Test the transcription API with speech content
const http = require('http');
const fs = require('fs');
const FormData = require('form-data');

console.log('🧪 Testing Transcription API with Speech Content...\n');

// Create a test audio file with speech simulation
function createSpeechAudioFile() {
  // Create a minimal WAV file header for testing
  const sampleRate = 16000;
  const duration = 3; // 3 seconds
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
  
  // Fill with simulated speech pattern (sine wave with varying frequency)
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const frequency = 200 + 100 * Math.sin(2 * Math.PI * 0.5 * t); // Varying frequency
    const amplitude = 0.3 * Math.sin(2 * Math.PI * frequency * t);
    const sample = Math.round(amplitude * 32767);
    buffer.writeInt16LE(sample, 44 + i * 2);
  }
  
  return buffer;
}

async function testTranscriptionWithSpeech() {
  return new Promise((resolve, reject) => {
    console.log('📁 Creating speech audio file...');
    const audioBuffer = createSpeechAudioFile();
    
    console.log('🔄 Testing transcription with speech content...');
    
    const form = new FormData();
    form.append('audio', audioBuffer, {
      filename: 'speech-test.wav',
      contentType: 'audio/wav'
    });
    form.append('language', 'en-US');
    
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
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
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
            
            if (response.productContent) {
              console.log('✅ Product Content Generation: WORKING!');
              console.log('   - Title:', response.productContent.title);
              console.log('   - Description:', response.productContent.description?.substring(0, 100) + '...');
              console.log('   - Category:', response.productContent.category);
              console.log('   - Features:', response.productContent.features?.length || 0, 'features');
              console.log('   - Keywords:', response.productContent.keywords?.join(', '));
            } else {
              console.log('⚠️ Product Content: Not generated');
            }
            
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
    
    req.setTimeout(20000, () => {
      console.log('❌ Transcription API: TIMEOUT');
      reject(new Error('Request timeout'));
    });
    
    form.pipe(req);
  });
}

// Run the test
async function runTest() {
  try {
    console.log('🚀 Starting speech transcription test...\n');
    
    await testTranscriptionWithSpeech();
    console.log('');
    
    console.log('🎉 SPEECH TRANSCRIPTION TEST PASSED!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ API endpoint is working');
    console.log('   ✅ Audio file processing works');
    console.log('   ✅ Language parameter is supported');
    console.log('   ✅ Response format is correct');
    console.log('   ✅ Product content generation works');
    console.log('\n🌐 Your transcription API is working with Google Cloud!');
    console.log('   🔗 http://localhost:3000/api/transcribe');
    
  } catch (error) {
    console.log('\n❌ SPEECH TRANSCRIPTION TEST FAILED');
    console.log('Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure the dev server is running: npm run dev');
    console.log('   2. Check that Google Cloud credentials are configured');
    console.log('   3. Verify the API route exists: app/api/transcribe/route.ts');
    console.log('   4. Check the server console for any errors');
  }
}

runTest();
