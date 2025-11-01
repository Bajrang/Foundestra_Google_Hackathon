# Quick Fix: Enable Vertex AI in 2 Minutes ⚡

## The Problem
You're seeing these errors:
```
✗ No OAuth authentication method available
✗ AI place search error
```

## The Solution (Choose One)

### Option A: Use API Key (Easiest - 2 minutes) ✅

1. **Get your Vertex AI API Key**:
   - Go to Google Cloud Console
   - Navigate to APIs & Services → Credentials
   - Create an API key (or use existing one)
   - Enable Vertex AI API for the key

2. **Add it to Supabase**:
   - Go to: https://supabase.com/dashboard/project/iloickicgibzbrxjsize/settings/functions
   - Click "Add new secret"
   - Name: `VERTEX_AI_API_KEY`
   - Value: Paste your API key
   - Click "Create"

3. **Redeploy** (automatic in most cases, or click "Deploy" if needed)

4. **Done!** ✨

### Option B: You Already Have OAuth Setup

Based on the user secrets list, you have:
- ✅ `GOOGLE_CLOUD_PROJECT` = set
- ✅ `VERTEX_API_KEY` = set (might be named differently)

**Check if your key is named correctly**:
- The system looks for `VERTEX_AI_API_KEY` (with underscore)
- You might have `VERTEX_API_KEY` (without underscore)

**To fix**:
1. Go to Supabase Edge Functions → Environment Variables
2. Check if you have `VERTEX_API_KEY`
3. If yes, rename it to `VERTEX_AI_API_KEY`
4. OR add a new variable `VERTEX_AI_API_KEY` with the same value

## Test It Works

### 1. Check Configuration
Open this URL in your browser:
```
https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/vertex-config
```

You should see:
```json
{
  "authentication": {
    "apiKey": "✓ Set"
  }
}
```

### 2. Test AI Connection
```
https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai
```

Should return:
```json
{
  "status": "success",
  "message": "Vertex AI working correctly!"
}
```

### 3. Try the Search
Go to your app and search for a destination. You should see:
- Purple "Vertex AI" badges
- AI-generated descriptions
- Insider tips
- No errors in console

## What if I Don't Want AI?

**No problem!** The app works perfectly without it:
- Still has 40+ destinations
- Smart search and matching
- Interest-based filtering
- Pre-written tips and insights

Just ignore the errors - the app will use enhanced static suggestions automatically.

## Still Having Issues?

Check the browser console and look for:
```
✓ Vertex AI configured with API key
```

If you see:
```
○ Vertex AI disabled - using enhanced static suggestions
```

Then the API key isn't set correctly. Double-check:
1. Variable name is exactly: `VERTEX_AI_API_KEY`
2. API key is valid
3. Vertex AI API is enabled in Google Cloud Console

---

**TL;DR**: Set environment variable `VERTEX_AI_API_KEY` in Supabase and you're done! 🚀
