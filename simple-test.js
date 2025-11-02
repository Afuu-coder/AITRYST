// Simple direct test without environment loading
const fetch = require('node-fetch');

async function testContent() {
  console.log('\n🧪 Testing Content Generation API...\n');
  
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
        productInfo: 'Handwoven silk sari',
        language: { id: 'en', name: 'English' },
        platforms: ['instagram']
      })
    });

    const text = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', text.substring(0, 500));
    
    try {
      const json = JSON.parse(text);
      console.log('\n✅ JSON parsed successfully');
      console.log('Keys:', Object.keys(json));
      if (json.caption) {
        console.log('\n✅ CONTENT GENERATION WORKING!');
        console.log('Caption:', json.caption);
      }
    } catch (e) {
      console.log('\n❌ Not valid JSON - might be HTML error page');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testContent();
