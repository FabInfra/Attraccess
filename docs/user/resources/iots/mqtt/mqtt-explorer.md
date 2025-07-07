# MQTTX Web Client for Local Development

## Overview

MQTTX Web is a user-friendly, browser-based MQTT client developed by EMQX. It provides an intuitive interface for connecting to MQTT brokers, subscribing to topics, and publishing messages. It has been added to the development environment to help test and debug the MQTT integration.

## Getting Started

The MQTTX Web client is automatically started as part of the local development environment. When you run `docker-compose -f docker-compose.dev.yml up`, the MQTTX Web container will be started alongside the MQTT broker.

## Accessing MQTTX Web

1. Open your web browser and navigate to [http://localhost:4000](http://localhost:4000)
2. The MQTTX Web interface should load automatically
3. To connect to the MQTT broker, click on "New Connection" and use these settings:
   - Name: `FabAccess MQTT`
   - Host: `localhost`
   - Port: `1883`
   - No username/password (development mode)

## Using MQTTX Web

### Subscribing to Topics

1. After connecting to the broker, go to the "Subscriptions" section
2. Enter a topic to subscribe to (e.g., `resources/#` to subscribe to all resource topics)
3. Click "Subscribe"

### Viewing Messages

The main interface will display all received messages for your subscribed topics in a chat-like view. For each message, you can see:

- The topic
- The message payload
- Timestamp
- QoS level
- Retained flag

### Testing Resource Usage Events

When you mark a resource as "in use" or "not in use" in FabAccess, the system will publish messages to topics following this pattern:

```
resources/{id}/status
```

For example, if you have a resource with ID 42, the topic would be `resources/42/status`.

The message format will be as configured in the MQTT resource settings, typically containing information like:

```json
{
  "status": "in_use",
  "resourceId": 42,
  "resourceName": "3D Printer",
  "timestamp": "2023-05-01T12:34:56.789Z",
  "user": "johndoe"
}
```

### Sending Test Messages

You can send test messages to simulate external systems:

1. Go to the "Publish" section at the bottom of the interface
2. Enter the topic (e.g., `resources/42/status`)
3. Enter the message payload (can be plaintext or JSON)
4. Set other options like QoS and Retain as needed
5. Click "Publish"

## Troubleshooting

If you can't connect to the MQTTX Web client:

1. Make sure the Docker containers are running: `docker-compose -f docker-compose.dev.yml ps`
2. Check the logs for the MQTTX container: `docker-compose -f docker-compose.dev.yml logs mqtt-explorer`
3. Verify the MQTT broker is running: `docker-compose -f docker-compose.dev.yml logs mqtt`
4. Make sure your browser can access http://localhost:4000

## Additional Information

- [MQTTX GitHub Repository](https://github.com/emqx/MQTTX)
- [MQTTX Web Documentation](https://mqttx.app/web-client)
- [EMQX Website](https://www.emqx.io/)
