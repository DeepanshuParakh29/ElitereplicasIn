# PowerShell script to remove all API routes from the Next.js app
# This script removes all files and directories in the src/app/api directory

$apiDir = ".\src\app\api"

# Check if the directory exists
if (Test-Path $apiDir) {
    Write-Host "Removing all API routes from $apiDir..."
    
    # Remove all files and subdirectories in the API directory
    Remove-Item -Path "$apiDir\*" -Recurse -Force
    
    # Create a placeholder file to keep the directory structure
    $placeholderContent = @"
/**
 * This directory previously contained Next.js API routes that used mock data.
 * 
 * All API routes have been removed as part of the migration to use the real backend API.
 * The frontend now connects directly to the backend API at:
 * ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}
 */
"@
    
    # Create the placeholder file
    Set-Content -Path "$apiDir\README.md" -Value $placeholderContent
    
    Write-Host "API routes removed successfully. A placeholder README.md file has been created."
} else {
    Write-Host "API directory not found at $apiDir"
}
