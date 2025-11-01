#!/bin/bash

# 🚀 Vertex AI Test Commands - Ready to Use
# All commands use the correct Supabase anon key

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 Vertex AI Test Suite"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Supabase credentials
SUPABASE_URL="https://iloickicgibzbrxjsize.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsb2lja2ljZ2liemJyeGpzaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0NTksImV4cCI6MjA3NDA1MDQ1OX0.ZBSOLXg0WOxqU0sxEcpPT404HHx_EI5CgoNZ3Dbmb8E"

# Check if jq is installed for pretty output
if command -v jq &> /dev/null; then
    HAS_JQ=true
else
    HAS_JQ=false
    echo -e "${YELLOW}💡 Tip: Install 'jq' for prettier output${NC}"
    echo ""
fi

# Test 1: Check Configuration
echo -e "${BLUE}📋 Test 1: Checking Configuration...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

RESPONSE=$(curl -s "${SUPABASE_URL}/functions/v1/make-server-f7922768/vertex-config" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}")

if [ "$HAS_JQ" = true ]; then
    echo "$RESPONSE" | jq .
else
    echo "$RESPONSE"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 2: Test AI Connection
echo -e "${BLUE}🤖 Test 2: Testing AI Connection...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

RESPONSE=$(curl -s "${SUPABASE_URL}/functions/v1/make-server-f7922768/test-vertexai" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}")

if [ "$HAS_JQ" = true ]; then
    echo "$RESPONSE" | jq .
    STATUS=$(echo "$RESPONSE" | jq -r '.status')
else
    echo "$RESPONSE"
    STATUS=$(echo "$RESPONSE" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
fi

echo ""

if [ "$STATUS" = "success" ]; then
    echo -e "${GREEN}✅ AI Connection Test: SUCCESS${NC}"
else
    echo -e "${YELLOW}⚠️  AI Connection Test: Check configuration${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 3: Test Destination Search
echo -e "${BLUE}🏖️  Test 3: Testing Destination Search...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

RESPONSE=$(curl -s -X POST "${SUPABASE_URL}/functions/v1/make-server-f7922768/suggest-destinations" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"query":"goa","userInterests":["beach","nightlife"]}')

if [ "$HAS_JQ" = true ]; then
    echo "$RESPONSE" | jq .
    AI_POWERED=$(echo "$RESPONSE" | jq -r '.aiPowered')
else
    echo "$RESPONSE"
    AI_POWERED=$(echo "$RESPONSE" | grep -o '"aiPowered":[^,}]*' | cut -d':' -f2)
fi

echo ""

if [ "$AI_POWERED" = "true" ]; then
    echo -e "${GREEN}✅ Destination Search: AI-POWERED${NC}"
else
    echo -e "${YELLOW}⚠️  Destination Search: Using fallback${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Summary
echo -e "${BLUE}📊 Summary${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$STATUS" = "success" ] && [ "$AI_POWERED" = "true" ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED - Vertex AI is working correctly!${NC}"
    echo ""
    echo "🎉 Your AI-powered travel planning app is ready to use!"
    echo ""
    echo "Next steps:"
    echo "  • Open your application"
    echo "  • Try destination search"
    echo "  • Look for purple 'AI Powered' badges"
    echo "  • Check browser console for AI status"
else
    echo -e "${YELLOW}⚠️  SETUP REQUIRED${NC}"
    echo ""
    echo "Run these commands to set up:"
    echo ""
    echo "  1. ./setup-vertex-oauth.sh"
    echo "  2. Copy generated JSON"
    echo "  3. Set in Supabase → Edge Functions → Secrets:"
    echo "     - GOOGLE_SERVICE_ACCOUNT_KEY = {JSON}"
    echo "     - GOOGLE_CLOUD_PROJECT = foundestra"
    echo "     - SERVICE_ACCOUNT_NAME = google-hackathon-sa"
    echo "  4. Run this test again"
    echo ""
    echo "See: /QUICK_FIX_401_ERROR.md for detailed instructions"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Individual command examples
echo -e "${BLUE}📝 Individual Commands (for manual testing):${NC}"
echo ""
echo "# Check Configuration:"
echo "curl -s ${SUPABASE_URL}/functions/v1/make-server-f7922768/vertex-config \\"
echo "  -H \"Authorization: Bearer ${SUPABASE_ANON_KEY}\""
echo ""
echo "# Test AI Connection:"
echo "curl -s ${SUPABASE_URL}/functions/v1/make-server-f7922768/test-vertexai \\"
echo "  -H \"Authorization: Bearer ${SUPABASE_ANON_KEY}\""
echo ""
echo "# Test Destination Search:"
echo "curl -s -X POST ${SUPABASE_URL}/functions/v1/make-server-f7922768/suggest-destinations \\"
echo "  -H \"Authorization: Bearer ${SUPABASE_ANON_KEY}\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"query\":\"goa\",\"userInterests\":[\"beach\",\"nightlife\"]}'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
