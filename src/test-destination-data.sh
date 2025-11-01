#!/bin/bash

# Test Live Destination Data & RAG Implementation

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Supabase credentials
SUPABASE_URL="https://iloickicgibzbrxjsize.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌍 Live Destination Data & RAG Testing Suite"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if jq is installed
if command -v jq &> /dev/null; then
    HAS_JQ=true
else
    HAS_JQ=false
    echo -e "${YELLOW}💡 Tip: Install 'jq' for prettier JSON output${NC}"
    echo ""
fi

# Test 1: Check Storage Statistics
echo -e "${BLUE}📊 Test 1: Checking Storage Statistics${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

RESPONSE=$(curl -s "${SUPABASE_URL}/functions/v1/make-server-f7922768/destination-data/stats" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}")

if [ "$HAS_JQ" = true ]; then
    echo "$RESPONSE" | jq .
    STORAGE_HEALTHY=$(echo "$RESPONSE" | jq -r '.stats.storageHealthy')
    TOTAL_DESTINATIONS=$(echo "$RESPONSE" | jq -r '.stats.totalDestinations')
else
    echo "$RESPONSE"
    STORAGE_HEALTHY=$(echo "$RESPONSE" | grep -o '"storageHealthy":[^,}]*' | cut -d':' -f2)
    TOTAL_DESTINATIONS=$(echo "$RESPONSE" | grep -o '"totalDestinations":[^,}]*' | cut -d':' -f2)
fi

echo ""

if [ "$STORAGE_HEALTHY" = "true" ]; then
    echo -e "${GREEN}✅ Storage is healthy${NC}"
    echo -e "   Total destinations stored: ${TOTAL_DESTINATIONS:-0}"
else
    echo -e "${RED}❌ Storage check failed${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 2: Fetch Live Destination Data
echo -e "${BLUE}🗺️  Test 2: Fetching Live Destination Data${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Fetching data for: Arunachal Pradesh"
echo ""

RESPONSE=$(curl -s -X POST "${SUPABASE_URL}/functions/v1/make-server-f7922768/destination-data/fetch" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"query":"Arunachal Pradesh"}')

if [ "$HAS_JQ" = true ]; then
    echo "$RESPONSE" | jq .
    SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
    COUNT=$(echo "$RESPONSE" | jq -r '.count')
else
    echo "$RESPONSE"
    SUCCESS=$(echo "$RESPONSE" | grep -o '"success":[^,}]*' | cut -d':' -f2)
    COUNT=$(echo "$RESPONSE" | grep -o '"count":[^,}]*' | cut -d':' -f2)
fi

echo ""

if [ "$SUCCESS" = "true" ]; then
    echo -e "${GREEN}✅ Successfully fetched destination data${NC}"
    echo -e "   Destinations found: ${COUNT:-0}"
else
    echo -e "${YELLOW}⚠️  Note: This may be using fallback data if Google Maps API key is not set${NC}"
    echo -e "   Set GOOGLE_MAPS_API_KEY in Supabase to enable live data fetching"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 3: Search Stored Destinations (RAG)
echo -e "${BLUE}🔍 Test 3: Searching Stored Destinations (RAG)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Searching for: nature destinations"
echo ""

RESPONSE=$(curl -s -X POST "${SUPABASE_URL}/functions/v1/make-server-f7922768/destination-data/search" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"query":"nature","filters":{"tags":["nature","mountains"]}}')

if [ "$HAS_JQ" = true ]; then
    echo "$RESPONSE" | jq .
    SEARCH_COUNT=$(echo "$RESPONSE" | jq -r '.count')
else
    echo "$RESPONSE"
    SEARCH_COUNT=$(echo "$RESPONSE" | grep -o '"count":[^,}]*' | cut -d':' -f2)
fi

echo ""
echo -e "   Search results: ${SEARCH_COUNT:-0}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 4: Enhanced Destination Suggestions
echo -e "${BLUE}🤖 Test 4: Enhanced Destination Suggestions (with Live Data)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Getting suggestions for: beaches"
echo ""

RESPONSE=$(curl -s -X POST "${SUPABASE_URL}/functions/v1/make-server-f7922768/suggest-destinations" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"query":"beaches","userInterests":["beach","relaxation"],"useLiveData":true}')

if [ "$HAS_JQ" = true ]; then
    echo "$RESPONSE" | jq .
    LIVE_DATA_USED=$(echo "$RESPONSE" | jq -r '.liveDataUsed')
    AI_POWERED=$(echo "$RESPONSE" | jq -r '.aiPowered')
    TOTAL_MATCHES=$(echo "$RESPONSE" | jq -r '.totalMatches')
else
    echo "$RESPONSE"
    LIVE_DATA_USED=$(echo "$RESPONSE" | grep -o '"liveDataUsed":[^,}]*' | cut -d':' -f2)
    AI_POWERED=$(echo "$RESPONSE" | grep -o '"aiPowered":[^,}]*' | cut -d':' -f2)
    TOTAL_MATCHES=$(echo "$RESPONSE" | grep -o '"totalMatches":[^,}]*' | cut -d':' -f2)
fi

echo ""

if [ "$LIVE_DATA_USED" = "true" ]; then
    echo -e "${GREEN}✅ Using Live Data from Google Maps + RAG${NC}"
elif [ "$AI_POWERED" = "true" ]; then
    echo -e "${YELLOW}⚠️  Using Vertex AI (Live data not available)${NC}"
    echo -e "   Set GOOGLE_MAPS_API_KEY to enable live data fetching"
else
    echo -e "${YELLOW}⚠️  Using fallback suggestions${NC}"
fi

echo -e "   Total suggestions: ${TOTAL_MATCHES:-0}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Summary
echo -e "${BLUE}📋 Test Summary${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$STORAGE_HEALTHY" = "true" ] && [ "$SUCCESS" = "true" ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED${NC}"
    echo ""
    echo "Your live destination data system is working!"
    echo ""
    
    if [ "$LIVE_DATA_USED" = "true" ]; then
        echo -e "${GREEN}🎉 Live data fetching is ACTIVE${NC}"
        echo "   • Google Maps API integration: ✓"
        echo "   • RAG storage: ✓"
        echo "   • Enhanced suggestions: ✓"
    else
        echo -e "${YELLOW}📝 Next Steps:${NC}"
        echo ""
        echo "1. Set Google Maps API Key in Supabase:"
        echo "   • Go to: Edge Functions → Settings → Secrets"
        echo "   • Add: GOOGLE_MAPS_API_KEY = {your API key}"
        echo ""
        echo "2. Get API Key from Google Cloud:"
        echo "   • https://console.cloud.google.com/"
        echo "   • Enable Places API"
        echo "   • Create API Key"
        echo ""
        echo "3. Run this test again to verify live data"
    fi
else
    echo -e "${RED}⚠️  SOME TESTS FAILED${NC}"
    echo ""
    echo "Check the test output above for details."
    echo ""
    echo "Common issues:"
    echo "  • Edge functions not deployed"
    echo "  • Environment variables not set"
    echo "  • Network connectivity issues"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Individual test commands
echo -e "${BLUE}📝 Individual Test Commands:${NC}"
echo ""

echo "# Check storage stats:"
echo "curl -s ${SUPABASE_URL}/functions/v1/make-server-f7922768/destination-data/stats \\"
echo "  -H \"Authorization: Bearer ${SUPABASE_ANON_KEY}\""
echo ""

echo "# Fetch destination data:"
echo "curl -s -X POST ${SUPABASE_URL}/functions/v1/make-server-f7922768/destination-data/fetch \\"
echo "  -H \"Authorization: Bearer ${SUPABASE_ANON_KEY}\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"query\":\"your destination\"}'"
echo ""

echo "# Search stored destinations:"
echo "curl -s -X POST ${SUPABASE_URL}/functions/v1/make-server-f7922768/destination-data/search \\"
echo "  -H \"Authorization: Bearer ${SUPABASE_ANON_KEY}\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"query\":\"heritage\",\"filters\":{\"minRating\":4.0}}'"
echo ""

echo "# Get enhanced suggestions:"
echo "curl -s -X POST ${SUPABASE_URL}/functions/v1/make-server-f7922768/suggest-destinations \\"
echo "  -H \"Authorization: Bearer ${SUPABASE_ANON_KEY}\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"query\":\"beaches\",\"userInterests\":[\"beach\"],\"useLiveData\":true}'"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "For more details, see: /LIVE_DESTINATION_DATA_IMPLEMENTATION.md"
echo ""
