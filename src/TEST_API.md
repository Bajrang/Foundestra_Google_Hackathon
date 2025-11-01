# 🧪 API Testing Guide

## Test Gemini AI Integration

### Quick Test Command

Replace `YOUR_API_KEY` with your actual API key:

```bash
curl "https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.0-flash-lite:generateContent?key=YOUR_API_KEY" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "role": "user",
      "parts": [{
        "text": "List 3 beautiful beach destinations in India with one sentence description each"
      }]
    }]
  }'
```

### Expected Response:
```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "text": "Here are 3 beautiful beach destinations:\n1. Goa - Famous for golden beaches and vibrant nightlife\n2. Andaman Islands - Pristine waters and coral reefs\n3. Kerala Beaches - Serene backwaters meet the Arabian Sea"
      }]
    }
  }]
}
```

---

## Test Destination Suggestions Endpoint

### Using Your Supabase Project:

```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f7922768/suggest-destinations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -d '{
    "query": "beach vacation",
    "userInterests": ["adventure", "water sports"]
  }'
```

### Expected Response:
```json
{
  "query": "beach vacation",
  "suggestions": [
    {
      "name": "Goa",
      "state": "Goa",
      "country": "India",
      "description": "Goa's golden coastline offers perfect blend of relaxation and adventure!",
      "tags": ["beaches", "nightlife", "water sports"],
      "estimatedCost": 22000,
      "duration": "4-5 days",
      "bestSeason": "Nov-Feb",
      "highlights": ["Baga Beach", "Fort Aguada", "Water Sports"],
      "aiReason": "Perfect for adventure & water sports enthusiasts",
      "aiInsight": "Visit Butterfly Beach at night for bioluminescent plankton!",
      "isAIEnhanced": true
    }
  ],
  "totalMatches": 6,
  "aiPowered": true
}
```

---

## Test Different Queries

### 1. Specific Location:
```bash
curl ... -d '{"query": "jaipur", "userInterests": []}'
```

### 2. Activity-Based:
```bash
curl ... -d '{"query": "trekking adventure", "userInterests": ["mountains"]}'
```

### 3. Vague Query (Tests AI Search):
```bash
curl ... -d '{"query": "peaceful escape", "userInterests": []}'
```

### 4. Offbeat Search:
```bash
curl ... -d '{"query": "hidden gems kerala", "userInterests": ["nature"]}'
```

---

## Verify in Browser

### Step 1: Open Application
```
http://localhost:5173
```

### Step 2: Open Browser Console
```
F12 → Console tab
```

### Step 3: Search for Destination
```
Type: "beach vacation"
```

### Step 4: Check Console Logs
Look for:
```
✓ Vertex AI enabled with API key
→ Calling Gemini API for AI generation...
✓ Gemini API response received successfully
✓ AI enhanced 3 destinations successfully
```

### Step 5: Verify Results
Should see:
- Purple "AI Powered" badges
- "Powered by Gemini AI" banner
- Insider tips in green boxes
- Personalized descriptions

---

## Troubleshooting

### Issue: "API key not found"
**Fix:** Set `VERTEX_AI_API_KEY` in Supabase Edge Function environment

### Issue: 401 Error
**Fix:** Verify API key is correct and active

### Issue: No AI suggestions
**Fix:** Check logs for error messages, may be using static fallback

### Issue: Slow responses
**Note:** AI calls take 800-1500ms - this is normal

---

## Success Indicators

✅ **API Key Working If:**
- Logs show: ✓ Vertex AI enabled
- Purple "AI Powered" badges appear
- Insider tips are unique and contextual
- Descriptions are engaging and personalized

✅ **Fallback Working If:**
- Green "Smart Match" badges appear
- No errors in console
- Suggestions still appear
- Tips are category-based

---

## Monitor Performance

### Check Response Times:
```bash
# In browser Network tab
Filter: suggest-destinations
Check: Response time should be 50ms-1.5s
```

### Check AI Usage:
```bash
# In console logs
Count: ✓ symbols (AI success)
Count: ○ symbols (static fallback)
```

---

**Quick Test:** Just search for "beach" in the app - if you see purple "AI Powered" badges, everything is working! 🎉
