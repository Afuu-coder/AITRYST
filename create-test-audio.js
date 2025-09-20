// Create a test audio file
const fs = require('fs');

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

const audioBuffer = createTestAudioFile();
fs.writeFileSync('test-audio.wav', audioBuffer);
console.log('✅ Test audio file created: test-audio.wav');
console.log('   - Size:', audioBuffer.length, 'bytes');
console.log('   - Duration: 2 seconds');
console.log('   - Format: WAV, 16kHz, Mono');
