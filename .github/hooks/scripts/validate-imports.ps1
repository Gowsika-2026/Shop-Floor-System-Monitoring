# Validation script for import statements
# Ensures path aliases are used correctly

param(
    [Parameter(ValueFromPipeline=$true)]
    [string]$JsonInput
)

# Read JSON from stdin if provided
if ($JsonInput) {
    $input = $JsonInput | ConvertFrom-Json
} else {
    $inputText = [Console]::In.ReadToEnd()
    if ($inputText) {
        $input = $inputText | ConvertFrom-Json
    }
}

# Check if this is a file creation/edit operation
$toolName = $input.toolName
$filePaths = @()

if ($toolName -in @('create_file', 'replace_string_in_file', 'multi_replace_string_in_file')) {
    # Extract file paths based on tool type
    if ($input.parameters.filePath) {
        $filePaths += $input.parameters.filePath
    }
    if ($input.parameters.replacements) {
        $filePaths += $input.parameters.replacements | ForEach-Object { $_.filePath }
    }
}

# Only validate TypeScript/JavaScript files in frontend
$frontendFiles = $filePaths | Where-Object { 
    $_ -match 'frontend.*\.(ts|tsx|js|jsx)$' -and $_ -notmatch 'node_modules'
}

$hasErrors = $false
$errors = @()

foreach ($file in $frontendFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Check for incorrect relative imports that should use path aliases
        if ($content -match "import .* from ['\`"](\.\./){3,}") {
            $errors += "File $file uses deep relative imports. Use path aliases (@hooks, @store, @services, @components) instead."
            $hasErrors = $true
        }
        
        # Check for common incorrect paths
        if ($content -match "import .* from ['\`"].*src/(hooks|store|services|components)") {
            $errors += "File $file uses 'src/' in imports. Use path aliases (@hooks, @store, @services, @components) instead."
            $hasErrors = $true
        }
    }
}

# Return result
$result = @{
    continue = -not $hasErrors
}

if ($hasErrors) {
    $result.systemMessage = "Import validation failed:`n" + ($errors -join "`n")
    $result.hookSpecificOutput = @{
        hookEventName = "PreToolUse"
        permissionDecision = "ask"
        permissionDecisionReason = "Code has import issues. Fix before proceeding?"
    }
}

$result | ConvertTo-Json -Depth 10
