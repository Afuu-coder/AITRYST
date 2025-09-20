// Test the deployed transcription API
const https = require('https');
const FormData = require('form-data');

console.log('🧪 Testing Deployed Transcription API...\n');

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

async function testDeployedAPI() {
  return new Promise((resolve, reject) => {
    console.log('📁 Creating speech audio file...');
    const audioBuffer = createSpeechAudioFile();
    
    console.log('🔄 Testing deployed transcription API...');
    
    const form = new FormData();
    form.append('audio', audioBuffer, {
      filename: 'speech-test.wav',
      contentType: 'audio/wav'
    });
    form.append('language', 'en-US');
    
    const options = {
      hostname: 'aitrystt.vercel.app',
      port: 443,
      path: '/api/transcribe/',
      method: 'POST',
      headers: form.getHeaders()
    };
    
    const req = https.request(options, (res) => {
      console.log('📡 Response received:');
      console.log('   - Status Code:', res.statusCode);
      console.log('   - Headers:', res.headers);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📄 Raw Response Length:', data.length);
        console.log('📄 Raw Response Preview:', data.substring(0, 500));
        
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200) {
            console.log('✅ API Response: SUCCESS');
            console.log('   - Success:', response.success);
            console.log('   - Language:', response.language);
            
            if (response.transcription) {
              console.log('✅ Transcription: WORKING');
              console.log('   - Transcription:', response.transcription);
            } else {
              console.log('❌ Transcription: MISSING');
            }
            
            if (response.productContent) {
              console.log('✅ Product Content: WORKING');
              console.log('   - Title:', response.productContent.title);
              console.log('   - Description:', response.productContent.description?.substring(0, 100) + '...');
              console.log('   - Category:', response.productContent.category);
              console.log('   - Features:', response.productContent.features?.length || 0, 'features');
            } else {
              console.log('❌ Product Content: MISSING');
            }
            
            resolve(true);
          } else {
            console.log('❌ API Response: FAILED');
            console.log('   - Status Code:', res.statusCode);
            console.log('   - Error:', response.error);
            console.log('   - Message:', response.message);
            reject(new Error(`API failed with status ${res.statusCode}`));
          }
        } catch (error) {
          console.log('❌ API Response: INVALID JSON');
          console.log('   - Parse error:', error.message);
          console.log('   - Raw data:', data);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ API Request: NETWORK ERROR');
      console.log('   - Error:', error.message);
      reject(error);
    });
    
    req.setTimeout(30000, () => {
      console.log('❌ API Request: TIMEOUT');
      reject(new Error('Request timeout'));
    });
    
    form.pipe(req);
  });
}

// Run the test
async function runTest() {
  try {
    console.log('🚀 Starting deployed API test...\n');
    
    await testDeployedAPI();
    console.log('');
    
    console.log('🎉 DEPLOYED API TEST COMPLETED!');
    
  } catch (error) {
    console.log('\n❌ DEPLOYED API TEST FAILED');
    console.log('Error:', error.message);
    console.log('\n🔧 Possible Issues:');
    console.log('   1. Google Cloud credentials not configured on Vercel');
    console.log('   2. Environment variables missing');
    console.log('   3. API route not deployed correctly');
    console.log('   4. Google Cloud services not enabled');
  }
}

runTest();
