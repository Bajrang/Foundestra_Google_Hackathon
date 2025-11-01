#!/bin/bash

# Vertex AI OAuth Setup Script for Project: foundestra
# This script automates the service account creation and configuration

set -e  # Exit on error

PROJECT_ID="foundestra"
SERVICE_ACCOUNT_NAME="google-hackathon-sa"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
KEY_FILE="google-hackathon-sa-key.json"

echo "🚀 Setting up Vertex AI OAuth for project: ${PROJECT_ID}"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo "✓ gcloud CLI found"

# Set the project
echo ""
echo "📋 Step 1: Setting active project to ${PROJECT_ID}..."
gcloud config set project ${PROJECT_ID}

# Enable Vertex AI API
echo ""
echo "📋 Step 1b: Enabling Vertex AI API..."
echo "→ Enabling aiplatform.googleapis.com..."
gcloud services enable aiplatform.googleapis.com --project=${PROJECT_ID} 2>/dev/null || echo "   (API may already be enabled)"
echo "→ Enabling generativelanguage.googleapis.com (for API key fallback)..."
gcloud services enable generativelanguage.googleapis.com --project=${PROJECT_ID} 2>/dev/null || echo "   (API may already be enabled)"
echo "✓ APIs enabled"

# Check if service account already exists
echo ""
echo "📋 Step 2: Checking if service account exists..."
if gcloud iam service-accounts describe ${SERVICE_ACCOUNT_EMAIL} &> /dev/null; then
    echo "✓ Service account ${SERVICE_ACCOUNT_EMAIL} already exists"
else
    echo "→ Creating service account ${SERVICE_ACCOUNT_NAME}..."
    gcloud iam service-accounts create ${SERVICE_ACCOUNT_NAME} \
        --description="Service account for Google Hackathon - Vertex AI API access" \
        --display-name="Google Hackathon Service Account"
    echo "✓ Service account created"
fi

# Grant necessary IAM permissions
echo ""
echo "📋 Step 3: Granting IAM permissions..."

echo "→ Granting roles/aiplatform.user..."
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/aiplatform.user" \
    --condition=None
echo "✓ Granted roles/aiplatform.user"

echo "→ Granting roles/ml.developer..."
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/ml.developer" \
    --condition=None
echo "✓ Granted roles/ml.developer"

echo "→ Granting roles/serviceusage.serviceUsageConsumer..."
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/serviceusage.serviceUsageConsumer" \
    --condition=None
echo "✓ Granted roles/serviceusage.serviceUsageConsumer"

echo ""
echo "✓ All IAM permissions granted successfully"

# Create service account key
echo ""
echo "📋 Step 4: Creating service account key..."
if [ -f "${KEY_FILE}" ]; then
    echo "⚠️  Key file ${KEY_FILE} already exists"
    read -p "Do you want to create a new key? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        mv ${KEY_FILE} ${KEY_FILE}.backup
        echo "○ Backed up existing key to ${KEY_FILE}.backup"
    else
        echo "○ Using existing key file"
    fi
fi

if [ ! -f "${KEY_FILE}" ]; then
    gcloud iam service-accounts keys create ${KEY_FILE} \
        --iam-account=${SERVICE_ACCOUNT_EMAIL}
    echo "✓ Service account key created: ${KEY_FILE}"
fi

# Display the key content for Supabase
echo ""
echo "📋 Step 5: Service account key ready!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 COPY THIS ENTIRE JSON TO SUPABASE ENVIRONMENT VARIABLE:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
cat ${KEY_FILE}
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Step 6: Configure Supabase Edge Function"
echo ""
echo "1. Go to: Supabase Dashboard → Edge Functions → Settings"
echo "2. Add these environment variables:"
echo ""
echo "   Variable Name: GOOGLE_CLOUD_PROJECT (or PROJECT_ID)"
echo "   Value: ${PROJECT_ID}"
echo ""
echo "   Variable Name: SERVICE_ACCOUNT_NAME"
echo "   Value: ${SERVICE_ACCOUNT_NAME}"
echo ""
echo "   Variable Name: GOOGLE_SERVICE_ACCOUNT_KEY"
echo "   Value: [Paste the entire JSON above]"
echo ""
echo "   (Optional) For API key fallback:"
echo "   Variable Name: VERTEX_AI_API_KEY"
echo "   Value: [Your Gemini API key from https://aistudio.google.com/app/apikey]"
echo ""
echo "3. Save and restart your edge function"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🧪 Step 7: Test the setup"
echo ""
echo "Run this command after configuring Supabase:"
echo ""
echo "curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f7922768/test-vertexai \\"
echo "  -H \"Authorization: Bearer YOUR_SUPABASE_ANON_KEY\""
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Setup complete!"
echo ""
echo "⚠️  SECURITY REMINDER:"
echo "   - Never commit ${KEY_FILE} to git"
echo "   - Add ${KEY_FILE} to .gitignore"
echo "   - Rotate keys regularly"
echo "   - Delete this key file after copying to Supabase"
echo ""
echo "To delete the key file:"
echo "  rm ${KEY_FILE}"
echo ""

# Add to .gitignore if exists
if [ -f ".gitignore" ]; then
    if ! grep -q "${KEY_FILE}" .gitignore; then
        echo "${KEY_FILE}" >> .gitignore
        echo "✓ Added ${KEY_FILE} to .gitignore"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🧪 VERIFY SETUP (Optional - after configuring Supabase):"
echo ""
echo "1. Test IAM roles:"
echo "   gcloud projects get-iam-policy ${PROJECT_ID} \\"
echo "     --flatten=\"bindings[].members\" \\"
echo "     --filter=\"bindings.members:serviceAccount:${SERVICE_ACCOUNT_EMAIL}\""
echo ""
echo "2. Verify service account:"
echo "   gcloud iam service-accounts describe ${SERVICE_ACCOUNT_EMAIL}"
echo ""
echo "3. Check enabled APIs:"
echo "   gcloud services list --enabled | grep -E '(aiplatform|generativelanguage)'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
