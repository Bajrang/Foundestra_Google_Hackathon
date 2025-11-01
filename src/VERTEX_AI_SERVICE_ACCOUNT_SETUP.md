# 🔐 Vertex AI with Service Account - Complete Setup Guide

## 📋 Overview

Your application now uses **Google Cloud Vertex AI** with **Service Account authentication** instead of simple API keys. This provides:

✅ Production-grade authentication
✅ Better security and access control
✅ Higher API quotas
✅ Enterprise features
✅ Full IAM role management

---

## 🚀 Quick Setup (10 minutes)

### Step 1: Enable Vertex AI API

1. **Go to Google Cloud Console:**
   ```
   https://console.cloud.google.com/apis/library/aiplatform.googleapis.com
   ```

2. **Select your project** (or create a new one)

3. **Click "ENABLE"**

4. **Wait for confirmation** (usually takes 10-30 seconds)

---

### Step 2: Create Service Account

1. **Go to IAM & Admin → Service Accounts:**
   ```
   https://console.cloud.google.com/iam-admin/serviceaccounts
   ```

2. **Click "CREATE SERVICE ACCOUNT"**

3. **Fill in details:**
   - Service account name: `ai-travel-planner`
   - Service account ID: `ai-travel-planner` (auto-generated)
   - Description: `Service account for AI Travel Planner application`

4. **Click "CREATE AND CONTINUE"**

---

### Step 3: Grant IAM Roles

**Required Roles:**

1. **Vertex AI User** (`roles/aiplatform.user`)
   - Purpose: Make API calls to Vertex AI
   - Required: ✅ Yes

2. **ML Developer** (`roles/ml.developer`)
   - Purpose: Access ML models including Gemini
   - Required: ✅ Yes

**How to Grant:**

1. In the "Grant this service account access to project" section
2. Click "Select a role"
3. Search for "Vertex AI User"
4. Click to add it
5. Click "ADD ANOTHER ROLE"
6. Search for "ML Developer"
7. Click to add it
8. Click "CONTINUE"
9. Click "DONE"

**Or use gcloud CLI:**

```bash
# Set variables
PROJECT_ID="your-project-id"
SERVICE_ACCOUNT="ai-travel-planner@${PROJECT_ID}.iam.gserviceaccount.com"

# Grant Vertex AI User role
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/aiplatform.user"

# Grant ML Developer role
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/ml.developer"
```

---

### Step 4: Generate JSON Key

1. **In the Service Accounts list, find your account**

2. **Click on the service account email**

3. **Go to "KEYS" tab**

4. **Click "ADD KEY" → "Create new key"**

5. **Select "JSON"**

6. **Click "CREATE"**

7. **Save the JSON file** - it will auto-download

⚠️ **IMPORTANT:** Keep this file secure! Anyone with this key can access your Google Cloud resources.

---

### Step 5: Set Environment Variable in Supabase

1. **Open the JSON file** and copy the ENTIRE content

2. **Go to Supabase Dashboard**

3. **Navigate to:** Edge Functions → Settings → Secrets

4. **Add new secret:**
   - Name: `GOOGLE_SERVICE_ACCOUNT_KEY`
   - Value: Paste the ENTIRE JSON content (including `{` and `}`)

Example JSON structure:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "ai-travel-planner@your-project.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

5. **Click "Save"**

---

### Step 6: Test the Setup

**Option A: Use Diagnostic Page**
```
YOUR_APP_URL#api-status
```

**Option B: Use API Endpoint**
```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Expected Success Response:**
```json
{
  "status": "success",
  "message": "✅ Vertex AI is working correctly!",
  "details": {
    "success": true,
    "authMethod": "service-account",
    "projectId": "your-project-id",
    "location": "us-central1",
    "response": "Hello from Vertex AI!",
    "timestamp": "2025-11-01T..."
  },
  "capabilities": [
    "✓ Dynamic destination search",
    "✓ AI-enhanced suggestions",
    ...
  ]
}
```

---

## 🔍 Verification Checklist

### ✅ Check 1: API Enabled
```bash
# Visit this URL and ensure API is enabled
https://console.cloud.google.com/apis/library/aiplatform.googleapis.com
```

### ✅ Check 2: Service Account Exists
```bash
# List service accounts
gcloud iam service-accounts list
```
Look for: `ai-travel-planner@YOUR_PROJECT.iam.gserviceaccount.com`

### ✅ Check 3: Roles Assigned
```bash
# Check IAM policy
gcloud projects get-iam-policy YOUR_PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:ai-travel-planner@*"
```
Should show both `roles/aiplatform.user` and `roles/ml.developer`

### ✅ Check 4: Environment Variable Set
```bash
# Test config endpoint
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f7922768/vertex-config
```
Should show: `"serviceAccountKey": "✓ Set"`

### ✅ Check 5: Test Connection
```bash
# Test Vertex AI
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f7922768/test-vertexai
```
Should show: `"status": "success"`

---

## 🛠️ How It Works

### Authentication Flow:

```
1. Application starts
   ↓
2. Read GOOGLE_SERVICE_ACCOUNT_KEY from environment
   ↓
3. Parse JSON to get private key and project details
   ↓
4. Create JWT (JSON Web Token) signed with private key
   ↓
5. Exchange JWT for OAuth2 access token
   ↓
6. Use access token in Authorization header
   ↓
7. Call Vertex AI API
   ↓
8. Cache token (valid for 1 hour)
   ↓
9. Refresh token when expired
```

### API Endpoint:

```
POST https://us-central1-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/us-central1/publishers/google/models/gemini-2.0-flash-exp:generateContent

Headers:
  Authorization: Bearer {ACCESS_TOKEN}
  Content-Type: application/json

Body:
  {
    "contents": [{
      "role": "user",
      "parts": [{"text": "Your prompt"}]
    }],
    "generationConfig": {...}
  }
```

---

## 🔧 Troubleshooting

### Error: "GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set"

**Cause:** Environment variable not configured

**Solution:**
1. Check if you set the variable in Supabase
2. Ensure variable name is exactly: `GOOGLE_SERVICE_ACCOUNT_KEY`
3. Verify JSON content is complete (starts with `{`, ends with `}`)
4. Redeploy edge function if you just added it

---

### Error: "Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY"

**Cause:** Invalid JSON format

**Solution:**
1. Open your JSON key file
2. Copy the ENTIRE content
3. Ensure no extra characters added
4. Paste into Supabase as-is
5. Don't modify or format the JSON

---

### Error: "401 Unauthorized" or "Token exchange failed"

**Cause:** Invalid service account key

**Solution:**
1. Regenerate the JSON key:
   - Go to Service Accounts
   - Click on your service account
   - Keys tab → Add Key → Create new key
   - Download JSON
2. Update GOOGLE_SERVICE_ACCOUNT_KEY with new JSON
3. Test again

---

### Error: "403 Permission Denied"

**Cause:** Service account missing required IAM roles

**Solution:**
1. Go to IAM & Admin → IAM
2. Find your service account
3. Click Edit (pencil icon)
4. Ensure these roles are assigned:
   - `roles/aiplatform.user`
   - `roles/ml.developer`
5. Save and wait 1-2 minutes
6. Test again

**Using gcloud:**
```bash
PROJECT_ID="your-project-id"
SA_EMAIL="ai-travel-planner@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/ml.developer"
```

---

### Error: "404 Not Found" or "Vertex AI API not enabled"

**Cause:** Vertex AI API not enabled for project

**Solution:**
1. Visit: https://console.cloud.google.com/apis/library/aiplatform.googleapis.com
2. Select your project
3. Click "ENABLE"
4. Wait 1-2 minutes
5. Test again

---

### Error: "Model not found" or "Invalid model"

**Cause:** Wrong model name or not available in region

**Solution:**
1. Check available models: https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini
2. Current model: `gemini-2.0-flash-exp`
3. Available in region: `us-central1`
4. If model not available, try: `gemini-pro` or `gemini-1.5-pro`

---

### AI Features Not Working in App

**Diagnosis Steps:**

1. **Open browser console (F12)**
   
   Look for:
   - ✅ Good: `✓ Vertex AI configured with Service Account`
   - ❌ Bad: `○ Vertex AI disabled - using enhanced static suggestions`

2. **Check configuration endpoint:**
   ```bash
   curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f7922768/vertex-config
   ```

3. **Test connection:**
   ```bash
   curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f7922768/test-vertexai
   ```

4. **Check Supabase logs:**
   - Go to Supabase Dashboard
   - Edge Functions → Logs
   - Look for error messages

---

## 📊 IAM Roles Explained

### roles/aiplatform.user

**What it does:**
- Allows calling Vertex AI APIs
- Includes permissions for predictions, online predictions, batch predictions

**Required permissions:**
- `aiplatform.endpoints.predict`
- `aiplatform.endpoints.explain`
- `aiplatform.models.predict`

**Why needed:**
Your app needs to call the Vertex AI prediction API to generate content.

---

### roles/ml.developer

**What it does:**
- Full access to ML models
- Includes model reading, predictions, and explanations

**Required permissions:**
- `ml.models.get`
- `ml.models.predict`
- `aiplatform.models.get`
- `aiplatform.models.predict`

**Why needed:**
Your app needs to access and use Gemini AI models for generation.

---

## 💰 Cost Considerations

### Token Pricing (Gemini 2.0 Flash):
- **Input:** ~$0.00001875 per 1K characters
- **Output:** ~$0.000075 per 1K characters

### Example Costs:
| Operation | Input Tokens | Output Tokens | Approximate Cost |
|-----------|--------------|---------------|------------------|
| Simple query | 100 | 200 | $0.000017 |
| Destination search | 500 | 1000 | $0.000084 |
| Itinerary generation | 2000 | 5000 | $0.000413 |

### Monthly Estimates:
- **1,000 queries:** ~$0.08-$0.50
- **10,000 queries:** ~$0.84-$4.13
- **100,000 queries:** ~$8.40-$41.30

### Free Tier:
- Vertex AI includes free tier
- Check current limits: https://cloud.google.com/vertex-ai/pricing

---

## 🔐 Security Best Practices

### ✅ DO:
- Keep service account JSON key secure
- Use environment variables for secrets
- Rotate keys periodically (every 90 days)
- Use least privilege (only required roles)
- Monitor usage in Cloud Console
- Set up billing alerts

### ❌ DON'T:
- Commit service account keys to git
- Share keys publicly
- Use same key for dev and production
- Grant unnecessary permissions
- Ignore security alerts

### Key Rotation:
```bash
# 1. Create new key
gcloud iam service-accounts keys create new-key.json \
    --iam-account=ai-travel-planner@PROJECT_ID.iam.gserviceaccount.com

# 2. Update in Supabase

# 3. Test

# 4. Delete old key
gcloud iam service-accounts keys delete OLD_KEY_ID \
    --iam-account=ai-travel-planner@PROJECT_ID.iam.gserviceaccount.com
```

---

## 📈 Monitoring

### Check Usage:
```
https://console.cloud.google.com/apis/dashboard
```

### View Logs:
```
https://console.cloud.google.com/logs
```

### Filter for Vertex AI:
```
resource.type="aiplatform.googleapis.com/Endpoint"
```

### Monitor Costs:
```
https://console.cloud.google.com/billing
```

---

## 🆘 Quick Reference Commands

### Test Configuration:
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

### Check Service Account:
```bash
gcloud iam service-accounts list
```

### Check IAM Policy:
```bash
gcloud projects get-iam-policy YOUR_PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:ai-travel-planner@*"
```

---

## 🎯 Success Indicators

### In Application:
- 🟣 Purple "AI Powered" badges on suggestions
- 💬 Personalized, conversational descriptions
- 💡 Unique insider tips
- ✨ "Powered by Vertex AI" banner

### In Console:
- ✅ `✓ Vertex AI configured with Service Account`
- ✅ `→ Calling Vertex AI API...`
- ✅ `✓ Vertex AI response received successfully`

### In Logs:
- ✅ `→ Generating OAuth2 access token...`
- ✅ `✓ OAuth2 access token generated successfully`
- ✅ `✓ AI enhanced X destinations successfully`

---

## 📚 Additional Resources

- **Vertex AI Documentation:** https://cloud.google.com/vertex-ai/docs
- **Gemini API Reference:** https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini
- **Service Accounts:** https://cloud.google.com/iam/docs/service-accounts-create
- **IAM Roles:** https://cloud.google.com/iam/docs/understanding-roles
- **Pricing:** https://cloud.google.com/vertex-ai/pricing
- **Quotas:** https://cloud.google.com/vertex-ai/docs/quotas

---

## ✅ Summary

**What You Need:**
1. ✅ Vertex AI API enabled
2. ✅ Service Account created
3. ✅ IAM roles granted (`roles/aiplatform.user` + `roles/ml.developer`)
4. ✅ JSON key generated
5. ✅ `GOOGLE_SERVICE_ACCOUNT_KEY` set in Supabase
6. ✅ Edge function redeployed

**What You Get:**
- 🚀 Production-grade AI authentication
- 🔐 Secure OAuth2 token management
- 📊 Better quotas and limits
- 💼 Enterprise features
- 🎯 Full IAM control

**Next Steps:**
1. Follow the 6-step setup above
2. Test with diagnostic endpoints
3. Verify AI features in application
4. Monitor usage and costs

---

**Status: Ready for Vertex AI with Service Account!** ✅

Your application now uses enterprise-grade authentication with Google Cloud Vertex AI!
