# 🔐 API Access Requirements & Role Configuration

## 📋 Current Setup Status

Based on your environment, you have the following secrets configured:
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `SUPABASE_DB_URL`
- ✅ `OPENWEATHER_API_KEY`
- ✅ `VERTEX_API_KEY`
- ✅ `GOOGLE_CLOUD_PROJECT`
- ✅ `VERTEX_AI_API_KEY`
- ✅ `GOOGLE_SERVICE_ACCOUNT_KEY`

---

## 🎯 Understanding Google AI API Options

You have **THREE different ways** to access Google's AI services:

### Option 1: Google AI Studio API (Recommended for Development) ✅

**Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent`

**Authentication:** Simple API Key (no OAuth needed)

**Current Implementation:** This is what your code uses (line 30 in vertex-ai.tsx)

**How to Get API Key:**
1. Visit https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Select or create a Google Cloud project
4. Copy the API key
5. Set as `VERTEX_AI_API_KEY` environment variable

**Requirements:**
- ✅ No Google Cloud project setup needed
- ✅ No OAuth configuration
- ✅ No IAM roles
- ✅ Free tier available
- ⚠️ Production apps should use Vertex AI

**Enable the API:**
Go to https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com

---

### Option 2: Vertex AI (Recommended for Production) 🏢

**Endpoint:** `https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.0-flash-exp:generateContent`

**Authentication:** OAuth2 with Service Account

**Requirements:**
1. **Google Cloud Project** with billing enabled
2. **Vertex AI API** enabled
3. **Service Account** with proper roles
4. **IAM Roles needed:**
   - `roles/aiplatform.user` - To use Vertex AI
   - `roles/ml.developer` - For ML model access

**Setup Steps:**

#### Step 1: Enable Vertex AI API
```bash
# In Google Cloud Console or via gcloud CLI
gcloud services enable aiplatform.googleapis.com
```

Or visit: https://console.cloud.google.com/apis/library/aiplatform.googleapis.com

#### Step 2: Create Service Account
```bash
# Create service account
gcloud iam service-accounts create ai-travel-planner \
    --display-name="AI Travel Planner Service Account"

# Grant roles
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:ai-travel-planner@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:ai-travel-planner@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/ml.developer"
```

#### Step 3: Generate Service Account Key
```bash
gcloud iam service-accounts keys create service-account-key.json \
    --iam-account=ai-travel-planner@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

#### Step 4: Set Environment Variable
Copy the entire JSON content and set as `GOOGLE_SERVICE_ACCOUNT_KEY`

---

### Option 3: Generative Language API (Alternative) 🔧

**Endpoint:** `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent`

**Authentication:** API Key

**Same as Option 1** but older endpoint format

---

## 🔍 Diagnosing Your Current Issue

### Check 1: Verify Which API is Enabled

Run this diagnostic endpoint:
```bash
curl https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/make-server-f7922768/vertex-config \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Expected Output:**
```json
{
  "status": "ok",
  "configuration": {
    "projectId": "your-project-id",
    "authentication": {
      "apiKey": "✓ Set" or "✗ Not set",
      "serviceAccountKey": "✓ Set" or "✗ Not set",
      "credentialsPath": "✗ Not set"
    },
    "recommendation": "..."
  }
}
```

### Check 2: Test the Connection

```bash
curl https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Success Response:**
```json
{
  "status": "success",
  "message": "Vertex AI working correctly!",
  "details": {
    "success": true,
    "authMethod": "API Key",
    "response": "Hello from Gemini!",
    "timestamp": "2025-11-01T..."
  }
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Detailed error message",
  "details": "Check logs..."
}
```

### Check 3: Verify API Key is Valid

Test the API key directly:
```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "role": "user",
      "parts": [{"text": "Say hello"}]
    }]
  }'
```

**Success Response:**
```json
{
  "candidates": [{
    "content": {
      "parts": [{"text": "Hello! How can I help you?"}]
    }
  }]
}
```

**Error Responses:**

#### 401 Unauthorized
```json
{
  "error": {
    "code": 401,
    "message": "API key not valid. Please pass a valid API key.",
    "status": "UNAUTHENTICATED"
  }
}
```
**Fix:** Generate new API key at https://aistudio.google.com/app/apikey

#### 403 Forbidden
```json
{
  "error": {
    "code": 403,
    "message": "The caller does not have permission",
    "status": "PERMISSION_DENIED"
  }
}
```
**Fix:** Enable the Generative Language API in your Google Cloud project

#### 404 Not Found
```json
{
  "error": {
    "code": 404,
    "message": "models/gemini-2.0-flash-exp is not found",
    "status": "NOT_FOUND"
  }
}
```
**Fix:** Use correct model name (gemini-2.0-flash-exp, gemini-pro, etc.)

---

## 🛠️ Required Google Cloud APIs

You need to enable these APIs in your Google Cloud Console:

### For Generative Language API (Option 1):
1. **Generative Language API**
   - Visit: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
   - Click "Enable"

### For Vertex AI (Option 2):
1. **Vertex AI API**
   - Visit: https://console.cloud.google.com/apis/library/aiplatform.googleapis.com
   - Click "Enable"

2. **Cloud Resource Manager API** (if using project-level permissions)
   - Visit: https://console.cloud.google.com/apis/library/cloudresourcemanager.googleapis.com
   - Click "Enable"

### For Additional Features (Optional):

3. **Cloud Speech-to-Text API** (for voice input)
   - Visit: https://console.cloud.google.com/apis/library/speech.googleapis.com
   - Click "Enable"

4. **Cloud Text-to-Speech API** (for voice output)
   - Visit: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
   - Click "Enable"

5. **Places API** (for POI data)
   - Visit: https://console.cloud.google.com/apis/library/places-backend.googleapis.com
   - Click "Enable"

6. **Maps JavaScript API** (for maps display)
   - Visit: https://console.cloud.google.com/apis/library/maps-backend.googleapis.com
   - Click "Enable"

---

## 🎯 IAM Roles Summary

### For Service Account (Vertex AI Option):

| Role | Purpose | Required? |
|------|---------|-----------|
| `roles/aiplatform.user` | Use Vertex AI APIs | ✅ Yes |
| `roles/ml.developer` | Access ML models | ✅ Yes |
| `roles/storage.objectViewer` | Read from Cloud Storage | ⚠️ If using storage |
| `roles/bigquery.dataEditor` | Write analytics data | ⚠️ If using BigQuery |
| `roles/speech.client` | Use Speech APIs | ⚠️ If using voice |

### Grant Roles via Console:
1. Go to https://console.cloud.google.com/iam-admin/iam
2. Find your service account
3. Click "Edit" (pencil icon)
4. Click "Add Another Role"
5. Select role from dropdown
6. Click "Save"

### Grant Roles via CLI:
```bash
# Replace YOUR_PROJECT_ID and SERVICE_ACCOUNT_EMAIL

# Vertex AI access
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:SERVICE_ACCOUNT_EMAIL" \
    --role="roles/aiplatform.user"

# ML model access
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:SERVICE_ACCOUNT_EMAIL" \
    --role="roles/ml.developer"

# Speech API (optional)
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:SERVICE_ACCOUNT_EMAIL" \
    --role="roles/speech.client"
```

---

## 🚦 Quick Troubleshooting Guide

### Error: "API key not valid"
**Cause:** Invalid or expired API key
**Solution:**
1. Generate new API key at https://aistudio.google.com/app/apikey
2. Update `VERTEX_AI_API_KEY` in Supabase environment
3. Redeploy edge function

### Error: "The caller does not have permission"
**Cause:** Generative Language API not enabled
**Solution:**
1. Visit https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. Click "Enable"
3. Wait 1-2 minutes for propagation
4. Test again

### Error: "Project not found"
**Cause:** `GOOGLE_CLOUD_PROJECT` not set or incorrect
**Solution:**
1. Find your project ID in Google Cloud Console
2. Set `GOOGLE_CLOUD_PROJECT` environment variable
3. Redeploy

### Error: "Service account does not have required roles"
**Cause:** Missing IAM permissions
**Solution:**
1. Follow steps in "Grant Roles via Console" above
2. Ensure both `roles/aiplatform.user` and `roles/ml.developer` are assigned
3. Wait 1-2 minutes for permissions to propagate

### Error: "Model not found"
**Cause:** Using wrong model name or endpoint
**Solution:**
Check available models at: https://ai.google.dev/gemini-api/docs/models/gemini

---

## ✅ Recommended Setup (Simplest)

For your development/testing environment, I recommend **Option 1** (Google AI Studio):

### Step-by-Step:

1. **Get API Key:**
   ```
   Visit: https://aistudio.google.com/app/apikey
   Click: "Create API Key"
   Copy the key
   ```

2. **Enable the API:**
   ```
   Visit: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
   Click: "Enable"
   Select your project (or create new one)
   ```

3. **Set Environment Variable:**
   ```
   In Supabase Dashboard:
   → Edge Functions
   → Settings
   → Secrets
   → Add: VERTEX_AI_API_KEY = your_api_key_here
   ```

4. **Test:**
   ```bash
   # Test the endpoint
   curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
     -H "Authorization: Bearer YOUR_ANON_KEY"
   ```

5. **Verify in Application:**
   - Open the app
   - Type a destination search
   - Look for purple "AI Powered" badges
   - Check browser console for: `✓ Gemini AI response received successfully`

---

## 📊 Current Code Configuration

Your application currently uses:

```typescript
// File: /supabase/functions/server/vertex-ai.tsx
// Line 30
const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`;
```

This endpoint requires:
- ✅ `VERTEX_AI_API_KEY` environment variable
- ✅ Generative Language API enabled
- ❌ No OAuth needed
- ❌ No service account needed
- ❌ No IAM roles needed

---

## 🔄 Migration Path

If you want to switch to Vertex AI (production):

### Current (Generative Language API):
```typescript
const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`;
```

### Switch to Vertex AI:
```typescript
// 1. Change endpoint
const endpoint = `https://aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/gemini-2.0-flash-exp:generateContent`;

// 2. Get OAuth token
const token = await getAccessToken(); // From service account

// 3. Update headers
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## 🎯 What to Do Next

1. **Run the diagnostic endpoint** to see current configuration
2. **Test the API key** using the curl command above
3. **Check if Generative Language API is enabled** in Google Cloud Console
4. **Verify VERTEX_AI_API_KEY** is set correctly in Supabase
5. **Review error logs** in Supabase Edge Functions logs

---

## 📞 Support Resources

- **Google AI Studio:** https://aistudio.google.com
- **API Documentation:** https://ai.google.dev/gemini-api/docs
- **Google Cloud Console:** https://console.cloud.google.com
- **Enable APIs:** https://console.cloud.google.com/apis/library
- **IAM Roles:** https://console.cloud.google.com/iam-admin/iam

---

**Status:** All required APIs and roles are documented above. Follow the "Recommended Setup" section for the simplest configuration! 🎉
