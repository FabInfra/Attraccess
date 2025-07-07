# MQTT Integration Deployment Guide

## Overview

The MQTT integration allows FabAccess to publish resource usage status changes to MQTT brokers. This enables integration with IoT devices, home automation systems, and other systems that support MQTT.

## Production Deployment Considerations

### MQTT Broker Selection

When choosing an MQTT broker for production, consider:

1. **Reliability** - Choose a broker with high availability features (clustering, failover)
2. **Security** - Ensure TLS/SSL support and proper authentication mechanisms
3. **Performance** - The broker should handle the expected message load
4. **Monitoring** - Choose a broker that provides monitoring capabilities

Recommended MQTT brokers:

- [Eclipse Mosquitto](https://mosquitto.org/) - Lightweight, suitable for smaller deployments
- [EMQ X](https://www.emqx.io/) - High-performance, highly scalable
- [HiveMQ](https://www.hivemq.com/) - Enterprise-ready with clustering capabilities
- [AWS IoT Core](https://aws.amazon.com/iot-core/) - Managed service for AWS environments
- [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/) - Managed service for Azure environments

### Network Configuration

1. **Firewall Rules**:

   - Allow outbound connections to MQTT brokers (TCP port 1883 for MQTT, 8883 for MQTTS)
   - Consider using a network security group to limit which servers can initiate connections

2. **Connection Pooling**:

   - The application maintains persistent connections to configured MQTT brokers
   - Ensure network equipment doesn't terminate idle connections

3. **DNS Resolution**:
   - Ensure reliable DNS resolution for MQTT broker hostnames
   - Consider using IP addresses in production configurations to avoid DNS issues

### Security Considerations

1. **Use TLS/SSL**:

   - Always enable the `useTls` option in production to encrypt connections
   - Configure proper certificate validation

2. **Authentication**:

   - Use unique credentials for each deployment
   - Follow the principle of least privilege - provide only the permissions needed
   - Rotate credentials regularly

3. **Topic Structure**:

   - Use a specific, unique prefix for all topics (e.g., `company/location/fabaccess/resources/`)
   - Ensure topics don't leak sensitive information

4. **Message Content**:
   - Don't include sensitive user data in published messages
   - Sanitize resource names that might contain sensitive information

### High Availability Setup

1. **Application Redundancy**:

   - When deploying multiple instances of the application, each will maintain its own MQTT connections
   - This provides redundancy for publishing messages

2. **Connection Monitoring**:

   - The application includes built-in monitoring of MQTT connections
   - Review connection stats regularly using the admin API endpoints

3. **Graceful Degradation**:
   - Message publishing failures won't affect the core application functionality
   - Failed messages are queued for retry with configurable parameters

### Configuration Parameters

Configure the following environment variables:

| Variable              | Description                                          | Default | Recommended Value          |
| --------------------- | ---------------------------------------------------- | ------- | -------------------------- |
| `MQTT_MAX_RETRIES`    | Maximum number of retry attempts for failed messages | 3       | 5-10 for production        |
| `MQTT_RETRY_DELAY_MS` | Delay between retry attempts in milliseconds         | 5000    | 10000-30000 for production |
| `DEBUG_MODE`          | Enable detailed debug logging                        | false   | false in production        |

### Monitoring and Alerting

1. **API Endpoints**:

   - `/mqtt/servers/status` - Get status of all MQTT connections
   - `/mqtt/servers/:id/status` - Get status of a specific MQTT connection

2. **Metrics to Monitor**:

   - Connection state (connected/disconnected)
   - Connection failures
   - Message publish success/failure rates
   - Queue size for retry mechanisms

3. **Recommended Alerts**:
   - MQTT connections disconnected for more than 5 minutes
   - Connection failure rate exceeding 10%
   - Message publish failure rate exceeding 5%
   - Messages in retry queue older than 15 minutes

### Troubleshooting

Common issues and solutions:

1. **Connection Failures**:

   - Check network connectivity to MQTT broker
   - Verify credentials are correct
   - Ensure certificates are valid for TLS connections
   - Check broker logs for connection rejections

2. **Message Publishing Failures**:

   - Verify topics have correct permissions
   - Check message size limitations
   - Validate template syntax for topic and message templates

3. **Queued Messages Not Processing**:
   - Ensure the application is running with sufficient resources
   - Check for broker connectivity issues
   - Verify retry configuration parameters

## Backup and Recovery

1. **Configuration Backup**:

   - MQTT server configurations are stored in the database
   - Include these tables in regular database backups
   - Document external MQTT broker configurations separately

2. **Disaster Recovery**:
   - Prioritize restoring core application functionality first
   - MQTT functionality will automatically resume when configurations are restored
   - The system will attempt to reestablish connections on startup

## Performance Tuning

1. **Connection Pooling**:

   - The application maintains one connection per MQTT server
   - Monitor memory usage if connecting to many MQTT servers

2. **Resource Usage**:
   - Monitor CPU and memory usage
   - Each active MQTT connection requires a small amount of memory
   - The retry queue mechanism uses memory proportional to the number of failed messages
