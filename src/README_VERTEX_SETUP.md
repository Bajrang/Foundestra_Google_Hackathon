# 🚀 Vertex AI Setup - Quick Start Guide

## ⚡ 60-Second Setup

**Your AI-powered travel app uses Google Cloud Vertex AI with OAuth2 authentication.**

### Step 1: Run the Setup Script (2 min)
```bash
./setup-vertex-oauth.sh
```

### Step 2: Copy the JSON Output (1 min)
The script will display a JSON key. Copy it all (from `{` to `}`).

### Step 3: Set in Supabase (2 min)
Go to: **Supabase Dashboard → Edge Functions → Settings → Secrets**

Add these 3 variables:
```
GOOGLE_SERVICE_ACCOUNT_KEY = {paste JSON from step 2}
GOOGLE_CLOUD_PROJECT = foundestra
SERVICE_ACCOUNT_NAME = google-hackathon-sa
```

### Step 4: Test (1 min)
```bash
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai
```

**Expected:** `"status": "success"` ✅

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `/SETUP_INSTRUCTIONS.md` | **START HERE** - Complete setup guide |
| `/QUICK_TEST_COMMANDS.md` | Ready-to-use test commands |
| `/IAM_PERMISSIONS_GUIDE.md` | IAM roles explained |
| `/ENVIRONMENT_VARIABLES.md` | Environment vars guide |
| `/VERTEX_AI_SERVICE_ACCOUNT_SETUP.md` | Detailed setup reference |
| `/VERTEX_AI_MIGRATION_SUMMARY.md` | What changed & why |

---

## 🎯 What You Need

**Before Setup:**
- [ ] Google Cloud account
- [ ] Project `foundestra` in GCP
- [ ] gcloud CLI installed
- [ ] Supabase dashboard access

**After Setup:**
- [x] Service account: `google-hackathon-sa`
- [x] 3 IAM roles granted
- [x] JSON key generated
- [x] Vertex AI API enabled
- [x] Environment vars set

---

## 🔧 IAM Roles (Granted by Script)

The script automatically grants these 3 roles:

1. **`roles/aiplatform.user`** - Access Vertex AI APIs
2. **`roles/ml.developer`** - Access ML models (Gemini)
3. **`roles/serviceusage.serviceUsageConsumer`** - Use Google Cloud services

---

## 🧪 Quick Test

After setup, test with:

```bash
# Check config
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config

# Test connection
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai

# Test destination search
curl -X POST https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/suggest-destinations \
    -H "Content-Type: application/json" \
    -d '{"query":"goa","userInterests":["beach","nightlife"]}'
```

**More commands:** `/QUICK_TEST_COMMANDS.md`

---

## ✅ Success Indicators

**You'll know it's working when:**

✅ Config shows: `"activeMethod": "OAuth2 with Service Account (production)"`  
✅ Test shows: `"status": "success"`  
✅ App shows: Purple "AI Powered" badges  
✅ Console shows: `✓ Vertex AI configured with Service Account (OAuth2)`

---

## 🛠️ Troubleshooting

| Issue | Quick Fix |
|-------|-----------|
| Script fails | Install gcloud CLI: `brew install --cask google-cloud-sdk` |
| Permission denied | Run: `chmod +x setup-vertex-oauth.sh` |
| 403 Error | Re-run script, wait 2 min, retry |
| JSON parse error | Copy entire JSON including `{` and `}` |
| API not enabled | Run: `gcloud services enable aiplatform.googleapis.com` |

**Full guide:** `/SETUP_INSTRUCTIONS.md`

---

## 🔐 Security Checklist

After setup:
- [ ] Delete local key file: `rm google-hackathon-sa-key.json`
- [ ] Verify key not in git: `git status`
- [ ] Check .gitignore includes: `*.json`, `*-key.json`
- [ ] Never share keys publicly
- [ ] Rotate keys every 90 days

---

## 📋 What the Script Does

1. ✅ Sets active GCP project to `foundestra`
2. ✅ Enables Vertex AI API
3. ✅ Enables Generative Language API (fallback)
4. ✅ Creates service account: `google-hackathon-sa`
5. ✅ Grants 3 IAM roles
6. ✅ Generates JSON key
7. ✅ Displays setup instructions

**Total time:** ~2 minutes

---

## 🎯 Environment Variables

Set in **Supabase Dashboard → Edge Functions → Settings → Secrets**:

### Required:
```
GOOGLE_SERVICE_ACCOUNT_KEY = {full JSON from script}
```

### Recommended:
```
GOOGLE_CLOUD_PROJECT = foundestra
SERVICE_ACCOUNT_NAME = google-hackathon-sa
```

**Full details:** `/ENVIRONMENT_VARIABLES.md`

---

## 🔍 Verify Setup

### Check Service Account:
```bash
gcloud iam service-accounts describe \
    google-hackathon-sa@foundestra.iam.gserviceaccount.com
```

### Check IAM Roles:
```bash
gcloud projects get-iam-policy foundestra \
    --flatten="bindings[].members" \
    --filter="bindings.members:serviceAccount:google-hackathon-sa@*" \
    --format="table(bindings.role)"
```

### Check APIs:
```bash
gcloud services list --enabled --project=foundestra | grep aiplatform
```

---

## 📊 Architecture

**Authentication Flow:**
```
Application
  ↓
Generate JWT (signed with service account private key)
  ↓
Exchange JWT for OAuth2 access token
  ↓
Call Vertex AI API with Bearer token
  ↓
AI generates response
  ↓
Return to application
```

**Endpoint:**
```
https://us-central1-aiplatform.googleapis.com/v1/projects/foundestra/locations/us-central1/publishers/google/models/gemini-2.0-flash-exp:generateContent
```

---

## 💡 Pro Tips

1. **Use the automated script** - Don't set up manually
2. **Copy entire JSON** - Including `{` and `}`
3. **Wait 2 minutes** after IAM changes before testing
4. **Test incrementally** after each step
5. **Check diagnostics** if something fails: `/vertex-config`
6. **Delete key file** after copying to Supabase
7. **Save test commands** for future use

---

## 🆘 Need Help?

### Quick Diagnostics:
```bash
# One-liner status check
curl -s https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config | jq '.environmentVariables'
```

### Documentation:
- **Setup Guide:** `/SETUP_INSTRUCTIONS.md`
- **Test Commands:** `/QUICK_TEST_COMMANDS.md`
- **IAM Roles:** `/IAM_PERMISSIONS_GUIDE.md`
- **Env Vars:** `/ENVIRONMENT_VARIABLES.md`

### GCP Console:
- **Service Accounts:** https://console.cloud.google.com/iam-admin/serviceaccounts
- **IAM Permissions:** https://console.cloud.google.com/iam-admin/iam
- **Vertex AI:** https://console.cloud.google.com/vertex-ai
- **APIs:** https://console.cloud.google.com/apis/dashboard

---

## 🎉 Ready to Start?

### Run this now:
```bash
./setup-vertex-oauth.sh
```

The script will guide you through the entire process!

---

## 📝 Checklist

**Before starting:**
- [ ] Google Cloud account ready
- [ ] Project `foundestra` exists
- [ ] gcloud CLI installed
- [ ] Logged in: `gcloud auth login`

**During setup:**
- [ ] Script runs successfully
- [ ] JSON key displayed
- [ ] All IAM roles granted

**After setup:**
- [ ] Environment vars set in Supabase
- [ ] Test endpoints return success
- [ ] Application working
- [ ] Local key file deleted

---

## ✅ Expected Results

**After running script:**
```
✅ Setup complete!
✓ Service account created
✓ All IAM roles granted
✓ JSON key generated
✓ APIs enabled
```

**After setting environment variables:**
```json
{
  "environmentVariables": {
    "GOOGLE_SERVICE_ACCOUNT_KEY": "✓ Set",
    "GOOGLE_CLOUD_PROJECT": "✓ Set",
    "SERVICE_ACCOUNT_NAME": "✓ Set"
  }
}
```

**After testing:**
```json
{
  "status": "success",
  "message": "✅ AI is working correctly with Service Account (OAuth2)"
}
```

---

## 🚀 Next Steps

1. ✅ Run `./setup-vertex-oauth.sh`
2. ✅ Set environment variables in Supabase
3. ✅ Test with diagnostic endpoints
4. ✅ Verify in application
5. ✅ Deploy to production!

---

**Total Setup Time:** ~10 minutes  
**Difficulty:** Easy (automated)  
**Production Ready:** ✅ Yes

---

**Questions?** Check `/SETUP_INSTRUCTIONS.md` for complete guide.

**Status: Ready to Setup! 🚀**
