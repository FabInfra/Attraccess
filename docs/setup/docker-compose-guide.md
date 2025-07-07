# Docker Compose Deployment Guide

This guide walks you through setting up FabAccess using Docker Compose, which simplifies the management of Docker containers.

## What is Docker Compose?

Docker Compose is a tool that allows you to define and manage multi-container Docker applications. Even though FabAccess runs in a single container, Docker Compose makes it easier to manage the configuration, startup, and shutdown of your FabAccess instance.

> 💡 **Benefit**: Using Docker Compose means you don't have to remember long Docker commands - all your settings are stored in a simple configuration file.

## Prerequisites

- Docker installed on your system ([Installation Guide](https://docs.docker.com/get-docker/))
- Docker Compose installed ([Installation Guide](https://docs.docker.com/compose/install/))
- Basic familiarity with text editors

## Step-by-Step Deployment

### Step 1: Create a Project Directory

First, create a dedicated directory for your FabAccess deployment:

```bash
# Create a main directory for FabAccess
mkdir -p ~/fabaccess

# Navigate to this directory
cd ~/fabaccess
```

### Step 2: Create Docker Compose Configuration

Create a file named `docker-compose.yml` in your FabAccess directory:

```bash
touch docker-compose.yml
```

Open this file in a text editor and add the following configuration:

```yaml
version: '3'

services:
  fabaccess:
    image: fabaccess/fabaccess:latest
    container_name: fabaccess
    restart: unless-stopped
    ports:
      - '3000:3000'
    environment:
      # Authentication & Security
      - AUTH_JWT_ORIGIN=ENV
      - AUTH_JWT_SECRET=replace_with_a_long_random_string
      - AUTH_SESSION_SECRET=replace_with_another_long_random_string
      - VITE_ATTRACCESS_URL=http://localhost:3000

      # Email Configuration
      - SMTP_SERVICE=SMTP
      - SMTP_FROM=your-email@example.com
      - SMTP_HOST=smtp.example.com
      - SMTP_PORT=587
      - SMTP_USER=your-email-username
      - SMTP_PASS=your-email-password

      # Logging level
      - LOG_LEVELS=error,warn,log
    volumes:
      - ./storage:/app/storage
      - ./plugins:/app/plugins
```

### Choosing an Image Tag

FabAccess provides several Docker image tags to suit different needs. You can specify the desired tag in the `image` field of your `docker-compose.yml` file (e.g., `image: ghcr.io/fabinfra/fabaccess:latest`).

Here are the available tags:

- **`latest`**: This tag always points to the most recent stable release of FabAccess. This is the recommended tag for most users as it provides a balance of new features and stability.
  - Example: `ghcr.io/fabinfra/fabaccess:latest`
- **`nightly-latest`**: This tag points to the latest successful build from the `main` development branch. It includes the newest features and bug fixes but may be less stable than a release version. Use this if you want to try out cutting-edge changes or help with testing.
  - Example: `ghcr.io/fabinfra/fabaccess:nightly-latest`
- **`nightly-<commit_sha>`**: This tag points to a specific build from the `main` branch, identified by its short commit SHA (e.g., `nightly-abcdef1`). This is useful if you need to pin your deployment to a particular nightly version for testing or to avoid a regression introduced in a later nightly build.
  - Example: `ghcr.io/fabinfra/fabaccess:nightly-a1b2c3d`
- **`<version>`** (e.g., `v1.2.3`): This tag points to a specific official release version of FabAccess. Use this if you need to run a specific version of the application.
  - Example: `ghcr.io/fabinfra/fabaccess:v1.0.0`
- **`<version>-<commit_sha>`** (e.g., `v1.2.3-abcdef1`): This tag points to a specific official release version tied to its exact commit SHA. This offers the most precise version pinning.
  - Example: `ghcr.io/fabinfra/fabaccess:v1.0.0-e4f5g6h`

When updating, you can change the tag in your `docker-compose.yml` and then run `docker-compose pull && docker-compose up -d` to fetch and deploy the new version.

> ⚠️ **Security Note**: Replace the placeholder values for `AUTH_JWT_SECRET` and `AUTH_SESSION_SECRET` with strong, random strings. You can generate secure random strings with: `openssl rand -base64 32`

### Step 3: Create Storage Directories

Create directories for FabAccess data that will be mapped to the Docker container:

```bash
mkdir -p storage plugins
```

### Step 4: Customizing Your Configuration

#### Email Configuration

Update the email settings in your `docker-compose.yml` file with your actual SMTP details:

**For Gmail:**

```yaml
# Email Configuration
- SMTP_SERVICE=SMTP
- SMTP_FROM=your-gmail@gmail.com
- SMTP_HOST=smtp.gmail.com
- SMTP_PORT=587
- SMTP_USER=your-gmail@gmail.com
- SMTP_PASS=your-app-password
```

**For Outlook/Office 365:**

```yaml
# Email Configuration
- SMTP_SERVICE=Outlook365
- SMTP_FROM=your-email@outlook.com
- SMTP_USER=your-email@outlook.com
- SMTP_PASS=your-password
```

#### URL Configuration

If you're deploying FabAccess to be accessible from other computers, update the `VITE_ATTRACCESS_URL` with your actual domain or IP address:

```yaml
- VITE_ATTRACCESS_URL=https://fabaccess.yourdomain.com
```

or

```yaml
- VITE_ATTRACCESS_URL=http://your-server-ip:3000
```

### Step 5: Start FabAccess

Once you've configured your `docker-compose.yml` file, start FabAccess with:

```bash
docker-compose up -d
```

This command:

- `-d`: Runs containers in the background (detached mode)

### Step 6: Verify Deployment

Check if FabAccess is running properly:

```bash
docker-compose ps
```

You should see your FabAccess container listed as running.

### Step 7: Access the Application

Open your web browser and go to:

- `http://localhost:3000` (if accessing from the same computer)
- `http://your-server-ip:3000` (if accessing from another computer)

### Managing Your FabAccess Instance

#### View Logs

To see the logs from your FabAccess container:

```bash
docker-compose logs
```

For continuous log monitoring:

```bash
docker-compose logs -f
```

#### Stop FabAccess

To stop your FabAccess instance:

```bash
docker-compose down
```

#### Restart FabAccess

To restart your FabAccess instance:

```bash
docker-compose restart
```

#### Update to the Latest Version

To update FabAccess to the latest version:

```bash
# Pull the latest image
docker-compose pull

# Restart with the new image
docker-compose up -d
```

## Using Environment Files (Alternative Approach)

Instead of putting your environment variables directly in the `docker-compose.yml` file, you can use a separate `.env` file for better security and organization:

1. Create a `.env` file:

```bash
touch .env
```

2. Add your environment variables to this file:

```
# Authentication & Security
AUTH_JWT_ORIGIN=ENV
AUTH_JWT_SECRET=your_secure_jwt_secret
AUTH_SESSION_SECRET=your_secure_session_secret
VITE_ATTRACCESS_URL=http://localhost:3000

# Email Configuration
SMTP_SERVICE=SMTP
SMTP_FROM=your-email@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email-username
SMTP_PASS=your-email-password

# Logging level
LOG_LEVELS=error,warn,log
```

3. Update your `docker-compose.yml` to use this file:

```yaml
version: '3'

services:
  fabaccess:
    image: fabaccess/fabaccess:latest
    container_name: fabaccess
    restart: unless-stopped
    ports:
      - '3000:3000'
    env_file:
      - .env
    volumes:
      - ./storage:/app/storage
      - ./plugins:/app/plugins
```

## Troubleshooting

### Common Issues

1. **Container fails to start**:

   - Check your `docker-compose.yml` for syntax errors
   - Verify all required environment variables are set correctly
   - Check if port 3000 is already in use by another application

2. **Can't access FabAccess in browser**:

   - Verify the container is running with `docker-compose ps`
   - Check if your firewall is blocking port 3000
   - Make sure you're using the correct URL

3. **Email sending fails**:
   - Double-check your SMTP settings
   - Some email providers require allowing "less secure apps" or creating app passwords

### Viewing Detailed Logs

For more detailed troubleshooting, increase the log levels in your configuration:

```yaml
- LOG_LEVELS=error,warn,log,debug,verbose
```

Then restart your container and check the logs:

```bash
docker-compose restart
docker-compose logs -f
```

## Next Steps

After successfully deploying FabAccess, you can:

1. Create an account (the first account is automatically Admin)
2. Enjoy FabAccess!

For more information on using FabAccess, refer to our [User Guide](/user/getting-started.md).
