export default {
  nameLabel: 'Webhook Name',
  namePlaceholder: 'E.g., Slack Notification',
  urlLabel: 'Webhook URL',
  urlPlaceholder: 'https://example.com/webhook',
  methodLabel: 'HTTP Method',
  headersLabel: 'Headers (JSON object)',
  headersPlaceholder: '{"Content-Type": "application/json"}',
  headersHelp:
    'Specify headers as a JSON object. The Content-Type header will be automatically set to application/json if not specified.',
  eventTriggersLabel: 'Event Triggers',
  sendOnStartLabel: 'Send on resource usage start',
  sendOnStopLabel: 'Send on resource usage stop',
  sendOnTakeoverLabel: 'Send on resource usage takeover',
};
