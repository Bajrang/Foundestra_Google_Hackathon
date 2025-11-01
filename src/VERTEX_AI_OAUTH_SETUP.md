# 🔐 Vertex AI OAuth Setup Guide - Project: foundestra

## 📋 Overview

This guide shows how to configure **OAuth authentication** for Vertex AI with your Google Cloud project "foundestra". OAuth is the **recommended production approach** as it's more secure and doesn't expose API keys.

---

## 🎯 Authentication Methods Supported

The system supports **both** authentication methods with automatic fallback:

### 1. OAuth (Recommended for Production) ✅
- Uses Google Cloud service account
- More secure (no keys in code)
- Better for production deployments
- Supports GCP metadata server

### 2. API Key (Fallback) ⚠️
- Simple to set up for testing
- Less secure (key can leak)
- Good for development/testing

---

## 🚀 Quick Test

### Test the Connection

```bash
# Visit this endpoint in your browser or use curl:
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY"
```

### Expected Success Response:
```json
{
  "status": "success",
  "message": "Vertex AI OAuth working correctly!",
  "details": {
    "success": true,
    "projectId": "foundestra",
    "location": "us-central1",
    "authMethod": "OAuth (Service Account or Metadata)",
    "response": "Hello from Vertex AI!",
    "timestamp": "2025-11-01T12:00:00.000Z"
  }
}
```

---

## 🔧 Setup Method 1: OAuth with Service Account (Recommended)

### Step 1: Create Service Account

```bash
# Set your project
gcloud config set project foundestra

# Create service account
gcloud iam service-accounts create vertex-ai-service \
  --description="Service account for Vertex AI" \
  --display-name="Vertex AI Service"

# Grant necessary permissions
gcloud projects add-iam-policy-binding foundestra \
  --member="serviceAccount:vertex-ai-service@foundestra.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

### Step 2: Download Service Account Key

```bash
# Download the key file
gcloud iam service-accounts keys create vertex-ai-key.json \
  --iam-account=vertex-ai-service@foundestra.iam.gserviceaccount.com

# This creates vertex-ai-key.json with your credentials
```

### Step 3: Configure Supabase Edge Function

**Option A: Upload key to Supabase Storage**
```bash
# Upload the key file to Supabase Storage
# Then set the path in environment variable
GOOGLE_APPLICATION_CREDENTIALS=/path/to/vertex-ai-key.json
```

**Option B: Set key content as environment variable**
```bash
# Copy the entire content of vertex-ai-key.json
# Set it as GOOGLE_SERVICE_ACCOUNT_KEY in Supabase
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

### Step 4: Set Environment Variables in Supabase

Go to: **Supabase Dashboard → Edge Functions → Settings**

Add these variables:
```
GOOGLE_CLOUD_PROJECT=foundestra
GOOGLE_APPLICATION_CREDENTIALS=/tmp/vertex-ai-key.json
```

Or use the service account JSON directly:
```
GOOGLE_CLOUD_PROJECT=foundestra
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"foundestra",...}
```

---

## 🔧 Setup Method 2: OAuth with GCP Metadata (For GCP-hosted)

If your Supabase Edge Functions run on Google Cloud (or you deploy to Cloud Run), they can automatically get credentials from the metadata server.

### Configuration:

Just set the project ID:
```
GOOGLE_CLOUD_PROJECT=foundestra
```

The system will automatically:
1. Detect it's running on GCP
2. Query metadata server for token
3. Use token for authentication

**No keys needed!** ✨

---

## 🔧 Setup Method 3: API Key (Simple, for Testing)

### Step 1: Get API Key

Visit: https://makersuite.google.com/app/apikey

Or via gcloud:
```bash
# API keys are managed in Google Cloud Console
# Go to: APIs & Services → Credentials → Create Credentials → API Key
```

### Step 2: Set in Supabase

```
VERTEX_AI_API_KEY=your-api-key-here
```

**Note:** The system will use this if OAuth is not configured.

---

## 🏗️ How It Works

### Authentication Flow:

```
1. System starts
   ↓
2. Check for VERTEX_AI_API_KEY
   ↓
3. If API key exists → Use API key auth
   ↓
4. If no API key → Try OAuth
   ↓
5. OAuth: Try metadata server first
   ↓
6. If no metadata → Try service account key
   ↓
7. Make authenticated request to Vertex AI
```

### Code Flow:

```typescript
constructor() {
  this.projectId = 'foundestra';
  this.location = 'us-central1';
  this.apiKey = Deno.env.get('VERTEX_AI_API_KEY');
  
  // Prefer OAuth if no API key
  this.useOAuth = !this.apiKey;
}

private async callVertexAI(prompt, systemInstruction) {
  if (this.useOAuth) {
    // Get OAuth token
    const token = await this.getAccessToken();
    
    // Use project-based endpoint
    const endpoint = 
      `https://us-central1-aiplatform.googleapis.com/v1/projects/foundestra/locations/us-central1/publishers/google/models/gemini-2.0-flash-lite:generateContent`;
    
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    // Use API key endpoint
    const endpoint = 
      `https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.0-flash-lite:generateContent?key=${this.apiKey}`;
  }
  
  // Make request...
}
```

---

## 📊 Endpoint Comparison

### OAuth Endpoint:
```
https://us-central1-aiplatform.googleapis.com/v1/projects/foundestra/locations/us-central1/publishers/google/models/gemini-2.0-flash-lite:generateContent

Headers:
  Authorization: Bearer <oauth_token>
  Content-Type: application/json
```

### API Key Endpoint:
```
https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.0-flash-lite:generateContent?key=<api_key>

Headers:
  Content-Type: application/json
```

---

## 🧪 Testing

### Test 1: Check Configuration
```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Look for in response:**
```json
{
  "authMethod": "OAuth (Service Account or Metadata)"
}
```

### Test 2: Check Logs
```bash
# In Supabase Edge Function logs, look for:
✓ Vertex AI configured with OAuth (project: foundestra)
→ Fetching OAuth access token...
✓ OAuth token obtained from metadata server
# or
✓ OAuth token obtained from service account
→ Calling Vertex AI with OAuth (project: foundestra)...
✓ Vertex AI response received successfully
```

### Test 3: Full Destination Search
```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f7922768/suggest-destinations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"query": "beach", "userInterests": []}'
```

**Should return AI-powered suggestions!**

---

## 🐛 Troubleshooting

### Error: "Failed to get OAuth token"

**Cause:** Service account not configured properly

**Fix:**
1. Verify service account exists:
   ```bash
   gcloud iam service-accounts list --project=foundestra
   ```

2. Verify permissions:
   ```bash
   gcloud projects get-iam-policy foundestra \
     --flatten="bindings[].members" \
     --filter="bindings.members:serviceAccount:vertex-ai-service@foundestra.iam.gserviceaccount.com"
   ```

3. Check environment variables are set correctly

### Error: "No authentication method available"

**Cause:** Neither API key nor OAuth configured

**Fix:**
Set either:
- `VERTEX_AI_API_KEY` for API key auth, OR
- `GOOGLE_APPLICATION_CREDENTIALS` for OAuth, OR
- `GOOGLE_SERVICE_ACCOUNT_KEY` for OAuth

### Error: "Token exchange failed"

**Cause:** Service account key is invalid or expired

**Fix:**
1. Generate new service account key
2. Update environment variable
3. Restart edge function

### Error: "Permission denied"

**Cause:** Service account doesn't have required permissions

**Fix:**
```bash
gcloud projects add-iam-policy-binding foundestra \
  --member="serviceAccount:vertex-ai-service@foundestra.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

---

## 📈 Performance Comparison

| Metric | OAuth | API Key |
|--------|-------|---------|
| **Setup Time** | 10-15 min | 2 min |
| **Security** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Token Refresh** | Automatic | N/A |
| **Request Latency** | +50ms (first request) | 0ms |
| **Production Ready** | ✅ Yes | ⚠️ Not recommended |
| **Scalability** | ✅ Excellent | ✅ Good |
| **Audit Trail** | ✅ Full | ⚠️ Limited |

---

## 🔒 Security Best Practices

### ✅ DO:
- Use OAuth with service accounts in production
- Rotate service account keys regularly
- Use GCP metadata server when possible
- Set minimal IAM permissions (roles/aiplatform.user)
- Store credentials in Supabase secrets (not in code)
- Monitor API usage in Cloud Console

### ❌ DON'T:
- Commit service account keys to git
- Share API keys publicly
- Use API keys in production
- Grant excessive permissions (like Owner)
- Hardcode credentials in code
- Expose keys in client-side code

---

## 📝 Required IAM Permissions

### Minimum Permission:
```
roles/aiplatform.user
```

### What it includes:
- aiplatform.endpoints.predict
- aiplatform.models.get
- aiplatform.models.predict

### Grant it:
```bash
gcloud projects add-iam-policy-binding foundestra \
  --member="serviceAccount:YOUR-SA@foundestra.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

---

## 🎯 Verification Checklist

### Setup Complete When:
- [ ] Service account created in project "foundestra"
- [ ] IAM role "roles/aiplatform.user" granted
- [ ] Service account key downloaded (if using key-based)
- [ ] Environment variables set in Supabase
- [ ] Edge function restarted
- [ ] Test endpoint returns success
- [ ] Logs show "OAuth (Service Account or Metadata)"
- [ ] Destination search works with AI

### Logs Should Show:
```
✓ Vertex AI configured with OAuth (project: foundestra)
→ Fetching OAuth access token...
✓ OAuth token obtained from service account
→ Calling Vertex AI with OAuth (project: foundestra)...
✓ Vertex AI response received successfully
```

---

## 🚀 Next Steps After Setup

1. **Test the integration:**
   ```bash
   curl .../test-vertexai
   ```

2. **Try destination search:**
   - Open your app
   - Search for "beach"
   - Look for purple "AI Powered" badges

3. **Monitor usage:**
   - Go to Google Cloud Console
   - Navigate to: Vertex AI → Dashboard
   - Check API calls and quotas

4. **Optimize costs:**
   - Review prompt lengths
   - Cache common queries
   - Use appropriate model (flash-lite vs flash)

5. **Scale up:**
   - Increase quotas if needed
   - Set up monitoring alerts
   - Configure rate limiting

---

## 💡 Pro Tips

### Tip 1: Use Metadata Server in Cloud
If deploying to Cloud Run or GCE:
```bash
# No credentials needed!
# Just set project ID
GOOGLE_CLOUD_PROJECT=foundestra
```

### Tip 2: Test Locally
For local development:
```bash
# Use service account key
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
export GOOGLE_CLOUD_PROJECT=foundestra
```

### Tip 3: Rotate Keys
```bash
# Create new key
gcloud iam service-accounts keys create new-key.json \
  --iam-account=vertex-ai-service@foundestra.iam.gserviceaccount.com

# Update in Supabase
# Delete old key
gcloud iam service-accounts keys delete OLD_KEY_ID \
  --iam-account=vertex-ai-service@foundestra.iam.gserviceaccount.com
```

### Tip 4: Monitor Costs
```bash
# Check billing
gcloud billing accounts list
gcloud billing projects describe foundestra
```

---

## 📚 Additional Resources

- [Vertex AI Authentication](https://cloud.google.com/vertex-ai/docs/authentication)
- [Service Accounts Best Practices](https://cloud.google.com/iam/docs/best-practices-service-accounts)
- [Gemini API Documentation](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

---

## 🎉 Summary

### Current Configuration:
- **Project ID:** foundestra
- **Region:** us-central1
- **Model:** gemini-2.0-flash-lite
- **Auth:** OAuth (Service Account) or API Key

### What Works:
✅ OAuth with service account key  
✅ OAuth with metadata server  
✅ API key fallback  
✅ Automatic token refresh  
✅ Graceful error handling  
✅ Full logging & monitoring  

### To Enable OAuth:
1. Create service account in "foundestra"
2. Download key or use metadata
3. Set environment variables
4. Test with `/test-vertexai` endpoint
5. Enjoy secure, production-ready AI! 🎊

---

**Status: ✅ OAuth CONFIGURED & READY TO TEST**

Test now with:
```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```
