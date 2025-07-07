# MQTT Integration Examples

This document provides practical examples of using FabAccess's MQTT integration feature with common IoT platforms and devices.

## Topic and Message Templates

### Topic Naming Best Practices

Good MQTT topic design follows these principles:

1. **Hierarchical Structure**: Use forward slashes (/) to create a logical hierarchy
2. **Specific to General**: Start with specific identifiers and move to more general categories
3. **Lowercase Letters**: Use lowercase for consistency
4. **No Spaces**: Use hyphens or underscores instead of spaces
5. **Include Identifiers**: Include resource IDs or names for uniqueness

### Example Topic Structures

```
fabaccess/resources/{resourceId}/status
organization/resources/{resourceName}/usage
site/{location}/resource/{resourceId}/state
department/{departmentName}/resources/{resourceName}/status
```

### Message Format Examples

#### Simple Status Messages

```json
{ "status": "in_use" }
```

```json
{ "status": "available" }
```

#### Detailed Status Messages

```json
{
  "status": "in_use",
  "resource": {
    "id": {{id}},
    "name": "{{name}}"
  },
  "user": {
    "id": {{user.id}},
    "name": "{{user.name}}"
  },
  "startTime": "{{timestamp}}",
  "expectedEndTime": "{{expectedEndTime}}"
}
```

#### Boolean Commands

```json
{ "power": true }
```

```json
{ "power": false }
```

## Integration Examples

### 1. Home Assistant Integration

[Home Assistant](https://www.home-assistant.io/) is a popular open-source home automation platform.

#### MQTT Configuration

**Server Configuration:**

- Host: Your Home Assistant MQTT broker address
- Port: 1883 (or 8883 for TLS)
- Username/Password: As configured in Home Assistant

**Resource Configuration:**

- In-Use Topic: `homeassistant/switch/resource_{{id}}/state`
- In-Use Message: `ON`
- Not-In-Use Topic: `homeassistant/switch/resource_{{id}}/state`
- Not-In-Use Message: `OFF`

#### Configuration in Home Assistant

Add this to your `configuration.yaml`:

```yaml
mqtt:
  switch:
    - name: 'Resource {{id}}'
      state_topic: 'homeassistant/switch/resource_{{id}}/state'
      command_topic: 'homeassistant/switch/resource_{{id}}/set'
      payload_on: 'ON'
      payload_off: 'OFF'
      icon: mdi:desktop-tower-monitor
```

### 2. Node-RED Integration

[Node-RED](https://nodered.org/) is a flow-based programming tool for IoT.

#### MQTT Configuration

**Server Configuration:**

- Host: Your Node-RED MQTT broker address
- Port: 1883
- Authentication as needed

**Resource Configuration:**

- In-Use Topic: `resources/{{id}}/status`
- In-Use Message: `{"status": "in_use", "resourceId": {{id}}, "timestamp": "{{timestamp}}"}`
- Not-In-Use Topic: `resources/{{id}}/status`
- Not-In-Use Message: `{"status": "available", "resourceId": {{id}}, "timestamp": "{{timestamp}}"}`

#### Node-RED Flow Example

```json
[
  {
    "id": "mqtt-in",
    "type": "mqtt in",
    "topic": "resources/+/status",
    "qos": "2",
    "wires": [["json-parser"]]
  },
  {
    "id": "json-parser",
    "type": "json",
    "wires": [["status-switch"]]
  },
  {
    "id": "status-switch",
    "type": "switch",
    "property": "payload.status",
    "rules": [
      { "t": "eq", "v": "in_use" },
      { "t": "eq", "v": "available" }
    ],
    "wires": [["in-use-handler"], ["available-handler"]]
  }
]
```

### 3. Smart Plugs / Smart Power Outlets

#### MQTT Configuration for Tasmota-based Smart Plugs

**Server Configuration:**

- Standard MQTT settings

**Resource Configuration:**

- In-Use Topic: `cmnd/tasmota_{{id}}/POWER`
- In-Use Message: `ON`
- Not-In-Use Topic: `cmnd/tasmota_{{id}}/POWER`
- Not-In-Use Message: `OFF`

#### MQTT Configuration for Shelly Smart Plugs

**Resource Configuration:**

- In-Use Topic: `shellies/shelly-plug-{{id}}/relay/0/command`
- In-Use Message: `on`
- Not-In-Use Topic: `shellies/shelly-plug-{{id}}/relay/0/command`
- Not-In-Use Message: `off`

### 4. Status Displays (E-Ink or LCD)

For displays showing real-time resource availability:

**Resource Configuration:**

- In-Use Topic: `displays/{{id}}/status`
- In-Use Message:
  ```json
  {
    "status": "OCCUPIED",
    "resourceName": "{{name}}",
    "user": "{{user.name}}",
    "startTime": "{{timestamp}}",
    "message": "Currently in use by {{user.name}}"
  }
  ```
- Not-In-Use Topic: `displays/{{id}}/status`
- Not-In-Use Message:
  ```json
  {
    "status": "AVAILABLE",
    "resourceName": "{{name}}",
    "lastUser": "{{user.name}}",
    "lastUsed": "{{timestamp}}",
    "message": "Available for use"
  }
  ```

### 5. IoT Platform Integration (AWS IoT)

**Resource Configuration:**

- In-Use Topic: `aws/things/resource-{{id}}/shadow/update`
- In-Use Message:
  ```json
  {
    "state": {
      "reported": {
        "status": "in_use",
        "user": "{{user.id}}",
        "lastStateChange": "{{timestamp}}"
      }
    }
  }
  ```
- Not-In-Use Topic: `aws/things/resource-{{id}}/shadow/update`
- Not-In-Use Message:
  ```json
  {
    "state": {
      "reported": {
        "status": "available",
        "lastUser": "{{user.id}}",
        "lastStateChange": "{{timestamp}}"
      }
    }
  }
  ```

## Advanced Template Examples

### Using Conditionals

**Message with Conditional User Information:**

```json
{
  "status": "in_use",
  "resourceId": {{id}},
  "timestamp": "{{timestamp}}",
  {{#if user}}
  "user": {
    "id": {{user.id}},
    "name": "{{user.name}}"
  }
  {{else}}
  "user": null
  {{/if}}
}
```

### Using Helpers and Formatters

**Formatting Timestamps:**

```json
{
  "status": "in_use",
  "resourceId": {{id}},
  "startTimeISO": "{{timestamp}}",
  "startTimeFormatted": "{{formatDate timestamp 'YYYY-MM-DD HH:mm'}}"
}
```

### Using JSON Attributes

For complex data structures:

```json
{
  "resource": {
    "id": {{id}},
    "name": "{{name}}",
    "type": "{{resourceType}}",
    "location": "{{location}}"
  },
  "status": {{#if inUse}}"occupied"{{else}}"available"{{/if}},
  "usage": {
    "current": {{#if user}}true{{else}}false{{/if}},
    "user": {{#if user}}{
      "id": {{user.id}},
      "name": "{{user.name}}"
    }{{else}}null{{/if}},
    "startTime": {{#if startTime}}"{{startTime}}"{{else}}null{{/if}},
    "expectedEndTime": {{#if endTime}}"{{endTime}}"{{else}}null{{/if}}
  },
  "lastUpdate": "{{timestamp}}"
}
```

## Testing Your Integration

To verify your MQTT integration is working correctly:

1. Configure your MQTT server and resource in FabAccess
2. Set up an MQTT client to subscribe to your topics:
   ```bash
   mosquitto_sub -h localhost -p 1883 -t "resources/#" -v
   ```
3. Start and end resource usage in FabAccess
4. Verify the messages are received in the expected format

This approach helps troubleshoot issues before connecting to actual IoT devices.
