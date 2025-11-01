# ⚡ Quick Test Commands

## 🎯 Ready-to-Use Test Commands

All commands are configured with your actual Supabase credentials.  
Just copy and paste to test!

---

## 1️⃣ Check Configuration

**What it does:** Shows all environment variables and current configuration

```bash
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"
```

**Look for:**
```json
{
  "environmentVariables": {
    "GOOGLE_CLOUD_PROJECT": "✓ Set",
    "SERVICE_ACCOUNT_NAME": "✓ Set", 
    "GOOGLE_SERVICE_ACCOUNT_KEY": "✓ Set"
  },
  "configuration": {
    "authentication": {
      "activeMethod": "OAuth2 with Service Account (production)"
    }
  }
}
```

---

## 2️⃣ Test AI Connection

**What it does:** Tests OAuth2 authentication and Vertex AI API call

```bash
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"
```

**Success Response:**
```json
{
  "status": "success",
  "message": "✅ AI is working correctly with Service Account (OAuth2) - Production Ready ✅",
  "details": {
    "success": true,
    "authMethod": "service-account",
    "projectId": "foundestra",
    "location": "us-central1",
    "serviceAccount": "google-hackathon-sa@foundestra.iam.gserviceaccount.com"
  }
}
```

---

## 3️⃣ Test Destination Search (AI-Powered)

**What it does:** Tests AI-enhanced destination suggestions

```bash
curl -X POST https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/suggest-destinations \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E" \
    -H "Content-Type: application/json" \
    -d '{"query":"beach","userInterests":["relaxation","water sports"]}'
```

**Look for:**
- `"aiPowered": true`
- `"isAIEnhanced": true` on suggestions
- Personalized descriptions
- AI-generated insights

---

## 4️⃣ Test with Different Queries

### Heritage Sites
```bash
curl -X POST https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/suggest-destinations \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E" \
    -H "Content-Type: application/json" \
    -d '{"query":"heritage","userInterests":["culture","photography"]}'
```

### Mountains
```bash
curl -X POST https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/suggest-destinations \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E" \
    -H "Content-Type: application/json" \
    -d '{"query":"mountains","userInterests":["adventure","trekking"]}'
```

### Specific Destination
```bash
curl -X POST https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/suggest-destinations \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E" \
    -H "Content-Type: application/json" \
    -d '{"query":"Goa","userInterests":["nightlife","beaches"]}'
```

---

## 🔍 Verification Commands

### Check Service Account (GCP)

```bash
# Verify service account exists
gcloud iam service-accounts describe \
    google-hackathon-sa@foundestra.iam.gserviceaccount.com \
    --project=foundestra
```

### Check IAM Roles

```bash
# List all roles for service account
gcloud projects get-iam-policy foundestra \
    --flatten="bindings[].members" \
    --filter="bindings.members:serviceAccount:google-hackathon-sa@foundestra.iam.gserviceaccount.com" \
    --format="table(bindings.role)"
```

**Expected Output:**
```
ROLE
roles/aiplatform.user
roles/ml.developer
roles/serviceusage.serviceUsageConsumer
```

### Check Enabled APIs

```bash
# Verify Vertex AI API is enabled
gcloud services list --enabled --project=foundestra | grep -E '(aiplatform|generativelanguage)'
```

**Expected Output:**
```
aiplatform.googleapis.com        Vertex AI API
generativelanguage.googleapis.com Generative Language API
```

---

## 📊 Formatted Test (with jq)

If you have `jq` installed, use these for pretty output:

### Configuration Check
```bash
curl -s https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E" \
    | jq .
```

### Connection Test
```bash
curl -s https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E" \
    | jq .
```

### Destination Search
```bash
curl -s -X POST https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/suggest-destinations \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E" \
    -H "Content-Type: application/json" \
    -d '{"query":"kerala","userInterests":["nature","backwaters"]}' \
    | jq .
```

---

## 🎨 Browser Tests

### Open API Status Page
```
https://your-app-url.com#api-status
```

### Test in Browser Console

Open browser console (F12) and run:

```javascript
// Test configuration
fetch('https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E'
  }
})
.then(r => r.json())
.then(data => console.log(data));

// Test AI connection
fetch('https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E'
  }
})
.then(r => r.json())
.then(data => console.log(data));
```

---

## 🐛 Debugging Commands

### View Recent Logs (GCP)

```bash
# View service account activity
gcloud logging read \
    "protoPayload.authenticationInfo.principalEmail=google-hackathon-sa@foundestra.iam.gserviceaccount.com" \
    --limit 20 \
    --format json \
    --project foundestra
```

### Check Vertex AI API Logs

```bash
# View Vertex AI API calls
gcloud logging read \
    "resource.type=aiplatform.googleapis.com/Endpoint" \
    --limit 20 \
    --format json \
    --project foundestra
```

### Test OAuth Token Generation

```bash
# This tests if the service account can generate tokens
gcloud auth print-access-token \
    --impersonate-service-account=google-hackathon-sa@foundestra.iam.gserviceaccount.com
```

---

## 📝 Quick Status Check

Run this one-liner to check everything:

```bash
echo "=== Configuration ===" && \
curl -s https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E" \
    | jq -r '.environmentVariables' && \
echo -e "\n=== Connection Test ===" && \
curl -s https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E" \
    | jq -r '.status, .message'
```

---

## ✅ Expected Success Indicators

When everything is working, you should see:

**Configuration endpoint:**
- ✅ All environment variables show "✓ Set"
- ✅ Active method: "OAuth2 with Service Account (production)"
- ✅ Service account email displayed

**Test endpoint:**
- ✅ `"status": "success"`
- ✅ `"authMethod": "service-account"`
- ✅ Response text from AI

**Destination search:**
- ✅ `"aiPowered": true`
- ✅ Suggestions have `"isAIEnhanced": true`
- ✅ Personalized descriptions
- ✅ AI-generated insights

**Application:**
- ✅ Purple "AI Powered" badges
- ✅ Personalized destination content
- ✅ Console log: `✓ Vertex AI configured with Service Account (OAuth2)`

---

## 🆘 Error Responses

### "No AI credentials configured"
**Fix:** Run `./setup-vertex-oauth.sh` and set environment variables in Supabase

### "Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY"
**Fix:** Ensure you copied the entire JSON, including `{` and `}`

### "403 Permission Denied"
**Fix:** Run `./setup-vertex-oauth.sh` to grant IAM roles, wait 2 minutes, retry

### "401 Unauthorized"
**Fix:** Regenerate JSON key with `./setup-vertex-oauth.sh`

### "404 Not Found" or "API not enabled"
**Fix:** Run `gcloud services enable aiplatform.googleapis.com --project=foundestra`

---

## 💡 Pro Tips

1. **Save these commands** in a local file for quick access
2. **Use aliases** for frequently used commands:
   ```bash
   alias vertex-config='curl -s https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E" | jq .'
   alias vertex-test='curl -s https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E" | jq .'
   ```
3. **Monitor in real-time** by tailing Supabase logs
4. **Test incrementally** after each configuration change

---

**Happy Testing! 🚀**
