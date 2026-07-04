#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${GCP_PROJECT:-foundestra}"
REGION="${GCP_REGION:-us-central1}"
FUNCTION_NAME="${FUNCTION_NAME:-foundestra-travel-api}"
SERVICE_ACCOUNT="${SERVICE_ACCOUNT:-google-hackathon-sa@foundestra.iam.gserviceaccount.com}"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Deploying Cloud Function Gen2 to project: ${PROJECT_ID}"
gcloud config set project "${PROJECT_ID}"

gcloud services enable \
  cloudfunctions.googleapis.com \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  aiplatform.googleapis.com \
  --project="${PROJECT_ID}"

cd "${ROOT_DIR}/server"
npm install --omit=dev

gcloud functions deploy "${FUNCTION_NAME}" \
  --gen2 \
  --runtime=nodejs20 \
  --region="${REGION}" \
  --source=. \
  --entry-point=foundestraTravelApi \
  --trigger-http \
  --allow-unauthenticated \
  --project="${PROJECT_ID}" \
  --service-account="${SERVICE_ACCOUNT}" \
  --memory=512Mi \
  --timeout=120s \
  --min-instances=0 \
  --max-instances=10 \
  --set-env-vars="GOOGLE_CLOUD_PROJECT=${PROJECT_ID},GOOGLE_CLOUD_LOCATION=${REGION},GOOGLE_GENAI_VERTEXAI_MODEL=gemini-2.5-flash"

FUNCTION_URL="$(gcloud functions describe "${FUNCTION_NAME}" \
  --gen2 \
  --region="${REGION}" \
  --project="${PROJECT_ID}" \
  --format='value(serviceConfig.uri)')"

echo ""
echo "Deployment complete."
echo "Function URL: ${FUNCTION_URL}"
echo "Health check: ${FUNCTION_URL}/make-server-f7922768/health"
echo ""
echo "Set this when building the frontend:"
echo "  VITE_API_BASE_URL=${FUNCTION_URL}/make-server-f7922768"