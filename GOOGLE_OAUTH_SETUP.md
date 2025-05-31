# Google OAuth Setup Requirements

The Gmail integration requires proper Google Cloud Console configuration to meet OAuth 2.0 security policies.

## Required Setup Steps:

### 1. Google Cloud Console Configuration
- Create or select a project in Google Cloud Console
- Enable the Gmail API
- Create OAuth 2.0 credentials (Web application)

### 2. OAuth Client Configuration
Add these exact settings in Google Cloud Console:

**Authorized JavaScript origins:**
```
https://8e451161-e55c-4fc7-abae-b0a034409cc4-00-2xulh25lr6wuy.worf.replit.dev
```

**Authorized redirect URIs:**
```
https://8e451161-e55c-4fc7-abae-b0a034409cc4-00-2xulh25lr6wuy.worf.replit.dev/api/auth/gmail/callback
```

### 3. OAuth Consent Screen
Configure the OAuth consent screen with:
- Application name: "PookAi Email Assistant"
- User support email
- Developer contact information
- Scopes: `https://www.googleapis.com/auth/gmail.readonly`

### 4. Application Status
For production use, the app needs to be verified by Google or kept in testing mode with authorized test users.

## Current Error Analysis
The "Error 400: invalid_request" indicates:
1. Missing or incorrect redirect URI configuration
2. OAuth consent screen not properly configured
3. Application may need verification for production use

## Next Steps
1. Complete the Google Cloud Console setup with the exact URIs above
2. Add your email as a test user if the app is in testing mode
3. Ensure all required OAuth consent screen fields are completed