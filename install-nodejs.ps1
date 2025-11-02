# PowerShell script to download and install Node.js
Write-Host "Downloading Node.js..." -ForegroundColor Green

# Create temp directory
$tempDir = "$env:TEMP\nodejs-install"
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

# Download Node.js LTS (Windows x64)
$nodeUrl = "https://nodejs.org/dist/v20.10.0/node-v20.10.0-win-x64.zip"
$nodeZip = "$tempDir\nodejs.zip"
$nodeExtracted = "$tempDir\nodejs"

try {
    Write-Host "Downloading from: $nodeUrl" -ForegroundColor Yellow
    Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeZip -UseBasicParsing
    
    Write-Host "Extracting Node.js..." -ForegroundColor Yellow
    Expand-Archive -Path $nodeZip -DestinationPath $nodeExtracted -Force
    
    # Find the extracted folder
    $nodeFolders = Get-ChildItem -Path $nodeExtracted -Directory
    $nodeFolder = $nodeFolders[0].FullName
    
    # Create a local nodejs directory in the project
    $localNodeDir = "$PSScriptRoot\nodejs"
    if (Test-Path $localNodeDir) {
        Remove-Item -Path $localNodeDir -Recurse -Force
    }
    
    Write-Host "Installing Node.js locally..." -ForegroundColor Yellow
    Copy-Item -Path $nodeFolder -Destination $localNodeDir -Recurse -Force
    
    Write-Host "Node.js installed successfully!" -ForegroundColor Green
    Write-Host "Location: $localNodeDir" -ForegroundColor Cyan
    
    # Test the installation
    $nodeExe = "$localNodeDir\node.exe"
    $npmCmd = "$localNodeDir\npm.cmd"
    
    if (Test-Path $nodeExe) {
        $version = & $nodeExe --version
        Write-Host "Node.js version: $version" -ForegroundColor Green
    }
    
    if (Test-Path $npmCmd) {
        $npmVersion = & $npmCmd --version
        Write-Host "npm version: $npmVersion" -ForegroundColor Green
    }
    
    Write-Host "`nYou can now run the development server using:" -ForegroundColor Cyan
    Write-Host ".\nodejs\npm.cmd run dev" -ForegroundColor White
    
} catch {
    Write-Error "Failed to download or install Node.js: $_"
} finally {
    # Cleanup
    if (Test-Path $tempDir) {
        Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}
