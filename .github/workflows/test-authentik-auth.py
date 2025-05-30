#!/usr/bin/env python3
"""
Test script for validating Authentik authentication configuration.
This script helps verify that your Authentik setup is working correctly
before using it in GitHub Actions.

Usage:
    python test-authentik-auth.py

Set the following environment variables before running:
    AUTHENTIK_BASE_URL
    AUTHENTIK_CLIENT_ID
    AUTHENTIK_SERVICE_ACCOUNT_USERNAME
    AUTHENTIK_SERVICE_ACCOUNT_TOKEN
"""

import os
import sys
import json
import requests
from urllib.parse import urljoin


def test_authentik_auth():
    """Test Authentik authentication with client credentials flow."""
    
    # Get configuration from environment
    base_url = os.environ.get('AUTHENTIK_BASE_URL')
    client_id = os.environ.get('AUTHENTIK_CLIENT_ID')
    username = os.environ.get('AUTHENTIK_SERVICE_ACCOUNT_USERNAME')
    password = os.environ.get('AUTHENTIK_SERVICE_ACCOUNT_TOKEN')
    
    # Validate required environment variables
    missing = []
    if not base_url:
        missing.append('AUTHENTIK_BASE_URL')
    if not client_id:
        missing.append('AUTHENTIK_CLIENT_ID')
    if not username:
        missing.append('AUTHENTIK_SERVICE_ACCOUNT_USERNAME')
    if not password:
        missing.append('AUTHENTIK_SERVICE_ACCOUNT_TOKEN')
    
    if missing:
        print("❌ Missing required environment variables:")
        for var in missing:
            print(f"   - {var}")
        print("\nPlease set all required environment variables and try again.")
        return False
    
    # Prepare the token endpoint URL
    token_endpoint = urljoin(base_url, '/application/o/token/')
    
    print("🔧 Testing Authentik authentication...")
    print(f"   Base URL: {base_url}")
    print(f"   Client ID: {client_id}")
    print(f"   Username: {username}")
    print(f"   Token: {password[:10]}..." if len(password) > 10 else "Token: ***")
    print(f"   Token endpoint: {token_endpoint}")
    print()
    
    # Prepare the request
    data = {
        'grant_type': 'client_credentials',
        'client_id': client_id,
        'username': username,
        'password': password,
        'scope': 'openid profile'
    }
    
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    
    try:
        # Make the token request
        print("📡 Sending token request...")
        response = requests.post(token_endpoint, data=data, headers=headers)
        
        print(f"   HTTP Status: {response.status_code}")
        
        if response.status_code == 200:
            token_data = response.json()
            print("✅ Authentication successful!")
            print()
            print("📋 Token Information:")
            print(f"   Token Type: {token_data.get('token_type', 'N/A')}")
            print(f"   Expires In: {token_data.get('expires_in', 'N/A')} seconds")
            print(f"   Scope: {token_data.get('scope', 'N/A')}")
            
            # Get the access token
            access_token = token_data.get('access_token')
            if access_token:
                print(f"   Access Token: {access_token[:50]}..." if len(access_token) > 50 else f"   Access Token: {access_token}")
                
                # Decode JWT payload (without verification, just for display)
                try:
                    import base64
                    # Split the JWT and decode the payload
                    parts = access_token.split('.')
                    if len(parts) >= 2:
                        # Add padding if needed
                        payload = parts[1]
                        payload += '=' * (4 - len(payload) % 4)
                        decoded = base64.urlsafe_b64decode(payload)
                        payload_data = json.loads(decoded)
                        
                        print()
                        print("📄 JWT Payload:")
                        print(f"   Subject: {payload_data.get('sub', 'N/A')}")
                        print(f"   Preferred Username: {payload_data.get('preferred_username', 'N/A')}")
                        print(f"   Issuer: {payload_data.get('iss', 'N/A')}")
                        print(f"   Audience: {payload_data.get('aud', 'N/A')}")
                except Exception as e:
                    print(f"   (Could not decode JWT payload: {e})")
            
            return True
            
        else:
            print("❌ Authentication failed!")
            print(f"   Response: {response.text}")
            
            # Try to parse error response
            try:
                error_data = response.json()
                print()
                print("📋 Error Details:")
                print(f"   Error: {error_data.get('error', 'N/A')}")
                print(f"   Description: {error_data.get('error_description', 'N/A')}")
            except:
                pass
            
            print()
            print("🔍 Common issues:")
            print("   1. Check that the service account username is correct")
            print("   2. Ensure the token is an 'App password' type (not API token)")
            print("   3. Verify the service account has access to the application")
            print("   4. Check that the token hasn't expired")
            
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed!")
        print(f"   Could not connect to {token_endpoint}")
        print("   Please check that the URL is correct and the server is accessible.")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False


def main():
    """Main function."""
    print("🔐 Authentik Authentication Test Script")
    print("=" * 50)
    print()
    
    success = test_authentik_auth()
    
    print()
    print("=" * 50)
    if success:
        print("✅ All tests passed! Your Authentik configuration is working correctly.")
        sys.exit(0)
    else:
        print("❌ Tests failed. Please check your configuration and try again.")
        sys.exit(1)


if __name__ == "__main__":
    main() 