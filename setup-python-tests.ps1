# Python Testing Environment Setup Script for Windows
# Run this script after installing Python

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Python Test Environment Setup" -ForegroundColor Cyan
Write-Host "  Shop-floor Resource Allocation System" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found!" -ForegroundColor Red
    Write-Host "Please install Python 3.8+ from https://www.python.org/downloads/" -ForegroundColor Red
    exit 1
}

# Create virtual environment
Write-Host ""
Write-Host "Creating virtual environment..." -ForegroundColor Yellow
if (Test-Path "venv") {
    Write-Host "✓ Virtual environment already exists" -ForegroundColor Green
} else {
    python -m venv venv
    if ($?) {
        Write-Host "✓ Virtual environment created successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to create virtual environment" -ForegroundColor Red
        exit 1
    }
}

# Activate virtual environment
Write-Host ""
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

if ($?) {
    Write-Host "✓ Virtual environment activated" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to activate virtual environment" -ForegroundColor Red
    Write-Host "You may need to run: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Yellow
    exit 1
}

# Upgrade pip
Write-Host ""
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip | Out-Null

if ($?) {
    Write-Host "✓ pip upgraded successfully" -ForegroundColor Green
} else {
    Write-Host "⚠ Failed to upgrade pip (continuing anyway)" -ForegroundColor Yellow
}

# Install dependencies
Write-Host ""
Write-Host "Installing test dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

if ($?) {
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Create .env file if it doesn't exist
Write-Host ""
Write-Host "Setting up environment configuration..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.test.example") {
        Copy-Item ".env.test.example" ".env"
        Write-Host "✓ Created .env file from template" -ForegroundColor Green
        Write-Host "⚠ Please update .env with your configuration" -ForegroundColor Yellow
    } else {
        Write-Host "⚠ .env.test.example not found, skipping .env creation" -ForegroundColor Yellow
    }
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

# Create reports directory
Write-Host ""
Write-Host "Creating reports directory..." -ForegroundColor Yellow
if (-not (Test-Path "reports")) {
    New-Item -ItemType Directory -Path "reports" | Out-Null
    Write-Host "✓ Reports directory created" -ForegroundColor Green
} else {
    Write-Host "✓ Reports directory already exists" -ForegroundColor Green
}

# Installation complete
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Ensure backend API is running on http://localhost:3000" -ForegroundColor White
Write-Host "2. Update .env file with correct credentials" -ForegroundColor White
Write-Host "3. Run tests with: pytest -v" -ForegroundColor White
Write-Host "4. View HTML report with: start reports/python-test-report.html" -ForegroundColor White
Write-Host ""
Write-Host "Quick Test Commands:" -ForegroundColor Yellow
Write-Host "  pytest -v                    # Run all tests" -ForegroundColor White
Write-Host "  pytest -m integration        # Run integration tests" -ForegroundColor White
Write-Host "  pytest -m auth               # Run auth tests" -ForegroundColor White
Write-Host "  pytest -k operator           # Run operator tests" -ForegroundColor White
Write-Host "  pytest --html=reports/report.html  # Generate HTML report" -ForegroundColor White
Write-Host ""
Write-Host "Happy Testing! 🧪" -ForegroundColor Cyan
Write-Host ""
