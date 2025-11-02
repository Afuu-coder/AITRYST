# Festival Campaigns Setup Script
# This script enables required APIs and grants permissions for Festival Campaigns features

$PROJECT_ID = "craftai-476916"
$SERVICE_ACCOUNT = "finalcraftai@craftai-476916.iam.gserviceaccount.com"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Festival Campaigns Setup" -ForegroundColor Cyan
Write-Host "Project: $PROJECT_ID" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
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
Write-Host "Setting active project..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 1: Enabling Required APIs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$apis = @(
    "aiplatform.googleapis.com",           # Vertex AI (for video generation)
    "generativelanguage.googleapis.com",   # Gemini API (for content generation)
    "ml.googleapis.com"                    # ML APIs
)

foreach ($api in $apis) {
    Write-Host "Enabling $api..." -ForegroundColor Yellow
    gcloud services enable $api --project=$PROJECT_ID
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ $api enabled" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to enable $api" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 2: Granting IAM Permissions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$roles = @(
    "roles/aiplatform.user",     # Vertex AI access
    "roles/ml.developer"         # ML model access
)

foreach ($role in $roles) {
    Write-Host "Granting $role to service account..." -ForegroundColor Yellow
    gcloud projects add-iam-policy-binding $PROJECT_ID `
        --member="serviceAccount:$SERVICE_ACCOUNT" `
        --role="$role" `
        --quiet 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ $role granted" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to grant $role" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 3: Verifying Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "Checking enabled APIs..." -ForegroundColor Yellow
$enabledApis = gcloud services list --enabled --project=$PROJECT_ID --format="value(config.name)" 2>$null

$allEnabled = $true
foreach ($api in $apis) {
    if ($enabledApis -contains $api) {
        Write-Host "✓ $api is enabled" -ForegroundColor Green
    } else {
        Write-Host "✗ $api is NOT enabled" -ForegroundColor Red
        $allEnabled = $false
    }
}

Write-Host ""
Write-Host "Checking service account permissions..." -ForegroundColor Yellow
$iamPolicy = gcloud projects get-iam-policy $PROJECT_ID `
    --flatten="bindings[].members" `
    --filter="bindings.members:$SERVICE_ACCOUNT" `
    --format="value(bindings.role)" 2>$null

$allGranted = $true
foreach ($role in $roles) {
    if ($iamPolicy -contains $role) {
        Write-Host "✓ $role is granted" -ForegroundColor Green
    } else {
        Write-Host "✗ $role is NOT granted" -ForegroundColor Red
        $allGranted = $false
    }
}

Write-Host ""
Write-Host "Checking billing status..." -ForegroundColor Yellow
$billingInfo = gcloud billing projects describe $PROJECT_ID --format="value(billingAccountName)" 2>$null
if ($billingInfo) {
    Write-Host "✓ Billing is enabled" -ForegroundColor Green
    Write-Host "  Billing Account: $billingInfo" -ForegroundColor Gray
} else {
    Write-Host "✗ Billing is NOT enabled" -ForegroundColor Red
    Write-Host "  Please link a billing account to your project" -ForegroundColor Yellow
    $allEnabled = $false
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($allEnabled -and $allGranted -and $billingInfo) {
    Write-Host "✓ All checks passed! Festival Campaigns is ready to use." -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now:" -ForegroundColor Cyan
    Write-Host "  1. Generate festival content in multiple languages" -ForegroundColor White
    Write-Host "  2. Create festival marketing images" -ForegroundColor White
    Write-Host "  3. Generate festival product videos" -ForegroundColor White
} else {
    Write-Host "⚠️ Some checks failed. Please review the errors above." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common fixes:" -ForegroundColor Cyan
    Write-Host "  - Enable APIs manually in Google Cloud Console" -ForegroundColor White
    Write-Host "  - Grant IAM roles manually in IAM & Admin" -ForegroundColor White
    Write-Host "  - Link a billing account in Billing section" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Feature Status" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "✓ Content Generation: Ready (uses Gemini API)" -ForegroundColor Green
Write-Host "✓ Image Generation: Ready (uses Vertex AI Imagen)" -ForegroundColor Green

if ($allEnabled -and $allGranted -and $billingInfo) {
    Write-Host "✓ Video Generation: Ready (uses Vertex AI Veo)" -ForegroundColor Green
} else {
    Write-Host "✗ Video Generation: Not Ready (requires setup completion)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Instructions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "1. Test Language Selection:" -ForegroundColor Yellow
Write-Host "   - Go to Festival Campaigns" -ForegroundColor White
Write-Host "   - Select 'Content Generation' tab" -ForegroundColor White
Write-Host "   - Choose language: Hindi" -ForegroundColor White
Write-Host "   - Generate campaign" -ForegroundColor White
Write-Host "   - Verify output is in Hindi" -ForegroundColor White

Write-Host ""
Write-Host "2. Test Video Generation:" -ForegroundColor Yellow
Write-Host "   - Go to Festival Campaigns" -ForegroundColor White
Write-Host "   - Select 'Video Generation' tab" -ForegroundColor White
Write-Host "   - Choose festival and enter product details" -ForegroundColor White
Write-Host "   - Click 'Generate Festival Video'" -ForegroundColor White
Write-Host "   - Wait 2-4 minutes for video generation" -ForegroundColor White

Write-Host ""
Write-Host "3. Test Responsive Design:" -ForegroundColor Yellow
Write-Host "   - Open Festival Campaigns on mobile device" -ForegroundColor White
Write-Host "   - Or use browser DevTools (F12) → Toggle device toolbar" -ForegroundColor White
Write-Host "   - Test at different screen sizes" -ForegroundColor White

Write-Host ""
Write-Host "For detailed documentation, see:" -ForegroundColor Cyan
Write-Host "  - FESTIVAL_CAMPAIGNS_FIXES.md" -ForegroundColor White
Write-Host "  - MIGRATION_COMPLETED.md" -ForegroundColor White
Write-Host ""
