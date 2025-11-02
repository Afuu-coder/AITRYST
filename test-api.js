const fs = require('fs');
const { Blob, File } = require('buffer');

// Test the transcribe API
async function testTranscribeAPI() {
  try {
    // Read the test audio file
    const audioBuffer = fs.readFileSync('./test-audio.wav');
    
    // Create a File object that Next.js can properly parse
    const file = new File([audioBuffer], 'test-audio.wav', { type: 'audio/wav' });
    
    // Create FormData using Node's built-in FormData and File
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('language', 'en-US');
    
    console.log('Testing transcribe API...');
    
    // Call the API
    const response = await fetch('http://localhost:3000/api/transcribe', {
      method: 'POST',
      body: formData,
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('Transcription result:', result);
    } else {
      const errorText = await response.text();
      console.error('API Error:', errorText);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testTranscribeAPI();