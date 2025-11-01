# 🔐 IAM Permissions Guide for Google Hackathon Service Account

## 📋 Overview

This guide details all IAM permissions required for the `google-hackathon-sa` service account to access Vertex AI and Gemini models.

**Service Account:** `google-hackathon-sa@foundestra.iam.gserviceaccount.com`  
**Project:** `foundestra`  
**Purpose:** Access Vertex AI APIs for AI-powered travel planning

---

## ✅ Required IAM Roles

### 1. **roles/aiplatform.user** (Vertex AI User)

**Purpose:** Access Vertex AI APIs including model predictions

**Key Permissions:**
- `aiplatform.endpoints.predict` - Make predictions using endpoints
- `aiplatform.endpoints.explain` - Get explanations for predictions
- `aiplatform.endpoints.get` - Retrieve endpoint information
- `aiplatform.models.predict` - Make predictions using models
- `aiplatform.models.get` - Retrieve model information

**Why Required:**
Your application needs to call the Vertex AI API to generate content using Gemini models. This role provides the core permissions for making API calls.

**Grant Command:**
```bash
gcloud projects add-iam-policy-binding foundestra \
    --member="serviceAccount:google-hackathon-sa@foundestra.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"
```

---

### 2. **roles/ml.developer** (ML Developer)

**Purpose:** Full access to machine learning models

**Key Permissions:**
- `ml.models.get` - Retrieve ML model information
- `ml.models.predict` - Make predictions using ML models
- `ml.models.list` - List available ML models
- `aiplatform.models.get` - Get Vertex AI model details
- `aiplatform.models.predict` - Make predictions using Vertex AI models

**Why Required:**
This role provides access to the Gemini model itself. Without it, you cannot use the generative AI models even with the aiplatform.user role.

**Grant Command:**
```bash
gcloud projects add-iam-policy-binding foundestra \
    --member="serviceAccount:google-hackathon-sa@foundestra.iam.gserviceaccount.com" \
    --role="roles/ml.developer"
```

---

### 3. **roles/serviceusage.serviceUsageConsumer** (Service Usage Consumer)

**Purpose:** Enable usage of Google Cloud services

**Key Permissions:**
- `serviceusage.services.use` - Use Google Cloud services
- `serviceusage.services.get` - Get service information
- `serviceusage.quotas.get` - Check quota information

**Why Required:**
This role allows the service account to consume Google Cloud services and check quotas. Required for making API calls to any Google Cloud service.

**Grant Command:**
```bash
gcloud projects add-iam-policy-binding foundestra \
    --member="serviceAccount:google-hackathon-sa@foundestra.iam.gserviceaccount.com" \
    --role="roles/serviceusage.serviceUsageConsumer"
```

---

## 🚀 Quick Setup (All Roles)

### Option A: Run Automated Script (Recommended)

```bash
./setup-vertex-oauth.sh
```

This script will:
1. Create the service account `google-hackathon-sa`
2. Grant all three required IAM roles
3. Enable Vertex AI API
4. Generate JSON key
5. Display setup instructions

---

### Option B: Manual Setup

```bash
# Set variables
PROJECT_ID="foundestra"
SERVICE_ACCOUNT_EMAIL="google-hackathon-sa@foundestra.iam.gserviceaccount.com"

# Create service account
gcloud iam service-accounts create google-hackathon-sa \
    --description="Service account for Google Hackathon - Vertex AI API access" \
    --display-name="Google Hackathon Service Account" \
    --project=${PROJECT_ID}

# Grant all three roles
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/ml.developer"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/serviceusage.serviceUsageConsumer"

# Generate JSON key
gcloud iam service-accounts keys create google-hackathon-sa-key.json \
    --iam-account=${SERVICE_ACCOUNT_EMAIL}
```

---

## 🔍 Verify IAM Roles

### Check All Roles for Service Account

```bash
gcloud projects get-iam-policy foundestra \
    --flatten="bindings[].members" \
    --filter="bindings.members:serviceAccount:google-hackathon-sa@foundestra.iam.gserviceaccount.com" \
    --format="table(bindings.role)"
```

**Expected Output:**
```
ROLE
roles/aiplatform.user
roles/ml.developer
roles/serviceusage.serviceUsageConsumer
```

---

### Verify Specific Role

```bash
# Check aiplatform.user
gcloud projects get-iam-policy foundestra \
    --flatten="bindings[].members" \
    --filter="bindings.role:roles/aiplatform.user AND bindings.members:serviceAccount:google-hackathon-sa@*"

# Check ml.developer
gcloud projects get-iam-policy foundestra \
    --flatten="bindings[].members" \
    --filter="bindings.role:roles/ml.developer AND bindings.members:serviceAccount:google-hackathon-sa@*"

# Check serviceusage.serviceUsageConsumer
gcloud projects get-iam-policy foundestra \
    --flatten="bindings[].members" \
    --filter="bindings.role:roles/serviceusage.serviceUsageConsumer AND bindings.members:serviceAccount:google-hackathon-sa@*"
```

---

### Describe Service Account

```bash
gcloud iam service-accounts describe \
    google-hackathon-sa@foundestra.iam.gserviceaccount.com
```

---

## 🔧 Troubleshooting IAM Issues

### Error: "403 Permission Denied"

**Cause:** Service account missing required IAM roles

**Solution:**
1. Check which roles are missing:
   ```bash
   gcloud projects get-iam-policy foundestra \
       --flatten="bindings[].members" \
       --filter="bindings.members:serviceAccount:google-hackathon-sa@foundestra.iam.gserviceaccount.com" \
       --format="table(bindings.role)"
   ```

2. Grant missing roles:
   ```bash
   # Grant all required roles
   ./setup-vertex-oauth.sh
   ```

3. Wait 1-2 minutes for IAM changes to propagate

4. Test again:
   ```bash
   curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai
   ```

---

### Error: "Permission 'aiplatform.endpoints.predict' denied"

**Cause:** Missing `roles/aiplatform.user` role

**Solution:**
```bash
gcloud projects add-iam-policy-binding foundestra \
    --member="serviceAccount:google-hackathon-sa@foundestra.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"
```

---

### Error: "Permission 'ml.models.predict' denied"

**Cause:** Missing `roles/ml.developer` role

**Solution:**
```bash
gcloud projects add-iam-policy-binding foundestra \
    --member="serviceAccount:google-hackathon-sa@foundestra.iam.gserviceaccount.com" \
    --role="roles/ml.developer"
```

---

### Error: "Service account does not have required permissions"

**Cause:** Missing one or more required roles

**Quick Fix:**
```bash
# Run the automated setup script
./setup-vertex-oauth.sh

# This will:
# - Check existing roles
# - Grant any missing roles
# - Verify setup
```

---

## 📊 Permission Details

### roles/aiplatform.user Detailed Permissions

```yaml
permissions:
  - aiplatform.endpoints.explain
  - aiplatform.endpoints.get
  - aiplatform.endpoints.list
  - aiplatform.endpoints.predict
  - aiplatform.endpoints.rawPredict
  - aiplatform.models.get
  - aiplatform.models.list
  - aiplatform.models.predict
  - aiplatform.locations.get
  - aiplatform.locations.list
```

---

### roles/ml.developer Detailed Permissions

```yaml
permissions:
  - ml.jobs.cancel
  - ml.jobs.create
  - ml.jobs.get
  - ml.jobs.list
  - ml.jobs.update
  - ml.models.create
  - ml.models.delete
  - ml.models.get
  - ml.models.list
  - ml.models.predict
  - ml.models.update
  - ml.operations.cancel
  - ml.operations.get
  - ml.operations.list
  - ml.versions.create
  - ml.versions.delete
  - ml.versions.get
  - ml.versions.list
  - ml.versions.predict
  - ml.versions.update
  - resourcemanager.projects.get
  - resourcemanager.projects.list
```

---

### roles/serviceusage.serviceUsageConsumer Detailed Permissions

```yaml
permissions:
  - serviceusage.services.use
  - serviceusage.services.get
  - serviceusage.quotas.get
```

---

## 🔐 Security Best Practices

### ✅ DO:

1. **Use Least Privilege:**
   - Only grant the three required roles
   - Don't grant additional permissions unless needed

2. **Rotate Keys Regularly:**
   ```bash
   # Every 90 days, generate new key
   gcloud iam service-accounts keys create new-key.json \
       --iam-account=google-hackathon-sa@foundestra.iam.gserviceaccount.com
   
   # Update in Supabase
   # Delete old key
   gcloud iam service-accounts keys delete OLD_KEY_ID \
       --iam-account=google-hackathon-sa@foundestra.iam.gserviceaccount.com
   ```

3. **Monitor Usage:**
   ```bash
   # Check recent activity
   gcloud logging read "protoPayload.authenticationInfo.principalEmail=google-hackathon-sa@foundestra.iam.gserviceaccount.com" \
       --limit 50 \
       --format json
   ```

4. **Enable Audit Logging:**
   - Go to: https://console.cloud.google.com/iam-admin/audit
   - Enable audit logs for Vertex AI API

---

### ❌ DON'T:

1. **Don't Grant Owner/Editor Roles:**
   - Too broad and unnecessary
   - Use specific roles only

2. **Don't Share Keys Publicly:**
   - Never commit to git
   - Never share in public channels

3. **Don't Use Same Account for Multiple Projects:**
   - Create separate service accounts per environment

4. **Don't Grant Unnecessary Permissions:**
   - Stick to the three required roles only

---

## 📈 Testing IAM Setup

### Test 1: Verify Service Account Exists

```bash
gcloud iam service-accounts describe \
    google-hackathon-sa@foundestra.iam.gserviceaccount.com

# Expected: Success with account details
```

---

### Test 2: Verify All Roles Granted

```bash
gcloud projects get-iam-policy foundestra \
    --flatten="bindings[].members" \
    --filter="bindings.members:serviceAccount:google-hackathon-sa@foundestra.iam.gserviceaccount.com" \
    --format="table(bindings.role)"

# Expected: All three roles listed
```

---

### Test 3: Test API Access

```bash
# After setting up Supabase environment variables
curl https://iloickicgibzbrxjsize.supabase.co/functions/v1/make-server-f7922768/test-vertexai \
    -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY"

# Expected: {"status":"success", ...}
```

---

### Test 4: Verify APIs Enabled

```bash
gcloud services list --enabled --project=foundestra | grep -E '(aiplatform|generativelanguage)'

# Expected:
# aiplatform.googleapis.com
# generativelanguage.googleapis.com
```

---

## 📚 Additional Resources

- **IAM Roles Documentation:** https://cloud.google.com/iam/docs/understanding-roles
- **Vertex AI Permissions:** https://cloud.google.com/vertex-ai/docs/general/access-control
- **Service Accounts:** https://cloud.google.com/iam/docs/service-accounts
- **Best Practices:** https://cloud.google.com/iam/docs/best-practices-service-accounts

---

## ✅ Setup Checklist

Use this checklist to ensure all IAM permissions are correctly configured:

- [ ] Service account `google-hackathon-sa` created
- [ ] Role `roles/aiplatform.user` granted
- [ ] Role `roles/ml.developer` granted  
- [ ] Role `roles/serviceusage.serviceUsageConsumer` granted
- [ ] Vertex AI API enabled (`aiplatform.googleapis.com`)
- [ ] Generative Language API enabled (fallback)
- [ ] JSON key generated
- [ ] Environment variables set in Supabase:
  - [ ] `GOOGLE_CLOUD_PROJECT` or `PROJECT_ID` = `foundestra`
  - [ ] `SERVICE_ACCOUNT_NAME` = `google-hackathon-sa`
  - [ ] `GOOGLE_SERVICE_ACCOUNT_KEY` = `{full JSON}`
- [ ] Edge function redeployed
- [ ] Test connection successful (`/test-vertexai`)

---

## 🎯 Summary

**Required Roles:**
1. ✅ `roles/aiplatform.user` - Access Vertex AI APIs
2. ✅ `roles/ml.developer` - Access ML models
3. ✅ `roles/serviceusage.serviceUsageConsumer` - Use Google Cloud services

**Setup Command:**
```bash
./setup-vertex-oauth.sh
```

**Verification:**
```bash
gcloud projects get-iam-policy foundestra \
    --flatten="bindings[].members" \
    --filter="bindings.members:serviceAccount:google-hackathon-sa@*" \
    --format="table(bindings.role)"
```

**Test:**
```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-f7922768/test-vertexai
```

---

**Status: IAM Permissions Guide Complete ✅**
