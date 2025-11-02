// Browser-based test for the transcribe API
async function testTranscribeAPI() {
  try {
    // Fetch the test audio file
    const response = await fetch('/test-audio.wav');
    const audioBuffer = await response.arrayBuffer();
    const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
    
    // Create FormData
    const formData = new FormData();
    formData.append('audio', audioBlob, 'test-audio.wav');
    formData.append('language', 'en-US');
    
    console.log('Testing transcribe API...');
    
    // Call the API
    const apiResponse = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    });
    
    console.log('Response status:', apiResponse.status);
    
    if (apiResponse.ok) {
      const result = await apiResponse.json();
      console.log('Transcription result:', result);
    } else {
      const errorText = await apiResponse.text();
      console.error('API Error:', errorText);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testTranscribeAPI();