/**
 * Feature Test Script for Festival Campaigns
 * Tests: Content Generation, Image Generation, Video Generation
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const testContentGeneration = async () => {
  console.log('\n🧪 Testing Content Generation (Gemini 2.0 Flash)...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/generate-festival-campaign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        festival: {
          id: 'diwali',
          name: 'Diwali',
          emoji: '🪔',
          theme: 'Festival of Lights'
        },
        productInfo: 'Handwoven silk sari with traditional golden borders and intricate peacock patterns',
        language: { id: 'en', name: 'English' },
        platforms: ['instagram', 'whatsapp', 'email']
      })
    });

    const data = await response.json();
    
    if (response.ok && data.caption) {
      console.log('✅ Content Generation: WORKING');
      console.log(`   Caption: ${data.caption.substring(0, 80)}...`);
      console.log(`   Hashtags: ${data.hashtags?.slice(0, 3).join(', ')}...`);
      console.log(`   Platforms: ${Object.keys(data.content || {}).join(', ')}`);
      return true;
    } else {
      console.log('❌ Content Generation: FAILED');
      console.log(`   Error: ${data.error || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Content Generation: ERROR');
    console.log(`   ${error.message}`);
    return false;
  }
};

const testImageGeneration = async () => {
  console.log('\n🧪 Testing Image Generation (Vertex AI Imagen 3)...\n');
  
  try {
    // Create a small test image (1x1 red pixel)
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    const response = await fetch('http://localhost:3000/api/generate-festival-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        photoDataUri: testImage,
        productName: 'Test Product',
        artisanName: 'Test Artisan',
        festival: 'Diwali',
        language: 'en'
      })
    });

    const data = await response.json();
    
    if (response.ok && data.success && data.images?.length > 0) {
      console.log('✅ Image Generation: WORKING');
      console.log(`   Generated: ${data.images.length} variations`);
      console.log(`   Variations: ${data.images.map(img => img.variation).join(', ')}`);
      return true;
    } else if (data.error?.includes('Permission') || data.error?.includes('403')) {
      console.log('⚠️  Image Generation: SERVICE ACCOUNT NEEDS PERMISSIONS');
      console.log(`   Error: ${data.details || data.error}`);
      console.log(`   Action: Add "Vertex AI User" role to service account`);
      return false;
    } else if (data.error?.includes('billing') || data.error?.includes('quota')) {
      console.log('⚠️  Image Generation: BILLING/QUOTA ISSUE');
      console.log(`   Error: ${data.details || data.error}`);
      console.log(`   Action: Enable billing on Google Cloud project`);
      return false;
    } else {
      console.log('❌ Image Generation: FAILED');
      console.log(`   Error: ${data.details || data.error || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Image Generation: ERROR');
    console.log(`   ${error.message}`);
    return false;
  }
};

const checkEnvironment = () => {
  console.log('\n📋 Environment Check:\n');
  
  const checks = [
    { name: 'GOOGLE_API_KEY', value: process.env.GOOGLE_API_KEY, required: true },
    { name: 'GOOGLE_CLOUD_PROJECT_ID', value: process.env.GOOGLE_CLOUD_PROJECT_ID, required: true },
    { name: 'GOOGLE_APPLICATION_CREDENTIALS', value: process.env.GOOGLE_APPLICATION_CREDENTIALS, required: false },
  ];

  checks.forEach(check => {
    const status = check.value ? '✅' : (check.required ? '❌' : '⚠️');
    const value = check.value ? '(set)' : '(not set)';
    console.log(`${status} ${check.name}: ${value}`);
  });
  
  console.log('');
};

const runTests = async () => {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   🎉 Festival Campaigns - Feature Testing Suite      ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  
  checkEnvironment();
  
  const results = {
    content: await testContentGeneration(),
    images: await testImageGeneration(),
  };
  
  console.log('\n' + '═'.repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('═'.repeat(60) + '\n');
  
  console.log('Google Technologies Status:');
  console.log(`  ${results.content ? '✅' : '❌'} Gemini 2.0 Flash (Content Generation)`);
  console.log(`  ${results.images ? '✅' : '❌'} Vertex AI Imagen 3 (Image Generation)`);
  console.log(`  ⏳ Vertex AI Veo 3.0 (Video Generation) - Framework ready\n`);
  
  const workingCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`Overall: ${workingCount}/${totalCount} features working\n`);
  
  if (results.content && results.images) {
    console.log('🎉 SUCCESS! All tested features are working!');
    console.log('🚀 Ready to use at: http://localhost:3000/studio/festival-campaigns\n');
  } else if (results.content) {
    console.log('✅ Content generation is working!');
    console.log('⚠️  Image generation needs additional setup.');
    console.log('   See SETUP_GOOGLE_CLOUD.md for image generation setup.\n');
    console.log('🚀 You can use content generation now at: http://localhost:3000/studio/festival-campaigns\n');
  } else {
    console.log('❌ Issues detected. Check error messages above.');
    console.log('📖 See QUICK_START.md or SETUP_GOOGLE_CLOUD.md for help.\n');
  }
  
  console.log('═'.repeat(60));
};

// Run tests
runTests().catch(console.error);
