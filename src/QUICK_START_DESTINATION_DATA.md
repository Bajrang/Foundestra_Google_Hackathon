# ⚡ Quick Start: Live Destination Data & RAG

## 🎯 What You Got

Your search input now **automatically fetches live destination data** from Google Maps and **stores it in a database for RAG** (Retrieval Augmented Generation).

**No frontend changes needed** - it just works! ✨

---

## 🚀 30-Second Setup

### 1. Get Google Maps API Key

```bash
# Go to: https://console.cloud.google.com/
# → APIs & Services → Credentials → Create API Key
# → Copy the key
```

### 2. Set in Supabase

```bash
# Go to: https://app.supabase.com/project/iloickicgibzbrxjsize
# → Edge Functions → Settings → Secrets
# → Add new secret:
#    Name: GOOGLE_MAPS_API_KEY
#    Value: {paste your API key}
```

### 3. Test It

```bash
chmod +x test-destination-data.sh
./test-destination-data.sh
```

**Done!** 🎉

---

## 🧪 Quick Test Commands

### Check if it's working
```bash
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/destination-data/stats \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"
```

### Fetch live data for Arunachal Pradesh
```bash
curl -X POST https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/destination-data/fetch \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E" \
  -H "Content-Type: application/json" \
  -d '{"query":"Arunachal Pradesh"}'
```

### Search for beaches (RAG)
```bash
curl -X POST https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/destination-data/search \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E" \
  -H "Content-Type: application/json" \
  -d '{"query":"beaches"}'
```

---

## 📊 What Happens When User Searches

### Before (Static Data)
```
User types "Arunachal Pradesh"
→ Returns pre-defined list
→ Limited info
→ No photos or ratings
```

### After (Live Data + RAG)
```
User types "Arunachal Pradesh"
→ Checks database cache (RAG)
→ If not cached: Fetch from Google Maps
  • Get place details
  • Fetch nearby attractions
  • Get photos and ratings
→ Store in database for future
→ Return rich suggestions with:
  ✓ Real photos
  ✓ Current ratings
  ✓ Top attractions
  ✓ Estimated costs
  ✓ Best season
```

---

## 🗂️ What Data Gets Stored

### Example: "Arunachal Pradesh"

Automatically stores:
- **Destinations:** Tawang, Ziro Valley, Namdapha, etc.
- **Attractions:** Tawang Monastery, Sela Pass, Madhuri Lake
- **Metadata:** Ratings, reviews, photos, coordinates
- **Travel Info:** Best season, duration, budget
- **Search Index:** For fast RAG retrieval

**Cache Duration:** 7 days (auto-refresh)

---

## 🎨 Frontend (No Changes!)

The input field at `/components/SmartInputWizard.tsx` line 378 **works exactly the same**.

**What it does now:**
```tsx
<Input
  value={searchQuery}
  onChange={(e) => {
    setSearchQuery(e.target.value);  // User types
    setShowSuggestions(true);
  }}
/>
```

**What happens behind the scenes:**
1. `onChange` → `setSearchQuery`
2. Debounced effect → `fetchAISuggestions()`
3. API call → `/suggest-destinations`
4. Backend checks cache (RAG)
5. If not cached → Fetch from Google Maps
6. Store in database
7. Return suggestions
8. Display to user ✨

**You don't need to change anything!**

---

## 🔑 Key Features

✅ **Live Data** - Fetches from Google Maps API  
✅ **Smart Cache** - 7-day caching reduces API costs  
✅ **RAG Storage** - Stores for semantic search  
✅ **Auto-Enrich** - Adds attractions, photos, ratings  
✅ **Fallback** - Works without API key (limited data)  
✅ **Zero Frontend Changes** - Drop-in upgrade  

---

## 📡 New Endpoints

### 1. Enhanced `/suggest-destinations`
Now uses live data + RAG (existing endpoint, just better!)

### 2. `/destination-data/fetch` (NEW)
Explicitly fetch and store destination data

### 3. `/destination-data/search` (NEW)
RAG-powered semantic search

### 4. `/destination-data/stats` (NEW)
Get storage statistics

---

## 🧩 Architecture

```
┌─────────────────┐
│  User Input     │ ← No changes needed!
│  (line 378)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend API    │ ← Enhanced with live data
│  /suggest-dest  │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌──────────┐
│ Cache │ │ Google   │
│ (RAG) │ │ Maps API │
└───────┘ └──────────┘
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `/INTEGRATION_SUMMARY.md` | Complete integration guide |
| `/LIVE_DESTINATION_DATA_IMPLEMENTATION.md` | Full technical documentation |
| `/test-destination-data.sh` | Automated testing |
| `/QUICK_START_DESTINATION_DATA.md` | This file |

---

## ✅ Success Checklist

- [ ] Google Maps API key obtained
- [ ] API key set in Supabase secrets
- [ ] Waited 30 seconds for deployment
- [ ] Ran test script
- [ ] Verified storage is healthy
- [ ] Tested search in app
- [ ] Saw live data in suggestions

---

## 🚨 Troubleshooting

### "Not fetching live data"
→ Check if `GOOGLE_MAPS_API_KEY` is set in Supabase

### "403 Permission Denied"
→ Enable Places API in Google Cloud Console

### "No results"
→ Fetch some data first to populate database

### "Still using fallback"
→ Check edge function logs in Supabase dashboard

---

## 💰 Costs

**Google Maps API:**
- Free tier: 28,000 requests/month
- After free tier: $5 per 1,000 requests
- With 7-day caching: ~100-500 requests/day
- **Estimated cost:** $0-15/month

**Supabase KV Storage:**
- Included in your plan
- ~8KB per destination
- 1,000 destinations = ~8MB

---

## 🎉 What You Can Do Now

### Try These Searches

In your app, search for:
- "Arunachal Pradesh"
- "beaches in India"
- "heritage sites"
- "mountain destinations"
- "spiritual places"

You'll see:
- ✓ Real photos from Google Maps
- ✓ Current ratings and reviews
- ✓ Nearby attractions
- ✓ Travel information
- ✓ Estimated budgets

### Monitor Performance

```bash
# Check storage stats
curl .../destination-data/stats

# Check Google API usage
# → Go to Google Cloud Console → APIs Dashboard
```

---

## 🚀 Next Steps

1. **Set up API key** (required)
2. **Run tests** to verify
3. **Try searches** in your app
4. **Monitor usage** in first few days
5. **Enjoy live data!** ✨

---

## 📞 Need Help?

- **Full docs:** `/LIVE_DESTINATION_DATA_IMPLEMENTATION.md`
- **Code:** `/supabase/functions/server/destination-data.tsx`
- **Tests:** `./test-destination-data.sh`

---

**TL;DR:** Set `GOOGLE_MAPS_API_KEY` in Supabase → Run test script → Done! Your search now fetches live data and stores it for RAG. 🎉
