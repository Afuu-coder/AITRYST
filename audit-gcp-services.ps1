# Google Cloud Project Audit Script
# Run this script to audit all services in your GCP project
# Prerequisites: Google Cloud SDK (gcloud) must be installed

$PROJECT_ID = "artisan-ai-472017"
$SERVICE_ACCOUNT = "aitryst@artisan-ai-472017.iam.gserviceaccount.com"
$OUTPUT_DIR = "gcp-audit-$(Get-Date -Format 'yyyy-MM-dd-HHmmss')"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Google Cloud Project Audit" -ForegroundColor Cyan
Write-Host "Project: $PROJECT_ID" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create output directory
New-Item -ItemType Directory -Force -Path $OUTPUT_DIR | Out-Null
Write-Host "✓ Created output directory: $OUTPUT_DIR" -ForegroundColor Green
Write-Host ""

# Check if gcloud is installed
try {
    $gcloudVersion = gcloud version --format="value(version)" 2>$null
    Write-Host "✓ Google Cloud SDK version: $gcloudVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Google Cloud SDK not found. Please install it first." -ForegroundColor Red
    Write-Host "  Download from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Authenticating with Google Cloud..." -ForegroundColor Yellow
gcloud auth login --quiet

Write-Host "Setting active project..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Listing Enabled APIs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
gcloud services list --enabled --project=$PROJECT_ID | Tee-Object -FilePath "$OUTPUT_DIR/enabled-apis.txt"
Write-Host "✓ Saved to: $OUTPUT_DIR/enabled-apis.txt" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "2. Listing Service Accounts" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
gcloud iam service-accounts list --project=$PROJECT_ID | Tee-Object -FilePath "$OUTPUT_DIR/service-accounts.txt"
Write-Host "✓ Saved to: $OUTPUT_DIR/service-accounts.txt" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "3. Service Account Details" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
gcloud iam service-accounts describe $SERVICE_ACCOUNT --project=$PROJECT_ID | Tee-Object -FilePath "$OUTPUT_DIR/service-account-details.txt"
Write-Host "✓ Saved to: $OUTPUT_DIR/service-account-details.txt" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "4. IAM Policy for Service Account" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
gcloud projects get-iam-policy $PROJECT_ID --flatten="bindings[].members" --filter="bindings.members:$SERVICE_ACCOUNT" | Tee-Object -FilePath "$OUTPUT_DIR/service-account-roles.txt"
Write-Host "✓ Saved to: $OUTPUT_DIR/service-account-roles.txt" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "5. Complete IAM Policy" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
gcloud projects get-iam-policy $PROJECT_ID --format=json | Out-File -FilePath "$OUTPUT_DIR/iam-policy.json"
Write-Host "✓ Saved to: $OUTPUT_DIR/iam-policy.json" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "6. Cloud Storage Buckets" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
gcloud storage buckets list --project=$PROJECT_ID 2>&1 | Tee-Object -FilePath "$OUTPUT_DIR/storage-buckets.txt"
Write-Host "✓ Saved to: $OUTPUT_DIR/storage-buckets.txt" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "7. Firestore Database" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
gcloud firestore databases describe --project=$PROJECT_ID 2>&1 | Tee-Object -FilePath "$OUTPUT_DIR/firestore-info.txt"
Write-Host "✓ Saved to: $OUTPUT_DIR/firestore-info.txt" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "8. Vertex AI Resources (us-central1)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Checking Vertex AI models..." -ForegroundColor Yellow
gcloud ai models list --region=us-central1 --project=$PROJECT_ID 2>&1 | Tee-Object -FilePath "$OUTPUT_DIR/vertex-ai-models.txt"
Write-Host "Checking Vertex AI endpoints..." -ForegroundColor Yellow
gcloud ai endpoints list --region=us-central1 --project=$PROJECT_ID 2>&1 | Tee-Object -FilePath "$OUTPUT_DIR/vertex-ai-endpoints.txt"
Write-Host "✓ Saved to: $OUTPUT_DIR/vertex-ai-*.txt" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "9. API Quotas" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Checking Vertex AI quotas..." -ForegroundColor Yellow
gcloud services quota list --service=aiplatform.googleapis.com --project=$PROJECT_ID 2>&1 | Out-File -FilePath "$OUTPUT_DIR/quota-vertex-ai.txt"
Write-Host "Checking Speech-to-Text quotas..." -ForegroundColor Yellow
gcloud services quota list --service=speech.googleapis.com --project=$PROJECT_ID 2>&1 | Out-File -FilePath "$OUTPUT_DIR/quota-speech.txt"
Write-Host "Checking Vision API quotas..." -ForegroundColor Yellow
gcloud services quota list --service=vision.googleapis.com --project=$PROJECT_ID 2>&1 | Out-File -FilePath "$OUTPUT_DIR/quota-vision.txt"
Write-Host "✓ Saved to: $OUTPUT_DIR/quota-*.txt" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "10. Billing Information" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
gcloud billing projects describe $PROJECT_ID 2>&1 | Tee-Object -FilePath "$OUTPUT_DIR/billing-info.txt"
Write-Host "✓ Saved to: $OUTPUT_DIR/billing-info.txt" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "11. Project Information" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
gcloud projects describe $PROJECT_ID 2>&1 | Tee-Object -FilePath "$OUTPUT_DIR/project-info.txt"
Write-Host "✓ Saved to: $OUTPUT_DIR/project-info.txt" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "Audit Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "All audit results saved to: $OUTPUT_DIR" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary of files created:" -ForegroundColor Yellow
Get-ChildItem -Path $OUTPUT_DIR | ForEach-Object {
    Write-Host "  - $($_.Name)" -ForegroundColor White
}
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Review the audit files in the $OUTPUT_DIR directory" -ForegroundColor White
Write-Host "2. Check billing-info.txt for billing account status" -ForegroundColor White
Write-Host "3. Review enabled-apis.txt for all active APIs" -ForegroundColor White
Write-Host "4. Check service-account-roles.txt for current permissions" -ForegroundColor White
Write-Host "5. Follow the migration guide in GOOGLE_CLOUD_MIGRATION_GUIDE.md" -ForegroundColor White
Write-Host ""
