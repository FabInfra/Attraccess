# Authentik Setup Guide for GitHub Actions

This guide explains how to properly configure Authentik authentication for the OpenHands GitHub Action workflow.

## Overview

The workflow uses Authentik's OAuth2 client credentials flow with service accounts to authenticate machine-to-machine communication between GitHub Actions and your OpenHands instance.

## Prerequisites

1. A running Authentik instance
2. Admin access to Authentik
3. A running OpenHands instance
4. Repository admin access to configure GitHub secrets

## Step 1: Create an OAuth2 Provider in Authentik

1. Log into your Authentik admin interface
2. Navigate to **Applications** → **Providers**
3. Click **Create** and select **OAuth2/OpenID Provider**
4. Configure the provider with these settings:

   - **Name**: `openhands-github-action` (or any descriptive name)
   - **Authorization flow**: Select your default authorization flow
   - **Client type**: `Confidential`
   - **Client ID**: Note this value - you'll need it for `OPENHANDS_AUTHENTIK_CLIENT_ID`
   - **Client Secret**: Leave this empty (we'll use service account authentication)
   - **Redirect URIs**: Not needed for client_credentials flow
   - **Scopes**: Select `openid` and `profile`

5. Under **Advanced protocol settings**:

   - Enable **Include claims in id_token**
   - Leave other settings as default

6. Click **Save**

## Step 2: Create an Application

1. Navigate to **Applications** → **Applications**
2. Click **Create**
3. Configure:

   - **Name**: `OpenHands GitHub Action`
   - **Slug**: `openhands-github-action`
   - **Provider**: Select the OAuth2 provider you created in Step 1
   - **Policy engine mode**: `any` (or configure based on your security requirements)

4. Click **Save**

## Step 3: Create a Service Account

1. Navigate to **Directory** → **Users**
2. Click **Create Service Account**
3. Configure:

   - **Username**: `github-openhands-service-account`
   - **Name**: `GitHub OpenHands Service Account`
   - **Email**: `github-openhands@yourdomain.com` (optional)

4. Click **Save**

## Step 4: Create an App Password Token

1. After creating the service account, navigate to **Directory** → **Tokens**
2. Click **Create**
3. Configure:

   - **User**: Select the service account you just created
   - **Intent**: Select **App password**
   - **Identifier**: `github-action-token` (or any descriptive name)
   - **Description**: `Token for GitHub Actions to authenticate with OpenHands`
   - **Expiring**: Configure based on your security policy

4. Click **Save**
5. **Important**: Copy the token value immediately - you won't be able to see it again!
   - This is your `OPENHANDS_AUTHENTIK_SERVICE_ACCOUNT_TOKEN`

## Step 5: Grant Application Access

1. Navigate to **Directory** → **Groups**
2. Either:
   - Add the service account to an existing group that has access to the application
   - Or create application-specific bindings:
     1. Go to **Applications** → **Applications**
     2. Select your OpenHands application
     3. Click on **Policy Bindings**
     4. Add a binding for the service account user

## Step 6: Configure GitHub Secrets

In your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following repository secrets:

| Secret Name                                    | Description                         | Example Value                      |
| ---------------------------------------------- | ----------------------------------- | ---------------------------------- |
| `OPENHANDS_AUTHENTIK_BASE_URL`                 | Base URL of your Authentik instance | `https://auth.yourdomain.com`      |
| `OPENHANDS_AUTHENTIK_CLIENT_ID`                | Client ID from the OAuth2 provider  | `openhands-github-action`          |
| `OPENHANDS_AUTHENTIK_SERVICE_ACCOUNT_USERNAME` | Username of the service account     | `github-openhands-service-account` |
| `OPENHANDS_AUTHENTIK_SERVICE_ACCOUNT_TOKEN`    | App password token you copied       | `ak_pat_xxxxxxxxxxxxx`             |
| `OPENHANDS_API_HOSTNAME`                       | URL of your OpenHands instance      | `https://openhands.yourdomain.com` |
| `OPENHANDS_ALLOWED_TRIGGER_USERS`              | Comma-separated GitHub usernames    | `jappyjan,otheruser`               |

## Step 7: Deploy the Workflow

1. Copy the `send-to-openhands-v2.yml` workflow file to `.github/workflows/` in your repository
2. Commit and push the changes
3. The workflow will trigger when authorized users comment `@ai` on issues

## Authentication Flow Explained

1. **Service Account Authentication**: The workflow uses a service account with an app password token
2. **Client Credentials Grant**: Uses OAuth2 client_credentials grant type with username/password
3. **Token Exchange**: Authentik validates the credentials and returns a JWT access token
4. **API Authentication**: The JWT is used to authenticate requests to OpenHands

## Troubleshooting

### Common Issues

1. **"invalid_grant" error**

   - Verify the service account username is correct
   - Ensure the token is an "App password" type (not API token)
   - Check that the token hasn't expired
   - Verify the service account has access to the application

2. **401 Unauthorized**

   - Check that all secrets are properly configured
   - Verify the Authentik base URL is correct (no trailing slash)
   - Ensure the client ID matches the provider configuration

3. **Token not working**
   - App passwords are different from API tokens in Authentik
   - Make sure you selected "App password" as the intent when creating the token
   - The token should start with `ak_pat_`

### Debug Tips

1. **Enable debug logging**: Add `-v` flag to curl commands for verbose output
2. **Check Authentik logs**: Look for authentication attempts in Authentik's event log
3. **Validate token manually**: Test the authentication with curl:

```bash
curl -X POST https://your-authentik.com/application/o/token/ \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=your-client-id" \
  -d "username=service-account-username" \
  -d "password=app-password-token" \
  -d "scope=openid profile"
```

## Security Best Practices

1. **Limit Service Account Permissions**: Only grant the minimum required permissions
2. **Rotate Tokens Regularly**: Set expiration dates and rotate tokens periodically
3. **Restrict Trigger Users**: Only allow trusted users to trigger the workflow
4. **Use HTTPS**: Always use HTTPS for Authentik and OpenHands instances
5. **Monitor Usage**: Regular check Authentik's audit logs for the service account

## Additional Resources

- [Authentik Documentation - Client Credentials](https://docs.goauthentik.io/docs/add-secure-apps/providers/oauth2/client_credentials)
- [Authentik Documentation - Service Accounts](https://docs.goauthentik.io/docs/user-group-role/user)
- [OAuth2 Client Credentials Flow](https://oauth.net/2/grant-types/client-credentials/)
