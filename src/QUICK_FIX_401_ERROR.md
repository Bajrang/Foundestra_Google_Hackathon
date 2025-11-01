# 🚨 QUICK FIX: "Invalid JWT" 401 Error

## The Problem

You're getting:
```json
{"code":401,"message":"Invalid JWT"}
```

**Cause:** Using placeholder text `YOUR_ANON_KEY` instead of the actual Supabase anon key.

---

## ✅ THE FIX (Copy & Paste These)

### 1. Test Configuration

```bash
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"
```

### 2. Test Vertex AI Connection

```bash
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"
```

### 3. Test Destination Search

```bash
curl -X POST https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/suggest-destinations \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E" \
  -H "Content-Type: application/json" \
  -d '{"query":"goa","userInterests":["beach","nightlife"]}'
```

---

## 📊 What You'll See

### ✅ Success (Environment Variables Set):

```json
{
  "status": "success",
  "message": "✅ AI is working correctly with Service Account (OAuth2) - Production Ready ✅",
  "details": {
    "authMethod": "service-account",
    "projectId": "foundestra",
    "serviceAccount": "google-hackathon-sa@foundestra.iam.gserviceaccount.com"
  }
}
```

### ⚠️ Not Configured Yet:

```json
{
  "status": "error",
  "message": "No AI credentials configured",
  "instructions": {
    "option_a_recommended": {
      "title": "Service Account (OAuth2) - Production",
      "steps": ["Run: ./setup-vertex-oauth.sh", ...]
    }
  }
}
```

---

## 🔍 If Still Not Working

### Step 1: Verify Environment Variables

Run the config check command above. Look for:

```json
{
  "environmentVariables": {
    "GOOGLE_SERVICE_ACCOUNT_KEY": "✓ Set",  // Should be ✓
    "GOOGLE_CLOUD_PROJECT": "✓ Set",         // Should be ✓
    "SERVICE_ACCOUNT_NAME": "✓ Set"          // Should be ✓
  }
}
```

### Step 2: If Shows "✗ Not set"

You need to set environment variables in Supabase:

1. **Run the setup script:**
   ```bash
   ./setup-vertex-oauth.sh
   ```

2. **Copy the JSON output** (the entire JSON from `{` to `}`)

3. **Go to Supabase Dashboard:**
   - https://app.supabase.com/project/iloickicgibzbrxjsize
   - Edge Functions → Settings → Secrets

4. **Add these 3 variables:**
   
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

5. **Wait 30 seconds** for edge function to redeploy

6. **Test again** with the commands at the top of this file

---

## 🎯 Your Actual Supabase Details

**Project URL:** `https://iloickicgibzbrxjsize.supabase.co`  
**Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E`

All the commands above use these correct values.

---

## ⚡ Create Command Aliases (Optional but Recommended)

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
# Vertex AI Quick Test Commands
alias vertex-config='curl -s https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E" | jq .'

alias vertex-test='curl -s https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E" | jq .'
```

Then reload: `source ~/.bashrc` (or `source ~/.zshrc`)

Now just run:
```bash
vertex-config   # Check configuration
vertex-test     # Test AI connection
```

---

## 📋 Quick Checklist

- [ ] Used correct anon key (not `YOUR_ANON_KEY`)
- [ ] Environment variables set in Supabase
- [ ] Edge function redeployed (wait 30 seconds)
- [ ] Test command returns success
- [ ] No 401 errors

---

## 🆘 Still Having Issues?

### Check Supabase Edge Function Logs:

1. Go to: https://app.supabase.com/project/iloickicgibzbrxjsize
2. Navigate to: Edge Functions → Logs
3. Look for error messages

### Common Issues:

| Error | Cause | Fix |
|-------|-------|-----|
| 401 Invalid JWT | Wrong anon key | Use commands from top of this file |
| No credentials configured | Env vars not set | Run `./setup-vertex-oauth.sh` and set in Supabase |
| Failed to parse JSON | JSON incomplete | Copy entire JSON including `{` and `}` |
| 403 Permission Denied | IAM roles missing | Re-run setup script, wait 2 min |

---

## ✅ Success Checklist

You'll know it's working when:

✅ Config command shows all variables as "✓ Set"  
✅ Test command returns `"status": "success"`  
✅ Auth method shows "service-account"  
✅ No error messages  
✅ Service account email displayed  

---

**Use the commands at the top of this file - they have the correct anon key!** ✅
