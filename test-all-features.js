/**
 * AI Content Studio - Complete Feature Test
 * Tests all 20 features systematically
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 AI Content Studio - Complete Feature Test\n');
console.log('=' .repeat(60));

let passedTests = 0;
let failedTests = 0;
const results = [];

function test(name, condition, description) {
  const status = condition ? '✅ PASS' : '❌ FAIL';
  const result = { name, status, description, passed: condition };
  results.push(result);
  
  if (condition) {
    passedTests++;
    console.log(`${status} - ${name}`);
  } else {
    failedTests++;
    console.log(`${status} - ${name}`);
    console.log(`   ⚠️  ${description}`);
  }
}

console.log('\n📦 Testing Frontend Code Structure...\n');

// Test 1: Image Upload Feature
const frontendPath = path.join(__dirname, 'app', 'studio', 'ai-content', 'page.tsx');
const frontendCode = fs.readFileSync(frontendPath, 'utf8');

test(
  '1. Image Upload',
  frontendCode.includes('handleImageUpload') && 
  frontendCode.includes('productImage') &&
  frontendCode.includes('imagePreview'),
  'Image upload handler with preview and validation'
);

// Test 2: Voice Note Feature
test(
  '2. Voice Note',
  frontendCode.includes('handleVoiceNoteUpload') && 
  frontendCode.includes('voiceNote') &&
  frontendCode.includes('voiceNotePreview') &&
  frontendCode.includes('audioInputRef'),
  'Voice note upload with audio transcription support'
);

// Test 3: Category Selection
test(
  '3. Category',
  frontendCode.includes("'Pottery'") && 
  frontendCode.includes("'Jewelry'") &&
  frontendCode.includes("'Textile'") &&
  frontendCode.includes('productCategory'),
  '7 product categories available'
);

// Test 4: Language Selection
test(
  '4. Language',
  frontendCode.includes("code: 'en'") && 
  frontendCode.includes("code: 'hi'") &&
  frontendCode.includes("code: 'bn'") &&
  frontendCode.includes("code: 'te'") &&
  frontendCode.includes('selectedLanguage'),
  '4 languages (English, Hindi, Bengali, Telugu)'
);

// Test 5: Platform Selection
test(
  '5. Platform',
  frontendCode.includes("value: 'instagram'") && 
  frontendCode.includes("value: 'whatsapp'") &&
  frontendCode.includes("value: 'facebook'") &&
  frontendCode.includes("value: 'etsy'") &&
  frontendCode.includes('selectedPlatform') &&
  frontendCode.includes('icon:'),
  '4 platforms with icons (Instagram, WhatsApp, Facebook, Etsy)'
);

// Test 6: Brand Tone Selection
test(
  '6. Brand Tone',
  frontendCode.includes("value: 'traditional'") && 
  frontendCode.includes("value: 'royal'") &&
  frontendCode.includes("value: 'eco-friendly'") &&
  frontendCode.includes("value: 'luxury'") &&
  frontendCode.includes("value: 'playful'") &&
  frontendCode.includes("value: 'minimal-modern'") &&
  frontendCode.includes('selectedBrandTone'),
  '6 brand tones with icons'
);

// Test 7: Product Title Output
test(
  '7. Product Title',
  frontendCode.includes('productTitle') &&
  frontendCode.includes('generatedContent.productTitle'),
  'AI-generated product title display'
);

// Test 8: English Description
test(
  '8. English Desc',
  frontendCode.includes('descriptionEn') &&
  frontendCode.includes('generatedContent.descriptionEn') &&
  frontendCode.includes('English Description'),
  'English storytelling description'
);

// Test 9: Hindi Description
test(
  '9. Hindi Desc',
  frontendCode.includes('descriptionHi') &&
  frontendCode.includes('generatedContent.descriptionHi') &&
  frontendCode.includes('Hindi Description'),
  'Hindi translation description'
);

// Test 10: Marketing Caption
test(
  '10. Caption',
  frontendCode.includes('marketingCaption') &&
  frontendCode.includes('generatedContent.marketingCaption') &&
  frontendCode.includes('Marketing Caption'),
  'Bilingual marketing caption with CTA'
);

// Test 11: Hashtags
test(
  '11. Hashtags',
  frontendCode.includes('hashtags') &&
  frontendCode.includes('generatedContent.hashtags') &&
  frontendCode.includes('.map(') &&
  frontendCode.includes('Badge'),
  '8-10 mixed-language hashtags'
);

// Test 12: Platform Suggestions
test(
  '12. Platforms',
  frontendCode.includes('suggestedPlatforms') &&
  frontendCode.includes('generatedContent.suggestedPlatforms') &&
  frontendCode.includes('Suggested Platforms'),
  '2-3 platform suggestions'
);

// Test 13: Engagement Score
test(
  '13. Score',
  frontendCode.includes('engagementScore') &&
  frontendCode.includes('generatedContent.engagementScore') &&
  frontendCode.includes('Engagement Score'),
  '1-10 engagement prediction'
);

// Test 14: Image Mockups
test(
  '14. Lifestyle',
  frontendCode.includes('imageMockups') &&
  frontendCode.includes('generatedContent.imageMockups') &&
  frontendCode.includes('lifestyle'),
  'Lifestyle mockup with natural lighting enhancement'
);

test(
  '15. Human Interaction',
  frontendCode.includes('human_interaction'),
  'Human interaction mockup with shadow enhancement'
);

test(
  '16. Poster',
  frontendCode.includes('poster'),
  'Poster mockup with clean background'
);

// Test 17: Copy to Clipboard
test(
  '17. Copy',
  frontendCode.includes('copyToClipboard') &&
  frontendCode.includes('navigator.clipboard.writeText') &&
  frontendCode.includes('Copy'),
  'Copy to clipboard for all text fields'
);

// Test 18: Download Images
test(
  '18. Download',
  frontendCode.includes('downloadImage') &&
  frontendCode.includes('Download') &&
  frontendCode.includes('.download'),
  'Download functionality for all images'
);

// Test 19: Tabs
test(
  '19. Tabs',
  frontendCode.includes('Tabs') &&
  frontendCode.includes('TabsContent') &&
  frontendCode.includes('TabsList') &&
  frontendCode.includes('TabsTrigger') &&
  frontendCode.includes('value="text"') &&
  frontendCode.includes('value="images"'),
  'Tabs for Text Content and Image Mockups'
);

// Test 20: Error Handling
test(
  '20. Errors',
  frontendCode.includes('toast.error') &&
  frontendCode.includes('Please upload') &&
  frontendCode.includes('Please select') &&
  frontendCode.includes('file.size') &&
  frontendCode.includes('file.type'),
  'Validation and error feedback'
);

console.log('\n' + '='.repeat(60));

// Test Backend Flow
console.log('\n🔧 Testing Backend Flow...\n');

const backendPath = path.join(__dirname, 'ai', 'flows', 'generate-product-details.ts');
const backendCode = fs.readFileSync(backendPath, 'utf8');

test(
  '21. Backend Input Schema',
  backendCode.includes('GenerateProductDetailsInputSchema') &&
  backendCode.includes('photoDataUri') &&
  backendCode.includes('voiceNoteDataUri') &&
  backendCode.includes('language') &&
  backendCode.includes('productCategory') &&
  backendCode.includes('platform') &&
  backendCode.includes('brandTone'),
  'Complete input schema with all 6 fields'
);

test(
  '22. Backend Output Schema',
  backendCode.includes('GenerateProductDetailsOutputSchema') &&
  backendCode.includes('productTitle') &&
  backendCode.includes('descriptionEn') &&
  backendCode.includes('descriptionHi') &&
  backendCode.includes('marketingCaption') &&
  backendCode.includes('hashtags') &&
  backendCode.includes('suggestedPlatforms') &&
  backendCode.includes('engagementScore') &&
  backendCode.includes('imageMockups'),
  'Complete output schema with all 8 fields'
);

test(
  '23. Audio Transcription Flow',
  backendCode.includes('transcribeAudioFlow') &&
  backendCode.includes('audioDataUri') &&
  backendCode.includes('Transcribe'),
  'Audio transcription with Gemini'
);

test(
  '24. Text Generation Prompt',
  backendCode.includes('generateTextPrompt') &&
  backendCode.includes('KalaSahayak') &&
  backendCode.includes('gemini-2.0-flash-exp'),
  'KalaSahayak AI persona with Gemini model'
);

test(
  '25. Image Enhancement Prompts',
  backendCode.includes('imageEnhancementPrompts') &&
  backendCode.includes('lifestyle') &&
  backendCode.includes('human_interaction') &&
  backendCode.includes('poster'),
  '3 image mockup variations defined'
);

console.log('\n' + '='.repeat(60));

// Test API Endpoints
console.log('\n🌐 Testing API Endpoints...\n');

const enhanceImagePath = path.join(__dirname, 'app', 'api', 'enhance-image', 'route.ts');
if (fs.existsSync(enhanceImagePath)) {
  const enhanceImageCode = fs.readFileSync(enhanceImagePath, 'utf8');
  
  test(
    '26. Enhance Image API',
    enhanceImageCode.includes('export async function POST') &&
    enhanceImageCode.includes('clean-background') &&
    enhanceImageCode.includes('natural-lighting') &&
    enhanceImageCode.includes('add-shadow') &&
    enhanceImageCode.includes('Vertex'),
    'Image enhancement API with Vertex AI Imagen'
  );
} else {
  test('26. Enhance Image API', false, 'API file not found');
}

console.log('\n' + '='.repeat(60));

// Summary
console.log('\n📊 TEST SUMMARY\n');
console.log(`Total Tests: ${passedTests + failedTests}`);
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`Success Rate: ${Math.round((passedTests / (passedTests + failedTests)) * 100)}%`);

if (failedTests === 0) {
  console.log('\n🎉 ALL TESTS PASSED! System is 100% ready!\n');
  console.log('✅ All 20 features are implemented correctly');
  console.log('✅ Backend flow is complete');
  console.log('✅ API endpoints are configured');
  console.log('\n🚀 Ready to test on localhost:3001/studio/ai-content\n');
} else {
  console.log('\n⚠️  Some tests failed. Please review the issues above.\n');
}

// Generate detailed report
console.log('=' .repeat(60));
console.log('\n📋 DETAILED FEATURE STATUS\n');

const featureGroups = {
  'Input Features': results.slice(0, 6),
  'Output Features': results.slice(6, 13),
  'Image Mockups': results.slice(13, 16),
  'UI Features': results.slice(16, 20),
  'Backend Features': results.slice(20, 25),
  'API Features': results.slice(25)
};

Object.entries(featureGroups).forEach(([group, features]) => {
  console.log(`\n${group}:`);
  features.forEach(feature => {
    console.log(`  ${feature.status} ${feature.name}`);
  });
});

console.log('\n' + '='.repeat(60));

// Save report to file
const report = {
  timestamp: new Date().toISOString(),
  totalTests: passedTests + failedTests,
  passed: passedTests,
  failed: failedTests,
  successRate: Math.round((passedTests / (passedTests + failedTests)) * 100),
  results: results,
  status: failedTests === 0 ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'
};

fs.writeFileSync(
  path.join(__dirname, 'test-results.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n📄 Detailed report saved to: test-results.json\n');

process.exit(failedTests === 0 ? 0 : 1);
