# MQTT Broker Setup Guide

This guide provides practical instructions for setting up and configuring an MQTT broker for use with FabAccess.

## Development Environment Setup

### Using Docker Compose

The easiest way to set up an MQTT broker for development is using the included Docker Compose configuration.

1. Ensure Docker and Docker Compose are installed on your system.

2. Create or modify `config/mosquitto/mosquitto.conf` with the following content:

   ```
   listener 1883
   listener 9001
   protocol websockets

   # Allow anonymous connections for development
   allow_anonymous true

   # Persistence settings
   persistence true
   persistence_location /mosquitto/data/

   # Logging
   log_dest file /mosquitto/log/mosquitto.log
   log_dest stdout
   log_type all
   ```

> [!WARNING]
> The configuration above uses `allow_anonymous true` which is suitable for development environments only. Never use anonymous access in production deployments as it poses significant security risks.

3. Start the development environment with:

   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. Verify the MQTT broker is running:

   ```bash
   docker-compose -f docker-compose.dev.yml ps
   ```

### Manual Installation

#### macOS

1. Install Mosquitto using Homebrew:

   ```bash
   brew install mosquitto
   ```

2. Start the Mosquitto service:

   ```bash
   brew services start mosquitto
   ```

#### Ubuntu/Debian

1. Install Mosquitto:

   ```bash
   sudo apt-get update
   sudo apt-get install -y mosquitto mosquitto-clients
   ```

2. Configure Mosquitto:

   ```bash
   sudo nano /etc/mosquitto/mosquitto.conf
   ```

   Add the following:

   ```
   listener 1883
   allow_anonymous true
   ```

3. Restart the service:

   ```bash
   sudo systemctl restart mosquitto
   ```

## Testing MQTT Connectivity

### Using Mosquitto CLI Tools

> [!NOTE]
> Mosquitto CLI tools provide a quick way to verify your broker configuration before integrating with FabAccess. They're particularly useful for troubleshooting connection issues.

1. Subscribe to a topic:

   ```bash
   mosquitto_sub -h localhost -p 1883 -t "test/topic" -v
   ```

2. Publish a message (in a separate terminal):

   ```bash
   mosquitto_pub -h localhost -p 1883 -t "test/topic" -m "Hello MQTT"
   ```

   You should see "Hello MQTT" appear in the subscription terminal.

### Using MQTT Explorer

[MQTT Explorer](https://mqtt-explorer.com/) is a helpful GUI tool for visualizing MQTT communications.

> [!TIP]
> MQTT Explorer makes it easy to visualize the topic structure and message flow. This can be invaluable for understanding complex MQTT deployments and debugging communication issues.

1. Download and install MQTT Explorer from [mqtt-explorer.com](https://mqtt-explorer.com/)

2. Configure a connection:

   - Host: `localhost`
   - Port: `1883`
   - Leave username and password blank for development

3. Click "Connect" and use the interface to browse topics, publish messages, and monitor activity.

## Production Setup

For production environments, we recommend additional security measures:

> [!ATTENTION]
> Production deployments require proper security configuration. At minimum, you should use authentication and TLS encryption to protect your MQTT communications from unauthorized access and eavesdropping.

### Secure MQTT Configuration

1. Create user credentials:

   ```bash
   sudo mosquitto_passwd -c /etc/mosquitto/passwd fabaccess
   ```

2. Update the configuration:

   ```
   listener 1883
   listener 8883

   # TLS/SSL Configuration
   cafile /etc/mosquitto/certs/ca.crt
   certfile /etc/mosquitto/certs/server.crt
   keyfile /etc/mosquitto/certs/server.key

   # Authentication
   allow_anonymous false
   password_file /etc/mosquitto/passwd
   ```

3. Set up TLS certificates:

   ```bash
   # Generate self-signed certificates for testing
   mkdir -p /etc/mosquitto/certs
   openssl req -new -x509 -days 365 -extensions v3_ca -keyout /etc/mosquitto/certs/ca.key -out /etc/mosquitto/certs/ca.crt

   openssl genrsa -out /etc/mosquitto/certs/server.key 2048
   openssl req -new -out /etc/mosquitto/certs/server.csr -key /etc/mosquitto/certs/server.key
   openssl x509 -req -in /etc/mosquitto/certs/server.csr -CA /etc/mosquitto/certs/ca.crt -CAkey /etc/mosquitto/certs/ca.key -CAcreateserial -out /etc/mosquitto/certs/server.crt -days 365
   ```

> [!WARNING]
> Self-signed certificates should only be used for testing. For production, use certificates from a trusted Certificate Authority or consider using Let's Encrypt.

### Running with Docker in Production

1. Create a production Docker Compose file:

   ```yaml
   version: '3'

   services:
     mqtt:
       image: eclipse-mosquitto:2.0
       ports:
         - '1883:1883'
         - '8883:8883'
       volumes:
         - ./config/mosquitto/mosquitto.conf:/mosquitto/config/mosquitto.conf
         - ./config/mosquitto/passwd:/mosquitto/config/passwd
         - ./config/mosquitto/certs:/mosquitto/config/certs
         - ./data/mosquitto:/mosquitto/data
         - ./log/mosquitto:/mosquitto/log
       restart: unless-stopped
   ```

2. Configure FabAccess to use TLS and authentication for connecting to the MQTT broker.

## Cloud-Based MQTT Brokers

For a managed solution, consider using cloud-based MQTT services:

1. [HiveMQ Cloud](https://www.hivemq.com/mqtt-cloud-broker/)
2. [CloudMQTT](https://www.cloudmqtt.com/)
3. [AWS IoT Core](https://aws.amazon.com/iot-core/)

These services typically provide:

- TLS/SSL security by default
- Authentication and access control
- High availability and scalability
- Usage metrics and monitoring

## Configuring FabAccess with MQTT Broker

Once your MQTT broker is running:

1. Navigate to the MQTT Server management page in FabAccess.

2. Add a new MQTT server with:

   - Name: A friendly name (e.g., "Development MQTT Broker")
   - Host: Your broker hostname or IP (e.g., `localhost` for development)
   - Port: The MQTT port (typically `1883` for unencrypted, `8883` for TLS)
   - Client ID: Optionally specify a client ID or leave blank for auto-generation
   - Username/Password: Fill in if your broker requires authentication
   - Use TLS/SSL: Enable if connecting to a secure broker

3. Test the connection to verify it's working.

4. Add MQTT configuration to your resources to start publishing messages.

> [!NOTE]
> FabAccess will maintain a persistent connection to your MQTT broker. If the connection is lost, it will automatically attempt to reconnect using an exponential backoff strategy.
