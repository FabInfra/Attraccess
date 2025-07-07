import { WebhookConfigResponseDto } from '@fabaccess/react-query-client';

// Define WebhookHttpMethod enum matching the backend
export enum WebhookHttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

// Form values interface
export interface WebhookFormValues {
  name: string;
  url: string;
  method: WebhookHttpMethod;
  headers: string;
  inUseTemplate: string;
  notInUseTemplate: string;
  takeoverTemplate: string; // Added
  active: boolean;
  sendOnStart: boolean; // Added
  sendOnStop: boolean; // Added
  sendOnTakeover: boolean; // Added
  retryEnabled: boolean;
  maxRetries: number;
  retryDelay: number;
  signatureHeader: string;
}

// Example templates
export const exampleTemplates = {
  inUse:
    '{"status": "in_use", "resourceId": {{id}}, "resourceName": "{{name}}", "timestamp": "{{timestamp}}", "user": {"username": "{{user.username}}", "externalIdentifier": "{{user.externalIdentifier}}"}}',
  notInUse: '{"status": "not_in_use", "resourceId": {{id}}, "resourceName": "{{name}}", "timestamp": "{{timestamp}}"}',
};

// Default form values
export const defaultFormValues: WebhookFormValues = {
  name: '',
  url: 'https://',
  method: WebhookHttpMethod.POST,
  headers: '{}',
  inUseTemplate: exampleTemplates.inUse,
  notInUseTemplate: exampleTemplates.notInUse,
  takeoverTemplate:
    '{"status": "taken_over", "resourceId": {{id}}, "resourceName": "{{name}}", "timestamp": "{{timestamp}}", "newUser": {"username": "{{user.username}}", "externalIdentifier": "{{user.externalIdentifier}}"}, "previousUser": {"username": "{{previousUser.username}}", "externalIdentifier": "{{previousUser.externalIdentifier}}"}}', // Added
  active: true,
  sendOnStart: true, // Added
  sendOnStop: true, // Added
  sendOnTakeover: false, // Added
  retryEnabled: false,
  maxRetries: 3,
  retryDelay: 1000,
  signatureHeader: 'X-Webhook-Signature',
};

// Template variables documentation
export const templateVariables = [
  { name: 'id', description: 'Resource ID', example: '42' },
  { name: 'name', description: 'Resource name', example: '3D Printer' },
  {
    name: 'timestamp',
    description: 'Current timestamp in ISO format',
    example: '2023-05-01T12:34:56.789Z',
  },
  { name: 'user.id', description: 'User ID (if available)', example: '123' },
  {
    name: 'user.username',
    description: 'Username (if available)',
    example: 'johndoe',
  },
  {
    name: 'user.externalIdentifier',
    description: 'User external identifier (if available)',
    example: 'john.doe@company.com',
  },
  { name: 'previousUser.id', description: 'Previous User ID (if available, on takeover)', example: '456' },
  {
    name: 'previousUser.username',
    description: 'Previous Username (if available, on takeover)',
    example: 'janedoe',
  },
  {
    name: 'previousUser.externalIdentifier',
    description: 'Previous User external identifier (if available, on takeover)',
    example: 'jane.doe@company.com',
  },
];

/**
 * Helper to convert a webhook response to form values
 */
export const webhookToFormValues = (webhook: WebhookConfigResponseDto): WebhookFormValues => {
  // Parse headers if it's a string
  let parsedHeaders = '{}';
  if (webhook.headers) {
    try {
      // If headers is already a string, use it as is
      if (typeof webhook.headers === 'string') {
        parsedHeaders = webhook.headers;
      } else {
        // If headers is an object, stringify it
        parsedHeaders = JSON.stringify(webhook.headers);
      }
    } catch (e) {
      console.error('Error parsing headers:', e);
    }
  }

  return {
    name: webhook.name,
    url: webhook.url,
    method: webhook.method as WebhookHttpMethod,
    headers: parsedHeaders,
    inUseTemplate: webhook.inUseTemplate,
    notInUseTemplate: webhook.notInUseTemplate,
    takeoverTemplate: webhook.takeoverTemplate || defaultFormValues.takeoverTemplate, // Added
    active: webhook.active,
    sendOnStart: webhook.sendOnStart === undefined ? true : webhook.sendOnStart, // Added, default true
    sendOnStop: webhook.sendOnStop === undefined ? true : webhook.sendOnStop, // Added, default true
    sendOnTakeover: webhook.sendOnTakeover === undefined ? false : webhook.sendOnTakeover, // Added, default false
    retryEnabled: webhook.retryEnabled,
    maxRetries: webhook.maxRetries,
    retryDelay: webhook.retryDelay,
    signatureHeader: webhook.signatureHeader || 'X-Webhook-Signature',
  };
};
