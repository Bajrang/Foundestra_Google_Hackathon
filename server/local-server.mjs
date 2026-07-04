import { serve } from '@hono/node-server';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { app, PREFIX } from './app.mjs';
import { isVertexAIConfigured } from './vertex-ai.mjs';
import { isGooglePlacesConfigured } from './google-places.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

dotenv.config({ path: resolve(projectRoot, '.env') });

const PORT = Number(process.env.LOCAL_API_PORT || process.env.PORT || 3001);

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Local API server running at http://localhost:${PORT}${PREFIX}`);
  console.log(isVertexAIConfigured() ? '✓ Vertex AI: configured' : '○ Vertex AI: not configured');
  console.log(isGooglePlacesConfigured() ? '✓ Google Places API: configured' : '○ Google Places API: set GOOGLE_MAPS_API_KEY in .env for live place data');
});