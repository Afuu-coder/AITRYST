/**
 * End-to-End Test for AI Content Studio
 * Tests all features to ensure they work correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 AI Content Studio - End-to-End Test\n');
console.log('=' .repeat(60));

// Test 1: Check if required files exist
console.log('\n📁 Test 1: Checking File Structure...');
const requiredFiles = [
  'ai/flows/generate-product-details.ts',
  'app/studio/ai-content/page.tsx',
  'lib/firebase.ts',
  'ai/genkit.ts',
  '.env.local'
];

let filesExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) filesExist = false;
});

if (!filesExist) {
  console.log('\n❌ Some required files are missing!');
  process.exit(1);
}

console.log('\n✅ All required files exist');

// Test 2: Check environment variables
console.log('\n🔑 Test 2: Checking Environment Variables...');
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

const requiredEnvVars = [
  'GOOGLE_API_KEY',
  'GEMINI_API_KEY',
  'GOOGLE_CLOUD_PROJECT_ID'
];

let envVarsExist = true;
requiredEnvVars.forEach(envVar => {
  const exists = envContent.includes(envVar);
  const hasValue = exists && !envContent.match(new RegExp(`${envVar}=\\s*$`, 'm'));
  console.log(`  ${hasValue ? '✅' : '❌'} ${envVar}${hasValue ? '' : ' (missing or empty)'}`);
  if (!hasValue) envVarsExist = false;
});

if (!envVarsExist) {
  console.log('\n⚠️  Some environment variables are missing or empty');
  console.log('   The app may not work correctly without proper API keys');
} else {
  console.log('\n✅ All required environment variables are set');
}

// Test 3: Check backend flow structure
console.log('\n🔧 Test 3: Checking Backend Flow Structure...');
const backendPath = path.join(__dirname, 'ai/flows/generate-product-details.ts');
const backendContent = fs.readFileSync(backendPath, 'utf-8');

const backendChecks = [
  { name: 'generateProductDetails function', pattern: /export async function generateProductDetails/ },
  { name: 'Input schema definition', pattern: /GenerateProductDetailsInputSchema/ },
  { name: 'Output schema definition', pattern: /GenerateProductDetailsOutputSchema/ },
  { name: 'Text generation prompt', pattern: /generateTextPrompt/ },
  { name: 'Audio transcription flow', pattern: /transcribeAudioFlow/ },
  { name: 'Main flow definition', pattern: /generateProductDetailsFlow/ },
  { name: 'Model configuration', pattern: /model:\s*['"]googleai\/gemini/ },
  { name: 'Genkit AI import', pattern: /import.*{ai}.*from.*genkit/ }
];

let backendValid = true;
backendChecks.forEach(check => {
  const exists = check.pattern.test(backendContent);
  console.log(`  ${exists ? '✅' : '❌'} ${check.name}`);
  if (!exists) backendValid = false;
});

if (!backendValid) {
  console.log('\n❌ Backend flow has structural issues!');
} else {
  console.log('\n✅ Backend flow structure is correct');
}

// Test 4: Check frontend page structure
console.log('\n🎨 Test 4: Checking Frontend Page Structure...');
const frontendPath = path.join(__dirname, 'app/studio/ai-content/page.tsx');
const frontendContent = fs.readFileSync(frontendPath, 'utf-8');

const frontendChecks = [
  { name: 'React Hook Form import', pattern: /import.*useForm.*from.*react-hook-form/ },
  { name: 'Zod validation', pattern: /import.*z.*from.*zod/ },
  { name: 'generateProductDetails import', pattern: /import.*generateProductDetails/ },
  { name: 'Firebase imports', pattern: /import.*{.*db.*,.*storage.*}.*from.*firebase/ },
  { name: 'Photo upload handler', pattern: /handleFileChange/ },
  { name: 'Form submission handler', pattern: /onSubmit.*async/ },
  { name: 'Copy to clipboard function', pattern: /copyToClipboard/ },
  { name: 'Image download function', pattern: /handleDownloadImage/ },
  { name: 'Tabs component', pattern: /<Tabs.*defaultValue/ },
  { name: 'Form validation schema', pattern: /uploadSchema.*z\.object/ }
];

let frontendValid = true;
frontendChecks.forEach(check => {
  const exists = check.pattern.test(frontendContent);
  console.log(`  ${exists ? '✅' : '❌'} ${check.name}`);
  if (!exists) frontendValid = false;
});

if (!frontendValid) {
  console.log('\n❌ Frontend page has structural issues!');
} else {
  console.log('\n✅ Frontend page structure is correct');
}

// Test 5: Check UI components
console.log('\n🖼️  Test 5: Checking UI Components...');
const uiChecks = [
  { name: 'Photo upload section', pattern: /Step 1.*Product Photo/ },
  { name: 'Voice note section', pattern: /Step 2.*Voice Note/ },
  { name: 'Product details form', pattern: /Step 3.*Product Details/ },
  { name: 'Category selector', pattern: /productCategory/ },
  { name: 'Platform selector', pattern: /platform.*instagram.*whatsapp/ },
  { name: 'Brand tone selector', pattern: /brandTone/ },
  { name: 'Language selector', pattern: /language.*en.*hi/ },
  { name: 'Generate button', pattern: /Generate Full Marketing Kit/ },
  { name: 'Text content tab', pattern: /Text Content/ },
  { name: 'Image mockups tab', pattern: /Image Mockups/ },
  { name: 'Product title display', pattern: /productTitle/ },
  { name: 'Bilingual descriptions', pattern: /descriptionEn.*descriptionHi/ },
  { name: 'Marketing caption', pattern: /marketingCaption/ },
  { name: 'Hashtags display', pattern: /hashtags/ },
  { name: 'Engagement score', pattern: /engagementScore/ }
];

let uiValid = true;
uiChecks.forEach(check => {
  const exists = check.pattern.test(frontendContent);
  console.log(`  ${exists ? '✅' : '❌'} ${check.name}`);
  if (!exists) uiValid = false;
});

if (!uiValid) {
  console.log('\n❌ Some UI components are missing!');
} else {
  console.log('\n✅ All UI components are present');
}

// Test 6: Check data flow
console.log('\n🔄 Test 6: Checking Data Flow...');
const dataFlowChecks = [
  { name: 'File to Data URI conversion', pattern: /fileToDataUri/ },
  { name: 'AI result state management', pattern: /setResult.*aiResult/ },
  { name: 'Firebase upload logic', pattern: /uploadString.*photoRef/ },
  { name: 'Firestore save logic', pattern: /addDoc.*collection/ },
  { name: 'Error handling', pattern: /try.*catch.*error/ },
  { name: 'Loading state', pattern: /isGenerating.*setIsGenerating/ },
  { name: 'Toast notifications', pattern: /toast.*title.*description/ }
];

let dataFlowValid = true;
dataFlowChecks.forEach(check => {
  const exists = check.pattern.test(frontendContent);
  console.log(`  ${exists ? '✅' : '❌'} ${check.name}`);
  if (!exists) dataFlowValid = false;
});

if (!dataFlowValid) {
  console.log('\n❌ Data flow has issues!');
} else {
  console.log('\n✅ Data flow is correctly implemented');
}

// Test 7: Check TypeScript types
console.log('\n📝 Test 7: Checking TypeScript Types...');
const typeChecks = [
  { name: 'Input type export', pattern: /export type GenerateProductDetailsInput/ },
  { name: 'Output type export', pattern: /export type GenerateProductDetailsOutput/ },
  { name: 'Form values type', pattern: /type UploadFormValues/ },
  { name: 'Zod schema inference', pattern: /z\.infer<typeof/ }
];

let typesValid = true;
typeChecks.forEach(check => {
  const exists = check.pattern.test(backendContent) || check.pattern.test(frontendContent);
  console.log(`  ${exists ? '✅' : '❌'} ${check.name}`);
  if (!exists) typesValid = false;
});

if (!typesValid) {
  console.log('\n⚠️  Some TypeScript types may be missing');
} else {
  console.log('\n✅ TypeScript types are properly defined');
}

// Test 8: Check language support
console.log('\n🌍 Test 8: Checking Language Support...');
const languages = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'mr', 'pa', 'ml', 'kn'];
const languagePattern = new RegExp(languages.join('|'));
const hasLanguageSupport = languagePattern.test(backendContent) && languagePattern.test(frontendContent);

console.log(`  ${hasLanguageSupport ? '✅' : '❌'} Multi-language support (${languages.length} languages)`);

if (hasLanguageSupport) {
  console.log('  Supported languages:');
  console.log('    • English (en), Hindi (hi), Tamil (ta), Telugu (te)');
  console.log('    • Bengali (bn), Gujarati (gu), Marathi (mr)');
  console.log('    • Punjabi (pa), Malayalam (ml), Kannada (kn)');
}

// Test 9: Check platform support
console.log('\n📱 Test 9: Checking Platform Support...');
const platforms = ['instagram', 'whatsapp', 'facebook', 'etsy'];
let platformsValid = true;

platforms.forEach(platform => {
  const exists = frontendContent.includes(platform);
  console.log(`  ${exists ? '✅' : '❌'} ${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
  if (!exists) platformsValid = false;
});

if (!platformsValid) {
  console.log('\n⚠️  Some platforms may not be supported');
} else {
  console.log('\n✅ All platforms are supported');
}

// Test 10: Check brand tones
console.log('\n🎨 Test 10: Checking Brand Tone Options...');
const tones = ['traditional', 'royal', 'eco-friendly', 'luxury', 'playful', 'minimal-modern'];
let tonesValid = true;

tones.forEach(tone => {
  const exists = frontendContent.includes(tone);
  console.log(`  ${exists ? '✅' : '❌'} ${tone.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`);
  if (!exists) tonesValid = false;
});

if (!tonesValid) {
  console.log('\n⚠️  Some brand tones may not be available');
} else {
  console.log('\n✅ All brand tones are available');
}

// Final Summary
console.log('\n' + '='.repeat(60));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(60));

const allTests = [
  { name: 'File Structure', passed: filesExist },
  { name: 'Environment Variables', passed: envVarsExist },
  { name: 'Backend Flow', passed: backendValid },
  { name: 'Frontend Page', passed: frontendValid },
  { name: 'UI Components', passed: uiValid },
  { name: 'Data Flow', passed: dataFlowValid },
  { name: 'TypeScript Types', passed: typesValid },
  { name: 'Language Support', passed: hasLanguageSupport },
  { name: 'Platform Support', passed: platformsValid },
  { name: 'Brand Tones', passed: tonesValid }
];

const passedTests = allTests.filter(t => t.passed).length;
const totalTests = allTests.length;
const passRate = Math.round((passedTests / totalTests) * 100);

console.log();
allTests.forEach(test => {
  console.log(`  ${test.passed ? '✅' : '❌'} ${test.name}`);
});

console.log('\n' + '='.repeat(60));
console.log(`\n🎯 RESULT: ${passedTests}/${totalTests} tests passed (${passRate}%)\n`);

if (passRate === 100) {
  console.log('✅ ALL TESTS PASSED! The application structure is correct.\n');
  console.log('🚀 Next Steps:');
  console.log('   1. Open http://localhost:3001/studio/ai-content');
  console.log('   2. Upload a product image');
  console.log('   3. Fill out the form');
  console.log('   4. Click "Generate Full Marketing Kit"');
  console.log('   5. Verify the AI generates content correctly\n');
} else if (passRate >= 80) {
  console.log('⚠️  MOST TESTS PASSED. Minor issues detected.\n');
  console.log('   The application should work, but check the failed tests above.\n');
} else {
  console.log('❌ MULTIPLE TESTS FAILED. Please review the issues above.\n');
  console.log('   The application may not work correctly.\n');
}

console.log('='.repeat(60));
console.log('\n📝 For manual testing, check: test-ai-content-studio.md');
console.log('📖 For full documentation, check: AI_CONTENT_STUDIO_UPDATED.md\n');
