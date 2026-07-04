import { readFileSync, existsSync } from 'fs';
import crypto from 'crypto';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MODEL = process.env.GOOGLE_GENAI_VERTEXAI_MODEL || 'gemini-2.5-flash';
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

let serviceAccountKey = null;
let accessToken = null;
let tokenExpiry = 0;

export function isRunningOnGCP() {
  return !!(process.env.K_SERVICE || process.env.FUNCTION_TARGET || process.env.GCLOUD_PROJECT);
}

async function getAccessTokenFromMetadata() {
  if (!isRunningOnGCP()) return null;
  try {
    const res = await fetch(
      'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
      { headers: { 'Metadata-Flavor': 'Google' } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + ((data.expires_in || 3600) - 60) * 1000;
    return accessToken;
  } catch {
    return null;
  }
}

function loadServiceAccount() {
  if (serviceAccountKey) return serviceAccountKey;

  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.startsWith('{')) {
    try {
      serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      return serviceAccountKey;
    } catch {
      // continue
    }
  }

  const candidates = [
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    resolve(__dirname, '..', 'google-hackathon-sa-key.json'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    const actual = existsSync(candidate) ? candidate : resolve(__dirname, '..', candidate);
    if (!existsSync(actual)) continue;
    try {
      serviceAccountKey = JSON.parse(readFileSync(actual, 'utf8'));
      return serviceAccountKey;
    } catch {
      // try next
    }
  }
  return null;
}

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;

  const metadataToken = await getAccessTokenFromMetadata();
  if (metadataToken) return metadataToken;

  const key = loadServiceAccount();
  if (!key) throw new Error('Service account key not configured');

  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: key.private_key_id })).toString('base64url');
  const claims = Buffer.from(JSON.stringify({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  })).toString('base64url');
  const input = `${header}.${claims}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(input);
  const jwt = `${input}.${sign.sign(key.private_key, 'base64url')}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  });

  const data = await res.json();
  if (!data.access_token) throw new Error(data.error_description || 'Failed to obtain access token');

  accessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return accessToken;
}

export function isVertexAIConfigured() {
  return isRunningOnGCP() || !!loadServiceAccount() || !!process.env.VERTEX_AI_API_KEY;
}

export async function callVertexAI(prompt, systemInstruction) {
  const key = loadServiceAccount();
  const requestBody = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json',
    },
  };

  if (systemInstruction) {
    requestBody.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  if (key || isRunningOnGCP()) {
    const token = await getAccessToken();
    const projectId = key?.project_id || process.env.GOOGLE_CLOUD_PROJECT || 'foundestra';
    const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Vertex AI error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty Vertex AI response');
    return text;
  }

  const apiKey = process.env.VERTEX_AI_API_KEY;
  if (!apiKey) throw new Error('No Vertex AI credentials configured');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    throw new Error(`Generative Language API error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function parseJsonArray(text) {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');
  if (start === -1 || end === -1) throw new Error('No JSON array in AI response');
  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function getAIDestinationSuggestions(query, userInterests = []) {
  const interestsText = userInterests.length ? `User interests: ${userInterests.join(', ')}.` : '';

  const prompt = `You are an expert Indian travel planner. A user searched for "${query}". ${interestsText}

Return 5-8 real Indian travel destinations that match this search. Use actual cities, regions, or tourist areas in India.

Return ONLY a JSON array (no markdown) with objects containing:
- name (string)
- state (string)
- country ("India")
- tags (string array)
- estimatedCost (number in INR per person)
- duration (string like "3-4 days")
- bestSeason (string)
- description (1-2 engaging sentences)
- highlights (string array of 3-4 real attractions)
- aiReason (why this matches the search)
- aiInsight (one insider tip)

Focus on real, bookable destinations. Include lesser-known gems when relevant.`;

  const systemInstruction = 'You are a knowledgeable India travel expert. Always respond with valid JSON arrays only. Use real place names and accurate regional information.';

  const raw = await callVertexAI(prompt, systemInstruction);
  const items = parseJsonArray(raw);

  return items.map((item) => ({
    name: item.name,
    state: item.state || 'India',
    country: item.country || 'India',
    tags: item.tags || [],
    estimatedCost: item.estimatedCost || 20000,
    duration: item.duration || '3-4 days',
    bestSeason: item.bestSeason || 'Oct-Mar',
    description: item.description || `Explore ${item.name}`,
    highlights: item.highlights || [],
    coordinates: item.coordinates || null,
    isAIEnhanced: true,
    aiReason: item.aiReason || `Great match for "${query}"`,
    aiInsight: item.aiInsight,
    dataSource: 'Vertex AI Gemini',
  }));
}

function parseJsonObject(text) {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object in AI response');
  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function generateAIItinerary(tripData) {
  const start = new Date(tripData.startDate);
  const end = new Date(tripData.endDate);
  const dayCount = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  const prompt = `Create a ${dayCount}-day India travel itinerary for ${tripData.destination}.
Dates: ${tripData.startDate} to ${tripData.endDate}
Budget: ₹${tripData.budget} INR per person
Interests: ${(tripData.interests || []).join(', ') || 'general sightseeing'}

Return ONLY compact JSON:
{"title":"string","currency":"INR","total_estimated_cost":number,"cost_breakdown":{"transport":n,"accommodation":n,"activities":n,"meals":n,"other":n},"days":[{"date":"YYYY-MM-DD","segments":[{"start_time":"09:00","end_time":"12:00","activity_type":"visit","title":"real place name","poi_id":"id","location":{"name":"string","lat":0,"lon":0},"estimated_cost":500,"booking_offer_id":"offer_1","notes":null}],"day_total_cost":number}],"warnings":[],"references":[]}

Use 2-3 real attractions per day in ${tripData.destination}. Keep JSON valid and concise.`;

  const raw = await callVertexAI(prompt, 'Return only valid compact JSON. No markdown.');
  const parsed = parseJsonObject(raw);
  if (!Array.isArray(parsed.days) || parsed.days.length === 0) {
    throw new Error('AI itinerary missing days');
  }
  return parsed;
}