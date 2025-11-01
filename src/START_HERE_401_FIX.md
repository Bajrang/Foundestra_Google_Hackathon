# 🚨 START HERE: Fix "Invalid JWT" 401 Error

## The Problem

You ran:
```bash
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

And got:
```json
{"code":401,"message":"Invalid JWT"}
```

---

## ✅ The Solution (Use These Commands Instead)

### Option 1: Run Test Script (Easiest)

```bash
# Make script executable
chmod +x TEST_COMMANDS_READY.sh

# Run all tests
./TEST_COMMANDS_READY.sh
```

This will test everything automatically with the correct credentials.

---

### Option 2: Manual Commands

Copy and paste these **EXACT** commands (they have the correct anon key):

#### 1. Check Configuration
```bash
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"
```

#### 2. Test AI Connection
```bash
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"
```

---

## 📊 What You Should See

### ✅ If Environment Variables Are Set:

```json
{
  "status": "success",
  "message": "✅ AI is working correctly with Service Account (OAuth2)",
  "details": {
    "authMethod": "service-account",
    "projectId": "foundestra",
    "serviceAccount": "google-hackathon-sa@foundestra.iam.gserviceaccount.com"
  }
}
```

✅ **Success!** Your Vertex AI is configured correctly.

---

### ⚠️ If Environment Variables NOT Set:

```json
{
  "status": "error",
  "message": "No AI credentials configured",
  "instructions": {
    "option_a_recommended": {
      "title": "Service Account (OAuth2) - Production",
      "steps": [...]
    }
  }
}
```

⚠️ **You need to set up environment variables.** Follow Step 3 below.

---

## 🔧 Step 3: Set Up Environment Variables (If Needed)

If the test shows environment variables are not set:

### 1. Run Setup Script

```bash
./setup-vertex-oauth.sh
```

This will:
- Create service account: `google-hackathon-sa`
- Grant all required IAM roles
- Generate JSON key
- Display the key for copying

### 2. Copy the JSON Output

You'll see something like:
```json
{
  "type": "service_account",
  "project_id": "foundestra",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "google-hackathon-sa@foundestra.iam.gserviceaccount.com",
  ...
}
```

**Copy the ENTIRE JSON** (from `{` to `}`).

### 3. Set in Supabase

1. Go to: https://app.supabase.com/project/iloickicgibzbrxjsize
2. Navigate to: **Edge Functions → Settings → Secrets**
3. Add these 3 variables:

**Variable 1:**
```
Name: GOOGLE_SERVICE_ACCOUNT_KEY
Value: {paste the entire JSON from step 2}
```

**Variable 2:**
```
Name: GOOGLE_CLOUD_PROJECT
Value: foundestra
```

**Variable 3:**
```
Name: SERVICE_ACCOUNT_NAME
Value: google-hackathon-sa
```

4. **Save** and wait 30 seconds for edge function to redeploy

### 4. Test Again

```bash
./TEST_COMMANDS_READY.sh
```

Or run the manual test command from Option 2 above.

---

## 🎯 What's Different?

### ❌ WRONG (What You Were Using):
```bash
-H "Authorization: Bearer YOUR_ANON_KEY"
```

### ✅ CORRECT (What You Should Use):
```bash
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"
```

**Key Point:** `YOUR_ANON_KEY` was just a placeholder in the documentation. You need to use the actual Supabase anon key shown above.

---

## 📚 Additional Resources

- **Complete fix guide:** `/QUICK_FIX_401_ERROR.md`
- **Test commands:** `/TEST_COMMANDS_READY.sh`
- **Setup instructions:** `/SETUP_INSTRUCTIONS.md`
- **All test commands:** `/QUICK_TEST_COMMANDS.md`

---

## ✅ Quick Checklist

- [ ] Used correct anon key (from this file, not `YOUR_ANON_KEY`)
- [ ] No 401 errors
- [ ] Test returns `"status": "success"` OR shows setup instructions
- [ ] If setup needed, ran `./setup-vertex-oauth.sh`
- [ ] Set 3 environment variables in Supabase
- [ ] Waited 30 seconds
- [ ] Re-tested successfully

---

## 🆘 Still Having Issues?

1. **Check if environment variables are set:**
   ```bash
   curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"
   ```
   Look for `"✓ Set"` or `"✗ Not set"`

2. **Check Supabase logs:**
   - https://app.supabase.com/project/iloickicgibzbrxjsize
   - Edge Functions → Logs

3. **Verify JSON key:**
   - Must start with `{` and end with `}`
   - Must include entire JSON (no truncation)
   - No extra quotes around it

---

## 🎉 Success!

When working, you'll see:
- ✅ `"status": "success"`
- ✅ `"authMethod": "service-account"`
- ✅ Service account email displayed
- ✅ No error messages

Then your AI-powered travel planning app is ready to use! 🚀

---

**TL;DR:** Use the commands from "Option 2" above - they have the correct anon key! ✅
