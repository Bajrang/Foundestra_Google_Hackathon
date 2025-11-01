# ✅ Correct Test Command

## 🚨 Issue: "Invalid JWT" Error

You're getting this error because you're using the placeholder `YOUR_ANON_KEY` instead of the actual Supabase anon key.

---

## ✅ Correct Test Commands

### Test Vertex AI Configuration

```bash
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"
```

### Test Vertex AI Connection

```bash
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"
```

---

## 🔍 What Was Wrong

**Wrong (causes 401 error):**
```bash
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Correct:**
```bash
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"
```

---

## 📊 Expected Responses

### If Environment Variables Are Set Correctly:

```json
{
  "status": "success",
  "message": "✅ AI is working correctly with Service Account (OAuth2) - Production Ready ✅",
  "details": {
    "success": true,
    "authMethod": "service-account",
    "projectId": "foundestra",
    "serviceAccount": "google-hackathon-sa@foundestra.iam.gserviceaccount.com",
    "location": "us-central1",
    "endpoint": "Vertex AI",
    "response": "Hello from AI! (5 words response...)"
  }
}
```

### If Using API Key Fallback:

```json
{
  "status": "success",
  "message": "✅ AI is working correctly with API Key - Development Mode ⚠️",
  "details": {
    "success": true,
    "authMethod": "api-key",
    "endpoint": "Generative Language API"
  }
}
```

### If Not Configured:

```json
{
  "status": "error",
  "message": "No AI credentials configured",
  "instructions": {
    "option_a_recommended": {
      "title": "Service Account (OAuth2) - Production",
      "steps": [...]
    },
    "option_b_quick": {
      "title": "API Key - Development/Testing",
      "steps": [...]
    }
  }
}
```

---

## 🧪 Complete Test Suite

### 1. Check Configuration

```bash
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"
```

**Look for:**
- `"GOOGLE_SERVICE_ACCOUNT_KEY": "✓ Set"`
- `"activeMethod": "OAuth2 with Service Account (production)"`

---

### 2. Test AI Connection

```bash
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"
```

**Look for:**
- `"status": "success"`
- `"authMethod": "service-account"`

---

### 3. Test Destination Search

```bash
curl -X POST https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/suggest-destinations \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E" \
  -H "Content-Type: application/json" \
  -d '{"query":"goa","userInterests":["beach","nightlife"]}'
```

**Look for:**
- `"aiPowered": true`
- AI-enhanced suggestions

---

## 💡 Pro Tip: Save as Alias

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
# Vertex AI Test Commands
export SUPABASE_URL="https://iloickicgibzbrxjsize.supabase.co"
export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"

alias vertex-config='curl -s $SUPABASE_URL/functions/v1/make-server-f7922768/vertex-config -H "Authorization: Bearer $SUPABASE_ANON_KEY" | jq .'
alias vertex-test='curl -s $SUPABASE_URL/functions/v1/make-server-f7922768/test-vertexai -H "Authorization: Bearer $SUPABASE_ANON_KEY" | jq .'
```

Then simply run:
```bash
vertex-config
vertex-test
```

---

## 🔍 Debugging

If you still get errors after using the correct key:

### Check Environment Variables in Supabase

1. Go to: https://app.supabase.com/project/iloickicgibzbrxjsize
2. Navigate to: **Edge Functions → Settings → Secrets**
3. Verify these are set:
   - `GOOGLE_SERVICE_ACCOUNT_KEY` (full JSON)
   - `GOOGLE_CLOUD_PROJECT` (value: `foundestra`)
   - `SERVICE_ACCOUNT_NAME` (value: `google-hackathon-sa`)

### Check Edge Function Logs

```bash
# In Supabase Dashboard
Edge Functions → [your function] → Logs
```

Look for:
- `✓ Vertex AI configured with Service Account (OAuth2)`
- Or any error messages

### Test with Verbose Output

```bash
curl -v https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"
```

---

## ✅ Summary

**The Problem:**
- Using `YOUR_ANON_KEY` (placeholder text)
- Should use actual Supabase anon key

**The Solution:**
- Use the correct anon key from `/utils/supabase/info.tsx`
- Full key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E`

**Try the correct command now!** ✅
