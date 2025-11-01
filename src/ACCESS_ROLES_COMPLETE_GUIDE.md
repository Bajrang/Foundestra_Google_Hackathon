# 🔐 Complete Access Roles & Permissions Guide

## 📊 Current Status

✅ **Environment Variables Configured:**
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_DB_URL
- OPENWEATHER_API_KEY
- VERTEX_API_KEY
- GOOGLE_CLOUD_PROJECT
- VERTEX_AI_API_KEY ← **This is what matters for AI**
- GOOGLE_SERVICE_ACCOUNT_KEY

---

## 🎯 What You Need for AI to Work

### Current Implementation: Google AI Studio (Simplest)

Your code uses the **Generative Language API** which is the simplest option:

**Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent`

**Requirements:**
1. ✅ API Key from Google AI Studio
2. ✅ Generative Language API enabled
3. ❌ No OAuth needed
4. ❌ No Service Account needed
5. ❌ No IAM roles needed

### What Access/Roles Are Needed?

**NONE!** The Generative Language API with API key authentication doesn't require any IAM roles.

You only need:
1. A Google account
2. An API key from https://aistudio.google.com/app/apikey
3. The Generative Language API enabled in your Google Cloud project

---

## 🚦 Diagnostic Steps

### Step 1: Check Current Configuration

**Visit this URL in your browser:**
```
https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config
```

Or use this dedicated diagnostic page:
```
YOUR_APP_URL#api-status
```

**What to look for:**
- `"apiKey": "✓ Set"` ← Should say this
- `"apiKeyPreview": "AIzaSy..."` ← Should show first 10 chars of your key
- `"recommendation": "✅ API Key is configured"` ← Should be positive

### Step 2: Test Connection

**Visit this URL:**
```
https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai
```

**Success Response:**
```json
{
  "status": "success",
  "message": "✅ Gemini AI is working correctly!",
  "capabilities": [
    "✓ Dynamic destination search",
    "✓ AI-enhanced suggestions",
    ...
  ]
}
```

**Error Responses:**

#### If VERTEX_AI_API_KEY not set:
```json
{
  "status": "error",
  "message": "VERTEX_AI_API_KEY environment variable not set",
  "instructions": [...]
}
```
**Fix:** Set the environment variable in Supabase

#### If API key is invalid (401):
```json
{
  "status": "error",
  "message": "401 Unauthorized",
  "guidance": "Your API key is invalid or expired. Generate a new one.",
  "helpUrl": "https://aistudio.google.com/app/apikey"
}
```
**Fix:** Generate new API key

#### If API not enabled (403):
```json
{
  "status": "error",
  "message": "403 Permission Denied",
  "guidance": "The Generative Language API is not enabled for your project.",
  "helpUrl": "https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com"
}
```
**Fix:** Enable the API

---

## 🔧 Setup Instructions

### Option A: Quick Setup (5 minutes) - RECOMMENDED

1. **Get API Key:**
   - Visit: https://aistudio.google.com/app/apikey
   - Click "Create API Key" 
   - Copy the key (starts with `AIzaSy`)

2. **Enable API:**
   - Visit: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
   - Click "ENABLE"

3. **Set Environment Variable:**
   - Supabase Dashboard → Edge Functions → Settings → Secrets
   - Add: `VERTEX_AI_API_KEY` = your_key_here

4. **Test:**
   - Visit: `YOUR_APP_URL#api-status`
   - Or use the diagnostic endpoint above

### Option B: Production Setup with Vertex AI (Advanced)

Only use this if you need:
- Production-grade SLA
- Higher quotas
- VPC integration
- Advanced monitoring

**Requirements:**
1. Google Cloud Project with billing enabled
2. Vertex AI API enabled
3. Service Account with these roles:
   - `roles/aiplatform.user`
   - `roles/ml.developer`

**Setup:**
```bash
# 1. Enable Vertex AI
gcloud services enable aiplatform.googleapis.com

# 2. Create Service Account
gcloud iam service-accounts create ai-travel-service \
    --display-name="AI Travel Service Account"

# 3. Grant Roles
PROJECT_ID="your-project-id"
SERVICE_ACCOUNT="ai-travel-service@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/ml.developer"

# 4. Generate Key
gcloud iam service-accounts keys create service-account-key.json \
    --iam-account=$SERVICE_ACCOUNT

# 5. Set in Supabase
# Copy the JSON content and set as GOOGLE_SERVICE_ACCOUNT_KEY
```

Then update the code to use Vertex AI endpoint instead of Generative Language API.

---

## 📋 IAM Roles Reference

### For Generative Language API (Current Setup):
**NO ROLES NEEDED** ✅

### For Vertex AI (If migrating):

| Role | Permission | Purpose | Required? |
|------|------------|---------|-----------|
| `roles/aiplatform.user` | Use Vertex AI APIs | Make API calls | ✅ Yes |
| `roles/ml.developer` | Access ML models | Use Gemini models | ✅ Yes |
| `roles/storage.objectViewer` | Read from Cloud Storage | If storing data | ⚠️ Optional |
| `roles/bigquery.dataEditor` | Write to BigQuery | If using analytics | ⚠️ Optional |

### How to Grant Roles:

**Via Console:**
1. https://console.cloud.google.com/iam-admin/iam
2. Find service account
3. Click "Edit" (pencil icon)
4. "Add Another Role"
5. Select role
6. Save

**Via CLI:**
```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:SERVICE_ACCOUNT_EMAIL" \
    --role="ROLE_NAME"
```

---

## 🔍 Troubleshooting

### Issue: "API key not valid"

**Diagnosis:**
```bash
# Test API key directly
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"role":"user","parts":[{"text":"hello"}]}]}'
```

**If it works:** Environment variable not set correctly in Supabase
**If it fails:** API key is invalid, generate new one

**Fix:**
1. Visit https://aistudio.google.com/app/apikey
2. Generate new API key
3. Update VERTEX_AI_API_KEY in Supabase
4. Test again

### Issue: "The caller does not have permission"

**Cause:** Generative Language API not enabled

**Fix:**
1. Visit https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. Ensure correct project is selected (top of page)
3. Click "ENABLE"
4. Wait 1-2 minutes
5. Test again

### Issue: "Project not authorized"

**Cause:** API key created for different project than API is enabled in

**Fix:**
1. Check which project your API key is for
2. Enable Generative Language API in that same project
3. Or create new API key in the project where API is enabled

### Issue: AI features not working in app

**Diagnosis:**
1. Open browser console (F12)
2. Look for these messages:
   - ✅ Good: `✓ Gemini AI configured with API key`
   - ❌ Bad: `○ Gemini AI disabled - using enhanced static suggestions`

**If disabled:**
1. Check VERTEX_AI_API_KEY is set in Supabase
2. Check for any errors in console
3. Test with diagnostic endpoints above

---

## 🎯 Quick Reference Commands

### Test API Key Directly:
```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Say hello"}]}]}'
```

### Check Configuration:
```bash
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### Test Connection:
```bash
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### Test Destination Search:
```bash
curl -X POST https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/suggest-destinations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"query":"beach","userInterests":[]}'
```

---

## 📊 APIs That Need to be Enabled

### Required for AI Features:
1. **Generative Language API**
   - https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
   - Status: ✅ Required for current implementation

### Optional (for additional features):
2. **Cloud Speech-to-Text API** (voice input)
   - https://console.cloud.google.com/apis/library/speech.googleapis.com

3. **Cloud Text-to-Speech API** (voice output)
   - https://console.cloud.google.com/apis/library/texttospeech.googleapis.com

4. **Places API** (POI data)
   - https://console.cloud.google.com/apis/library/places-backend.googleapis.com

5. **Maps JavaScript API** (maps display)
   - https://console.cloud.google.com/apis/library/maps-backend.googleapis.com

### For Vertex AI (if migrating):
6. **Vertex AI API**
   - https://console.cloud.google.com/apis/library/aiplatform.googleapis.com

---

## 🆘 Getting Help

### Use the Built-in Diagnostic Page:
```
YOUR_APP_URL#api-status
```

This page shows:
- Current configuration
- Environment variables status
- Test connection results
- Common issues and fixes
- Quick links to relevant pages

### Check Logs:
1. Supabase Dashboard → Edge Functions → Logs
2. Look for:
   - `✓ Gemini AI configured with API key`
   - `✗ Gemini AI API error: [details]`
   - Status codes: 401, 403, 404, 429

### Resources:
- **API Key:** https://aistudio.google.com/app/apikey
- **Enable API:** https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
- **Documentation:** https://ai.google.dev/gemini-api/docs
- **Supabase:** https://supabase.com/dashboard

---

## ✅ Summary

### For Your Current Setup:

**No IAM roles are needed!**

You only need:
1. ✅ API Key from Google AI Studio
2. ✅ Generative Language API enabled
3. ✅ VERTEX_AI_API_KEY environment variable set in Supabase

That's it! No service accounts, no OAuth, no complex IAM configurations.

### If Switching to Vertex AI:

Then you would need:
1. Service Account with `roles/aiplatform.user` and `roles/ml.developer`
2. Service Account JSON key set as environment variable
3. Update code to use Vertex AI endpoint

But this is **not required** for your current implementation.

---

## 🎉 Next Steps

1. **Check if API key is set:**
   - Visit `YOUR_APP_URL#api-status`
   - Or check diagnostic endpoint

2. **If not set:**
   - Get API key from https://aistudio.google.com/app/apikey
   - Enable API at https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
   - Set VERTEX_AI_API_KEY in Supabase

3. **Test:**
   - Use diagnostic page or test endpoint
   - Try searching in the app
   - Look for purple "AI Powered" badges

4. **Verify:**
   - Check browser console for success messages
   - Look for AI-enhanced suggestions
   - Confirm insider tips are showing

---

**Status: Your current implementation does NOT require any IAM roles. Just an API key!** ✅

For detailed setup instructions, see: `/SETUP_CHECKLIST.md`

For troubleshooting common issues, see: `/API_ACCESS_REQUIREMENTS.md`
