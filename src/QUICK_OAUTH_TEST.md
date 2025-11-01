# ⚡ Quick OAuth Test Guide

## 🎯 Project: foundestra

---

## 🚀 Fastest Way to Test

### Option 1: Using API Key (Quick Test - 2 minutes)

1. **Get API Key:**
   - Visit: https://makersuite.google.com/app/apikey
   - Click "Create API Key"
   - Copy the key

2. **Set in Supabase:**
   ```
   VERTEX_AI_API_KEY=your-api-key-here
   ```

3. **Test:**
   ```bash
   curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
     -H "Authorization: Bearer YOUR_ANON_KEY"
   ```

4. **Expected Response:**
   ```json
   {
     "status": "success",
     "message": "Vertex AI OAuth working correctly!",
     "details": {
       "authMethod": "API Key",
       "response": "Hello from Vertex AI!"
     }
   }
   ```

---

### Option 2: Using OAuth (Production - 10 minutes)

#### Quick Commands:

```bash
# 1. Set project
gcloud config set project foundestra

# 2. Create service account
gcloud iam service-accounts create vertex-ai-service \
  --display-name="Vertex AI Service"

# 3. Grant permissions
gcloud projects add-iam-policy-binding foundestra \
  --member="serviceAccount:vertex-ai-service@foundestra.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# 4. Create key
gcloud iam service-accounts keys create vertex-ai-key.json \
  --iam-account=vertex-ai-service@foundestra.iam.gserviceaccount.com

# 5. Copy the JSON
cat vertex-ai-key.json
```

#### Set in Supabase:

**Variable 1:**
```
GOOGLE_CLOUD_PROJECT=foundestra
```

**Variable 2:**
```
GOOGLE_SERVICE_ACCOUNT_KEY=<paste entire JSON from step 5>
```

#### Test:
```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

#### Expected Response:
```json
{
  "status": "success",
  "message": "Vertex AI OAuth working correctly!",
  "details": {
    "authMethod": "OAuth (Service Account or Metadata)",
    "projectId": "foundestra",
    "response": "Hello from Vertex AI!"
  }
}
```

---

## 🔍 Check Logs

### Supabase Dashboard → Edge Functions → Logs

**For API Key:**
```
✓ Vertex AI configured with API key
→ Calling Vertex AI with API key...
✓ Vertex AI response received successfully
```

**For OAuth:**
```
✓ Vertex AI configured with OAuth (project: foundestra)
→ Fetching OAuth access token...
→ Using service account key from environment...
✓ OAuth token obtained from service account (env)
→ Calling Vertex AI with OAuth (project: foundestra)...
✓ Vertex AI response received successfully
```

---

## ✅ Success Indicators

### It's Working When:

1. **Test endpoint returns:**
   ```json
   { "status": "success" }
   ```

2. **Logs show:**
   ```
   ✓ symbols (no ✗ errors)
   ```

3. **Destination search works:**
   - Open app
   - Search for "beach"
   - See purple "AI Powered" badges
   - Get personalized suggestions

---

## 🐛 Quick Troubleshooting

### "No authentication method available"
**Fix:** Set either `VERTEX_AI_API_KEY` OR `GOOGLE_SERVICE_ACCOUNT_KEY`

### "Permission denied"
**Fix:** Run the IAM binding command again

### "Invalid JSON"
**Fix:** Make sure you copied the ENTIRE JSON from the key file

### "Project not found"
**Fix:** Verify project ID is exactly "foundestra"

---

## 🎯 Current Setup

```
Project ID: foundestra
Region: us-central1
Model: gemini-2.0-flash-lite
Endpoint: /make-server-f7922768/test-vertexai
```

---

## 📞 Test Right Now

Replace placeholders and run:

```bash
# Get your Supabase project URL and anon key from:
# Supabase Dashboard → Settings → API

curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### Success Response:
```json
{
  "status": "success",
  "message": "Vertex AI OAuth working correctly!",
  "details": {
    "success": true,
    "projectId": "foundestra",
    "authMethod": "OAuth (Service Account or Metadata)",
    "response": "Hello from Vertex AI!",
    "timestamp": "2025-11-01T..."
  }
}
```

### Error Response:
```json
{
  "status": "error",
  "message": "No OAuth authentication method available",
  "details": "Check logs for more information"
}
```

---

## ⚡ One-Liner Setup Script

```bash
# Run this to set up everything:
bash setup-vertex-oauth.sh
```

Then copy the JSON output to Supabase environment variables!

---

**🎉 That's it! Test now and see AI in action!**
