const { getServerEnv } = require('./lib/constants/config');
const fetch = require('node-fetch');

async function listModels() {
  const { googleAiApiKey } = getServerEnv();
  if (!googleAiApiKey) {
    console.error("No Google AI API Key found.");
    return;
  }

  console.log("Using API Key:", googleAiApiKey.substring(0, 10) + "...");
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${googleAiApiKey}`);
    const data = await response.json();
    
    if (data.error) {
      console.error("API Error:", data.error);
      return;
    }

    console.log("Available Models:");
    data.models.forEach(m => {
      console.log(`- ${m.name} (${m.displayName})`);
    });
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

listModels();
