# Environment check script
# Verifies required tools and configurations are available

# Check Node.js
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    $warning = "Node.js not found. Install Node.js 18+ to run this project."
} elseif ([version]($nodeVersion -replace 'v','').Split('.')[0] -lt 18) {
    $warning = "Node.js version $nodeVersion detected. Upgrade to Node.js 18+ recommended."
}

# Check if backend .env exists
if (-not (Test-Path "backend\.env")) {
    $warning = "$warning`nBackend .env file not found. Database connection may fail."
}

# Check if PostgreSQL is accessible (optional check)
$pgCheck = psql --version 2>$null
if (-not $pgCheck) {
    $warning = "$warning`nPostgreSQL CLI not found in PATH. Ensure PostgreSQL 14+ is installed."
}

# Return result
$result = @{
    continue = $true
}

if ($warning) {
    $result.systemMessage = "Environment Check:`n$warning"
}

$result | ConvertTo-Json -Depth 10
