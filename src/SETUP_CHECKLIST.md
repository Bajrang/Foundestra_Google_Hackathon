# 🚀 Quick Setup Checklist - Get AI Working in 5 Minutes

## ✅ Step-by-Step Setup

### Step 1: Get Your API Key (2 minutes)

1. **Visit Google AI Studio:**
   ```
   https://aistudio.google.com/app/apikey
   ```

2. **Create or Select Project:**
   - If you have a Google Cloud project, select it
   - If not, click "Create API key in new project"

3. **Copy the API Key:**
   - It will look like: `AIzaSyC...` (starts with `AIzaSy`)
   - Keep it safe - you'll need it in the next step

### Step 2: Enable the API (1 minute)

1. **Visit the API Library:**
   ```
   https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
   ```

2. **Enable the API:**
   - Click the blue "ENABLE" button
   - Wait for confirmation (usually instant)

### Step 3: Set Environment Variable in Supabase (1 minute)

1. **Open Supabase Dashboard:**
   - Go to your project
   - Navigate to: **Edge Functions** → **Settings** → **Secrets**

2. **Add the Secret:**
   - Secret Name: `VERTEX_AI_API_KEY`
   - Value: Paste your API key from Step 1
   - Click "Save"

### Step 4: Test the Setup (1 minute)

1. **Run the diagnostic endpoint:**
   ```bash
   # Replace with your actual values
   curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

2. **Expected response:**
   ```json
   {
     "status": "ok",
     "configuration": {
       "authentication": {
         "apiKey": "✓ Set"
       },
       "recommendation": "✅ API Key is configured - Gemini AI should work!"
     }
   }
   ```

3. **Test the connection:**
   ```bash
   curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

4. **Expected response:**
   ```json
   {
     "status": "success",
     "message": "✅ Gemini AI is working correctly!"
   }
   ```

---

## 🔍 Quick Diagnostics

### Problem: Getting 401 Error

**Cause:** Invalid API key

**Solution:**
1. Check if API key is correct (no extra spaces)
2. Generate a new API key at https://aistudio.google.com/app/apikey
3. Update VERTEX_AI_API_KEY in Supabase
4. Test again

### Problem: Getting 403 Error

**Cause:** Generative Language API not enabled

**Solution:**
1. Visit https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. Click "ENABLE"
3. Wait 1-2 minutes for propagation
4. Test again

### Problem: "VERTEX_AI_API_KEY environment variable not set"

**Cause:** Environment variable not configured in Supabase

**Solution:**
1. Go to Supabase Dashboard
2. Edge Functions → Settings → Secrets
3. Add VERTEX_AI_API_KEY with your API key
4. Make sure there are no typos in the variable name

### Problem: AI features not showing in app

**Cause:** Application not detecting AI availability

**Solution:**
1. Open browser console (F12)
2. Look for messages:
   - ✅ Good: `✓ Gemini AI configured with API key`
   - ❌ Bad: `○ Gemini AI disabled - using enhanced static suggestions`
3. If disabled, check environment variable is set correctly
4. Refresh the application

---

## 🎯 Verification Steps

After completing setup, verify everything works:

### 1. Check Configuration
```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f7922768/vertex-config \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Look for:**
- ✅ `"apiKey": "✓ Set"`
- ✅ `"recommendation": "✅ API Key is configured"`

### 2. Test Connection
```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Look for:**
- ✅ `"status": "success"`
- ✅ `"message": "✅ Gemini AI is working correctly!"`

### 3. Test Destination Search
```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f7922768/suggest-destinations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"query": "beach destinations", "userInterests": ["relaxation"]}'
```

**Look for:**
- ✅ Suggestions with `"isAIEnhanced": true`
- ✅ Personalized descriptions
- ✅ AI insights

### 4. Check in Application
1. Open the application
2. Search for any destination (e.g., "romantic getaway")
3. **Look for:**
   - Purple "AI Powered" badges
   - Personalized descriptions
   - Insider tips
   - "Powered by Gemini AI" banner

4. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Go to Console tab
   - **Look for:**
     - ✅ `✓ Gemini AI configured with API key`
     - ✅ `→ AI enhancing X destinations for query: "..."`
     - ✅ `✓ AI enhanced X destinations successfully`

---

## 🆘 Still Having Issues?

### Run Full Diagnostic

```bash
# 1. Check environment configuration
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f7922768/vertex-config \
  -H "Authorization: Bearer YOUR_ANON_KEY" | jq

# 2. Test AI connection
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
  -H "Authorization: Bearer YOUR_ANON_KEY" | jq

# 3. Test destination search
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f7922768/suggest-destinations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"query": "test", "userInterests": []}' | jq
```

### Check Supabase Logs

1. Go to Supabase Dashboard
2. Navigate to **Edge Functions** → **Logs**
3. Look for error messages
4. Search for:
   - "Gemini AI" messages
   - Error codes (401, 403, 404)
   - API call failures

### Verify API Key Directly

Test your API key directly with Google's API:

```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "role": "user",
      "parts": [{"text": "Say hello in 3 words"}]
    }]
  }'
```

**Expected Response:**
```json
{
  "candidates": [{
    "content": {
      "parts": [{"text": "Hello to you!"}]
    }
  }]
}
```

---

## 📋 Environment Variables Summary

Here are all the environment variables your application uses:

| Variable | Purpose | Required? | Where to Get |
|----------|---------|-----------|--------------|
| `VERTEX_AI_API_KEY` | Gemini AI access | ✅ Yes (for AI) | https://aistudio.google.com/app/apikey |
| `GOOGLE_CLOUD_PROJECT` | Project ID | ⚠️ Optional | Google Cloud Console |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | OAuth alternative | ❌ Not needed | Google Cloud Console |
| `OPENWEATHER_API_KEY` | Weather data | ✅ Yes (for weather) | https://openweathermap.org/api |
| `SUPABASE_URL` | Database URL | ✅ Auto-set | Supabase Dashboard |
| `SUPABASE_ANON_KEY` | Public API key | ✅ Auto-set | Supabase Dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin access | ✅ Auto-set | Supabase Dashboard |

**Note:** Only `VERTEX_AI_API_KEY` needs manual configuration for AI features.

---

## ✨ What You Get With AI Enabled

Once setup is complete, your application will have:

### 🎯 Smart Destination Search
- Understands complex queries like "romantic mountain getaway"
- Finds destinations beyond the database
- Discovers hidden gems

### 💡 Intelligent Suggestions
- Personalized descriptions based on search intent
- Context-aware recommendations
- Unique insider tips

### 🚀 Dynamic Content
- AI-generated itineraries
- Adaptive recommendations
- Real-time personalization

### 🎨 Enhanced UX
- Purple "AI Powered" badges
- Rich, engaging descriptions
- Conversational insights

---

## 🎉 Success Indicators

You'll know AI is working when you see:

### In the Application:
- 🟣 Purple "AI Powered" badges on suggestions
- 💬 Personalized, conversational descriptions
- 💡 Unique insider tips and hidden gems
- ✨ "Powered by Gemini AI" banner

### In Browser Console:
- ✅ `✓ Gemini AI configured with API key`
- ✅ `→ AI enhancing X destinations`
- ✅ `✓ AI enhanced X destinations successfully`
- ✅ `✓ Gemini API response received successfully`

### In Server Logs:
- ✅ `→ Calling Gemini AI API...`
- ✅ `✓ Gemini AI response received successfully`
- ✅ `✓ AI found X places for "query"`

---

## 🔗 Quick Links

- **Get API Key:** https://aistudio.google.com/app/apikey
- **Enable API:** https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
- **API Documentation:** https://ai.google.dev/gemini-api/docs
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Google Cloud Console:** https://console.cloud.google.com

---

**Total Setup Time: ~5 minutes** ⏱️

**Difficulty: Easy** 🟢

**Prerequisites: Google account** 📧

---

Need help? Check the detailed guide in `/API_ACCESS_REQUIREMENTS.md`
