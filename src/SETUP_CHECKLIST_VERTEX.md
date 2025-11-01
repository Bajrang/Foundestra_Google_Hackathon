# ✅ Vertex AI Setup Checklist

**Use this checklist to track your setup progress**

---

## 📋 Pre-Setup Requirements

- [ ] Google Cloud account created
- [ ] Project `foundestra` exists in GCP
- [ ] gcloud CLI installed (`gcloud --version` works)
- [ ] Authenticated with gcloud (`gcloud auth login`)
- [ ] Access to Supabase dashboard
- [ ] Know your Supabase project URL: `iloickicgibzbrxjsize.supabase.co`

---

## 🔧 Step 1: Run Setup Script

- [ ] Navigate to project directory
- [ ] Make script executable: `chmod +x setup-vertex-oauth.sh`
- [ ] Run script: `./setup-vertex-oauth.sh`
- [ ] Script completes without errors
- [ ] Service account created: `google-hackathon-sa@foundestra.iam.gserviceaccount.com`
- [ ] All 3 IAM roles granted:
  - [ ] `roles/aiplatform.user`
  - [ ] `roles/ml.developer`
  - [ ] `roles/serviceusage.serviceUsageConsumer`
- [ ] Vertex AI API enabled
- [ ] Generative Language API enabled
- [ ] JSON key file generated: `google-hackathon-sa-key.json`
- [ ] JSON output displayed in terminal

---

## 📝 Step 2: Copy JSON Key

- [ ] JSON displayed in terminal
- [ ] Select ENTIRE JSON (from `{` to `}`)
- [ ] Copy to clipboard
- [ ] JSON starts with: `{"type":"service_account"`
- [ ] JSON ends with: `...}`
- [ ] No extra characters added
- [ ] No quotes around the JSON

---

## ⚙️ Step 3: Configure Supabase

- [ ] Open Supabase Dashboard
- [ ] Navigate to: Edge Functions → Settings → Secrets
- [ ] Add Variable 1:
  - [ ] Name: `GOOGLE_SERVICE_ACCOUNT_KEY`
  - [ ] Value: {pasted entire JSON}
  - [ ] Saved successfully
- [ ] Add Variable 2:
  - [ ] Name: `GOOGLE_CLOUD_PROJECT`
  - [ ] Value: `foundestra`
  - [ ] Saved successfully
- [ ] Add Variable 3:
  - [ ] Name: `SERVICE_ACCOUNT_NAME`
  - [ ] Value: `google-hackathon-sa`
  - [ ] Saved successfully
- [ ] Edge function auto-redeployed (or manual redeploy)

---

## 🧪 Step 4: Test Configuration

### Test 1: Check Configuration
- [ ] Run command:
  ```bash
  curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config \
      -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"
  ```
- [ ] Response received
- [ ] `GOOGLE_SERVICE_ACCOUNT_KEY`: "✓ Set"
- [ ] `GOOGLE_CLOUD_PROJECT`: "✓ Set"
- [ ] `SERVICE_ACCOUNT_NAME`: "✓ Set"
- [ ] `activeMethod`: "OAuth2 with Service Account (production)"
- [ ] Service account email displayed

### Test 2: Test AI Connection
- [ ] Run command:
  ```bash
  curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
      -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"
  ```
- [ ] Response: `"status": "success"`
- [ ] Response: `"authMethod": "service-account"`
- [ ] Service account email in response
- [ ] AI response text included
- [ ] No error messages

### Test 3: Test Destination Search
- [ ] Run command:
  ```bash
  curl -X POST https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/suggest-destinations \
      -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E" \
      -H "Content-Type: application/json" \
      -d '{"query":"goa","userInterests":["beach","nightlife"]}'
  ```
- [ ] Suggestions returned
- [ ] `"aiPowered": true`
- [ ] Suggestions have `"isAIEnhanced": true`
- [ ] Personalized descriptions present
- [ ] AI insights included

---

## 🌐 Step 5: Test in Application

### Open Application
- [ ] Application loads without errors
- [ ] No console errors (F12)
- [ ] Console shows: `✓ Vertex AI configured with Service Account (OAuth2)`

### Test Destination Search
- [ ] Open destination search
- [ ] Type: "Goa" (or any destination)
- [ ] Results appear
- [ ] Purple "AI Powered" badges visible
- [ ] Personalized descriptions shown
- [ ] AI-generated content present
- [ ] No "AI disabled" messages

### Test Itinerary Generation
- [ ] Fill in trip details
- [ ] Select destination
- [ ] Choose dates
- [ ] Set budget
- [ ] Submit form
- [ ] Itinerary generates
- [ ] AI-powered content appears
- [ ] No errors in generation

### Check API Status Page
- [ ] Navigate to: `https://your-app/#api-status`
- [ ] Page loads
- [ ] All checks show green ✅
- [ ] OAuth2 method displayed
- [ ] Service account info shown

---

## 🔍 Step 6: Verify GCP Setup

### Verify Service Account
- [ ] Run:
  ```bash
  gcloud iam service-accounts describe \
      google-hackathon-sa@foundestra.iam.gserviceaccount.com
  ```
- [ ] Account details displayed
- [ ] Display name: "Google Hackathon Service Account"
- [ ] No errors

### Verify IAM Roles
- [ ] Run:
  ```bash
  gcloud projects get-iam-policy foundestra \
      --flatten="bindings[].members" \
      --filter="bindings.members:serviceAccount:google-hackathon-sa@*" \
      --format="table(bindings.role)"
  ```
- [ ] Shows: `roles/aiplatform.user`
- [ ] Shows: `roles/ml.developer`
- [ ] Shows: `roles/serviceusage.serviceUsageConsumer`
- [ ] All 3 roles present

### Verify APIs Enabled
- [ ] Run:
  ```bash
  gcloud services list --enabled --project=foundestra | grep -E '(aiplatform|generativelanguage)'
  ```
- [ ] `aiplatform.googleapis.com` listed
- [ ] `generativelanguage.googleapis.com` listed

---

## 🔐 Step 7: Security Cleanup

- [ ] JSON key successfully copied to Supabase
- [ ] Local key file deleted: `rm google-hackathon-sa-key.json`
- [ ] Key file NOT in git: `git status` (should not show key file)
- [ ] .gitignore includes `*.json` and `*-key.json`
- [ ] No keys committed to version control
- [ ] No keys shared in chat/email
- [ ] Keys stored securely in Supabase only

---

## 📊 Step 8: Final Verification

### All Environment Variables Set
- [ ] `GOOGLE_SERVICE_ACCOUNT_KEY` ✓
- [ ] `GOOGLE_CLOUD_PROJECT` ✓
- [ ] `SERVICE_ACCOUNT_NAME` ✓

### All IAM Roles Granted
- [ ] `roles/aiplatform.user` ✓
- [ ] `roles/ml.developer` ✓
- [ ] `roles/serviceusage.serviceUsageConsumer` ✓

### All APIs Enabled
- [ ] Vertex AI API ✓
- [ ] Generative Language API ✓

### All Tests Passing
- [ ] Configuration endpoint ✓
- [ ] Connection test ✓
- [ ] Destination search ✓
- [ ] Application working ✓

---

## 🎯 Success Criteria

**Mark complete when ALL of these are true:**

✅ Script ran successfully  
✅ Service account created  
✅ All 3 IAM roles granted  
✅ JSON key generated  
✅ Environment variables set in Supabase  
✅ `/vertex-config` shows all "✓ Set"  
✅ `/test-vertexai` returns success  
✅ Destination search shows AI results  
✅ Purple badges appear in app  
✅ Console shows OAuth2 configured  
✅ No error messages anywhere  
✅ Local key file deleted  

---

## ❌ Troubleshooting Checklist

**If something fails, check:**

### Script Fails
- [ ] gcloud CLI installed? (`gcloud --version`)
- [ ] Logged in? (`gcloud auth login`)
- [ ] Correct project? (`gcloud config get-value project`)
- [ ] Script executable? (`chmod +x setup-vertex-oauth.sh`)

### Configuration Test Fails
- [ ] Environment variables set?
- [ ] Full JSON copied (including `{` and `}`)?
- [ ] No extra characters?
- [ ] Edge function redeployed?

### Connection Test Fails
- [ ] Wait 2 minutes after IAM changes?
- [ ] All 3 IAM roles granted?
- [ ] APIs enabled?
- [ ] JSON valid? (try parsing with `jq`)

### Application Not Working
- [ ] Hard refresh browser (Ctrl+Shift+R)?
- [ ] Check browser console for errors?
- [ ] Environment variables saved in Supabase?
- [ ] Edge function deployed?

---

## 📝 Notes & Issues

**Use this space to track issues or notes:**

```
Issue encountered:


Solution:


Date:
```

---

## 🆘 Need Help?

**If stuck, try these in order:**

1. Check `/SETUP_INSTRUCTIONS.md` - Complete setup guide
2. Check `/QUICK_TEST_COMMANDS.md` - Test commands
3. Check `/IAM_PERMISSIONS_GUIDE.md` - IAM issues
4. Check `/ENVIRONMENT_VARIABLES.md` - Env var issues
5. Run diagnostic: `curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config`

---

## ✅ Completion

**Setup completed on:** ________________

**Completed by:** ________________

**Total time:** ________ minutes

**Notes:**
```




```

---

**Status:** 
- [ ] Not Started
- [ ] In Progress
- [ ] Completed ✅
- [ ] Issues (see notes)

---

**Next Review:** ________________ (90 days for key rotation)

