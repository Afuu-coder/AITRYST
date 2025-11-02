// Test video generation and wait for complete output
require('dotenv').config({ path: '.env.local' });

async function testVideoGenerationComplete() {
  console.log('\n🎥 TESTING VIDEO GENERATION - FULL WAIT');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⏰ This will wait up to 10 minutes for the video to complete');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  try {
    // Step 1: Start video generation
    console.log('📤 Starting video generation...');
    const startTime = Date.now();
    
    const response = await fetch('http://localhost:3000/api/generate-festival-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        festival: 'Diwali',
        productName: 'Handwoven Silk Sari',
        productDescription: 'Beautiful golden borders with intricate peacock patterns, traditional Indian craftsmanship',
        aspectRatio: '16:9',
        durationSeconds: '8'
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to start video: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(`Start failed: ${result.error}`);
    }

    console.log(`✅ Video generation started!`);
    console.log(`   Operation ID: ${result.operationName.substring(0, 80)}...`);
    console.log(`   Estimated time: 2-4 minutes\n`);

    const operationName = result.operationName;
    
    // Step 2: Poll for completion (up to 10 minutes)
    console.log('⏳ Polling for video completion...');
    console.log('   (This may take 2-4 minutes, please be patient)\n');
    
    const maxAttempts = 120; // 10 minutes
    let attempts = 0;
    let videoComplete = false;
    let videoResult = null;
    
    while (attempts < maxAttempts && !videoComplete) {
      attempts++;
      
      // Wait 5 seconds before checking
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const statusResponse = await fetch(
        `http://localhost:3000/api/generate-festival-video?operation=${encodeURIComponent(operationName)}`
      );
      
      if (!statusResponse.ok) {
        console.log(`\n⚠️  Warning: Status check failed (${statusResponse.status})`);
        continue;
      }
      
      const statusResult = await statusResponse.json();
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const minutes = Math.floor(elapsed / 60);
      const seconds = Math.floor(elapsed % 60);
      
      // Update progress
      process.stdout.write(`\r   ⏱️  Attempt ${attempts}/${maxAttempts} - ${minutes}m ${seconds}s elapsed - Done: ${statusResult.done ? 'YES ✓' : 'NO'}   `);
      
      if (statusResult.done) {
        console.log('\n\n🎉 VIDEO GENERATION COMPLETE!\n');
        videoComplete = true;
        videoResult = statusResult;
        break;
      }
    }
    
    if (!videoComplete) {
      console.log('\n\n⏰ Video generation timed out after 10 minutes');
      console.log('   This is unusual. Please check:');
      console.log('   1. Google Cloud quotas');
      console.log('   2. Veo API availability');
      console.log('   3. Try again in a few minutes\n');
      return;
    }
    
    // Step 3: Display results
    console.log('📊 VIDEO GENERATION RESULTS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`⏱️  Total time: ${totalTime} seconds (${(totalTime / 60).toFixed(2)} minutes)`);
    
    if (videoResult.error) {
      console.log(`\n❌ ERROR:`);
      console.log(`   ${JSON.stringify(videoResult.error, null, 2)}\n`);
      return;
    }
    
    if (videoResult.response) {
      console.log(`\n✅ Response received from Veo 3.0:`);
      
      const predictions = videoResult.response.predictions || videoResult.response;
      
      if (Array.isArray(predictions) && predictions.length > 0) {
        const videoData = predictions[0];
        
        console.log(`   Has predictions: YES ✓`);
        console.log(`   Prediction count: ${predictions.length}`);
        
        if (videoData.bytesBase64Encoded) {
          const sizeKB = (videoData.bytesBase64Encoded.length * 0.75 / 1024).toFixed(2);
          console.log(`\n📹 VIDEO OUTPUT:`);
          console.log(`   Format: Base64 encoded`);
          console.log(`   Size: ~${sizeKB} KB`);
          console.log(`   First 100 chars: ${videoData.bytesBase64Encoded.substring(0, 100)}...`);
          console.log(`\n   ✅ VIDEO IS READY!`);
          console.log(`   You can:`);
          console.log(`   1. View it in the web UI at: http://localhost:3000/studio/festival-campaigns`);
          console.log(`   2. The video is ready to play in browser`);
          console.log(`   3. Download button will be available\n`);
        } else if (videoData.gcsUri) {
          console.log(`\n📹 VIDEO OUTPUT:`);
          console.log(`   Format: Google Cloud Storage URI`);
          console.log(`   Location: ${videoData.gcsUri}`);
          console.log(`\n   ✅ VIDEO IS STORED!`);
          console.log(`   You can:`);
          console.log(`   1. Access it from GCS`);
          console.log(`   2. The web UI will download it automatically\n`);
        } else {
          console.log(`\n⚠️  Video data received but in unexpected format:`);
          console.log(JSON.stringify(videoData, null, 2));
        }
      } else {
        console.log(`\n⚠️  Response received but no predictions array:`);
        console.log(JSON.stringify(videoResult.response, null, 2));
      }
    } else {
      console.log(`\n⚠️  Operation completed but no response data`);
      console.log(JSON.stringify(videoResult, null, 2));
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ TEST COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.log('\n❌ TEST ERROR:');
    console.log(`   ${error.message}\n`);
    if (error.stack) {
      console.log('Stack trace:');
      console.log(error.stack);
    }
  }
}

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║     Video Generation - Complete Output Test           ║');
console.log('╚════════════════════════════════════════════════════════╝');

testVideoGenerationComplete();
