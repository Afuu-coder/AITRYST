// Test script for AI Content Studio image mockup functionality
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

// Test image path - update this to point to a test image on your system
const TEST_IMAGE_PATH = path.join(__dirname, 'test-product-image.jpg');
// If test image doesn't exist, we'll create a simple one
const createTestImage = async () => {
  if (!fs.existsSync(TEST_IMAGE_PATH)) {
    console.log('Test image not found, creating a placeholder...');
    // Download a placeholder image
    const response = await fetch('https://via.placeholder.com/500');
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(TEST_IMAGE_PATH, Buffer.from(buffer));
    console.log(`Created test image at ${TEST_IMAGE_PATH}`);
  }
};

// Test the enhance-image endpoint with different mockup presets
const testImageMockup = async () => {
  await createTestImage();
  
  const presets = ['lifestyle', 'human-interaction', 'poster'];
  const results = {};
  
  console.log('Starting image mockup tests...');
  
  for (const preset of presets) {
    console.log(`Testing preset: ${preset}`);
    
    const formData = new FormData();
    formData.append('image', fs.createReadStream(TEST_IMAGE_PATH));
    formData.append('preset', preset);
    
    try {
      const response = await fetch('http://localhost:3000/api/enhance-image', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error with preset ${preset}: ${response.status} ${response.statusText}`);
        console.error(errorText);
        results[preset] = { success: false, error: `${response.status} ${response.statusText}` };
        continue;
      }
      
      const data = await response.json();
      
      // Save the enhanced image to a file for inspection
      if (data.enhancedImageUrl) {
        const imgResponse = await fetch(data.enhancedImageUrl);
        const imgBuffer = await imgResponse.arrayBuffer();
        const outputPath = path.join(__dirname, `test-mockup-${preset}.jpg`);
        fs.writeFileSync(outputPath, Buffer.from(imgBuffer));
        console.log(`Saved ${preset} mockup to ${outputPath}`);
        
        results[preset] = { 
          success: true, 
          outputPath,
          enhancedImageUrl: data.enhancedImageUrl
        };
      } else {
        console.error(`No enhanced image URL returned for preset ${preset}`);
        results[preset] = { success: false, error: 'No enhanced image URL returned' };
      }
    } catch (error) {
      console.error(`Error testing preset ${preset}:`, error.message);
      results[preset] = { success: false, error: error.message };
    }
  }
  
  // Print summary
  console.log('\nTest Results Summary:');
  for (const [preset, result] of Object.entries(results)) {
    console.log(`${preset}: ${result.success ? '✅ Success' : '❌ Failed'} ${result.error || ''}`);
    if (result.success) {
      console.log(`  Output: ${result.outputPath}`);
    }
  }
};

// Run the test
testImageMockup().catch(error => {
  console.error('Test failed with error:', error);
});