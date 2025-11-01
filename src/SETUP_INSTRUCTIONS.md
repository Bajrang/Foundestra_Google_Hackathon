# 🚀 Complete Setup Instructions - Vertex AI with Service Account

## 📋 Quick Start

**Goal:** Enable AI features using Google Cloud Vertex AI with OAuth2 service account authentication

**Time Required:** ~10 minutes  
**Difficulty:** Easy (automated script provided)

---

## ✅ Prerequisites

- [ ] Google Cloud account
- [ ] Project `foundestra` created in Google Cloud
- [ ] gcloud CLI installed (https://cloud.google.com/sdk/docs/install)
- [ ] Access to Supabase dashboard

---

## 🎯 Step-by-Step Setup

### Step 1: Run Automated Setup Script

The script will create everything you need automatically.

```bash
# Make the script executable (if needed)
chmod +x setup-vertex-oauth.sh

# Run the script
./setup-vertex-oauth.sh
```

**What the script does:**
1. ✅ Sets active project to `foundestra`
2. ✅ Enables Vertex AI API (`aiplatform.googleapis.com`)
3. ✅ Enables Generative Language API (fallback)
4. ✅ Creates service account: `google-hackathon-sa`
5. ✅ Grants IAM roles:
   - `roles/aiplatform.user`
   - `roles/ml.developer`
   - `roles/serviceusage.serviceUsageConsumer`
6. ✅ Generates JSON key: `google-hackathon-sa-key.json`
7. ✅ Displays JSON for copying to Supabase

---

### Step 2: Copy JSON Key

After the script completes, you'll see output like:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 COPY THIS ENTIRE JSON TO SUPABASE ENVIRONMENT VARIABLE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "type": "service_account",
  "project_id": "foundestra",
  ...
}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**COPY THE ENTIRE JSON** (from `{` to `}`) including all the content.

---

### Step 3: Set Environment Variables in Supabase

1. **Open Supabase Dashboard:**
   ```
   https://app.supabase.com/project/iloickicgibzbrxjsize
   ```

2. **Navigate to Edge Functions Settings:**
   - Left sidebar → **Edge Functions**
   - Click on your function or go to **Settings** tab
   - Find **Secrets** or **Environment Variables** section

3. **Add the following variables:**

#### Variable 1: GOOGLE_SERVICE_ACCOUNT_KEY (Required)
```
Variable Name: GOOGLE_SERVICE_ACCOUNT_KEY
Value: {paste the entire JSON from Step 2}
```

#### Variable 2: GOOGLE_CLOUD_PROJECT (Recommended)
```
Variable Name: GOOGLE_CLOUD_PROJECT
Value: foundestra
```

#### Variable 3: SERVICE_ACCOUNT_NAME (Optional)
```
Variable Name: SERVICE_ACCOUNT_NAME
Value: google-hackathon-sa
```

4. **Click "Save" or "Add Secret"** for each variable

**Important:** Ensure the JSON is pasted exactly as shown - no extra quotes, no formatting changes.

---

### Step 4: Verify Setup

#### Option A: Use Diagnostic Page (Easiest)

Visit your app and add `#api-status` to the URL:
```
https://your-app-url.com#api-status
```

Look for:
- ✅ Green checkmarks for all environment variables
- ✅ "OAuth2 with Service Account (production)" as active method
- ✅ Service account email displayed

---

#### Option B: Use API Endpoints

**Check Configuration:**
```bash
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"
```

**Expected Response:**
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

**Test Connection:**
```bash
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "✅ AI is working correctly with Service Account (OAuth2) - Production Ready ✅",
  "details": {
    "success": true,
    "authMethod": "service-account",
    "projectId": "foundestra",
    "serviceAccount": "google-hackathon-sa@foundestra.iam.gserviceaccount.com"
  }
}
```

---

### Step 5: Test in Application

1. **Open your application**

2. **Try destination search:**
   - Type a destination (e.g., "Goa", "Kerala", "Jaipur")
   - Look for purple "AI Powered" badges
   - Check for personalized descriptions

3. **Check browser console (F12):**
   - Should see: `✓ Vertex AI configured with Service Account (OAuth2)`
   - Should see: `✓ Response received successfully`

4. **Create an itinerary:**
   - Fill in trip details
   - Submit
   - AI should generate personalized itinerary

---

## 🔍 Verification Checklist

Use this checklist to ensure everything is working:

### Environment Setup
- [ ] Script `./setup-vertex-oauth.sh` completed successfully
- [ ] Service account `google-hackathon-sa` created
- [ ] All 3 IAM roles granted
- [ ] JSON key generated
- [ ] Key file saved locally (temporarily)

### Supabase Configuration
- [ ] `GOOGLE_SERVICE_ACCOUNT_KEY` set with full JSON
- [ ] `GOOGLE_CLOUD_PROJECT` set to `foundestra`
- [ ] `SERVICE_ACCOUNT_NAME` set to `google-hackathon-sa`
- [ ] All secrets saved in Supabase
- [ ] Edge function redeployed (automatic on secret change)

### API Testing
- [ ] `/vertex-config` shows all variables as "✓ Set"
- [ ] `/vertex-config` shows "OAuth2 with Service Account (production)"
- [ ] `/test-vertexai` returns `"status": "success"`
- [ ] `/test-vertexai` shows service account email

### Application Testing
- [ ] App loads without errors
- [ ] Destination search shows AI-powered results
- [ ] Purple "AI Powered" badges visible
- [ ] Personalized descriptions appear
- [ ] Itinerary generation works
- [ ] No "AI disabled" messages in console

### Security
- [ ] JSON key file deleted from local machine
- [ ] Key file path added to `.gitignore`
- [ ] Keys never committed to git
- [ ] Access restricted to authorized users only

---

## 🛠️ Troubleshooting

### Issue: Script fails with "gcloud CLI not found"

**Solution:**
```bash
# Install gcloud CLI
# macOS
brew install --cask google-cloud-sdk

# Linux
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Windows
# Download from: https://cloud.google.com/sdk/docs/install
```

---

### Issue: "Permission denied" when running script

**Solution:**
```bash
# Make script executable
chmod +x setup-vertex-oauth.sh

# Run again
./setup-vertex-oauth.sh
```

---

### Issue: "Project not found" error

**Solution:**
```bash
# Check current project
gcloud config get-value project

# Set to foundestra
gcloud config set project foundestra

# Run script again
./setup-vertex-oauth.sh
```

---

### Issue: "Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY"

**Cause:** JSON not copied correctly

**Solution:**
1. Re-run script to see JSON output:
   ```bash
   cat google-hackathon-sa-key.json
   ```
2. Copy the ENTIRE output (including `{` and `}`)
3. In Supabase, delete the old variable
4. Create new variable with correct JSON
5. Ensure no extra characters added

---

### Issue: "403 Permission Denied" in test

**Cause:** IAM roles not granted or not propagated

**Solution:**
```bash
# Re-run setup script (it will grant missing roles)
./setup-vertex-oauth.sh

# Wait 2 minutes for IAM changes to propagate

# Test again
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai
```

---

### Issue: "Vertex AI API not enabled"

**Solution:**
```bash
# Enable API manually
gcloud services enable aiplatform.googleapis.com --project=foundestra

# Wait 1 minute

# Test again
```

---

### Issue: AI features not working in app

**Diagnosis:**
1. Open browser console (F12)
2. Look for error messages
3. Check which auth method is active

**Solution:**
```bash
# Check configuration
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config

# Verify all variables show "✓ Set"
# If not, add missing variables in Supabase
```

---

## 📊 IAM Roles Reference

The script grants these 3 roles to `google-hackathon-sa`:

### 1. roles/aiplatform.user
**Purpose:** Access Vertex AI APIs  
**Why:** Required to make API calls to Gemini models

### 2. roles/ml.developer
**Purpose:** Access ML models  
**Why:** Required to use generative AI models

### 3. roles/serviceusage.serviceUsageConsumer
**Purpose:** Use Google Cloud services  
**Why:** Required for service consumption and quota checks

**Full details:** See `/IAM_PERMISSIONS_GUIDE.md`

---

## 🔐 Security Best Practices

### ✅ DO:

1. **Delete local key file after setup:**
   ```bash
   rm google-hackathon-sa-key.json
   ```

2. **Rotate keys regularly:**
   - Every 90 days
   - Run script again to generate new key
   - Update in Supabase

3. **Use separate accounts for dev/prod:**
   - Create different service accounts
   - Different keys for each environment

4. **Monitor usage:**
   ```bash
   gcloud logging read \
       "protoPayload.authenticationInfo.principalEmail=google-hackathon-sa@foundestra.iam.gserviceaccount.com" \
       --limit 50
   ```

### ❌ DON'T:

1. ❌ Commit key files to git
2. ❌ Share keys in chat/email
3. ❌ Use same key in multiple environments
4. ❌ Grant unnecessary IAM permissions

---

## 📚 Additional Resources

- **Environment Variables Guide:** `/ENVIRONMENT_VARIABLES.md`
- **IAM Permissions Guide:** `/IAM_PERMISSIONS_GUIDE.md`
- **Full Service Account Setup:** `/VERTEX_AI_SERVICE_ACCOUNT_SETUP.md`
- **Setup Script:** `./setup-vertex-oauth.sh`

---

## 🆘 Getting Help

### Check Configuration
```bash
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config
```

### Test Connection
```bash
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai
```

### Check IAM Roles
```bash
gcloud projects get-iam-policy foundestra \
    --flatten="bindings[].members" \
    --filter="bindings.members:serviceAccount:google-hackathon-sa@*" \
    --format="table(bindings.role)"
```

### View Logs
```bash
# Supabase Dashboard → Edge Functions → Logs
# Or check Google Cloud logs:
gcloud logging read "resource.type=cloud_function" --limit 50
```

---

## 🎯 Success Criteria

You know setup is successful when:

✅ `/vertex-config` shows all variables as "✓ Set"  
✅ `/test-vertexai` returns `"status": "success"`  
✅ Browser console shows `✓ Vertex AI configured with Service Account (OAuth2)`  
✅ Destination search shows purple "AI Powered" badges  
✅ Personalized, AI-generated content appears  
✅ Itinerary generation works end-to-end  

---

## 📝 Summary

**What you need:**
1. Run `./setup-vertex-oauth.sh`
2. Copy generated JSON
3. Set 3 environment variables in Supabase
4. Test with diagnostic endpoints
5. Verify in application

**Total time:** ~10 minutes  
**Automation level:** High (script does most work)  
**Difficulty:** Easy

---

**Ready to start? Run:**
```bash
./setup-vertex-oauth.sh
```

---

**Status: Setup Instructions Complete ✅**

Your AI-powered travel planning app is ready to go! 🚀
