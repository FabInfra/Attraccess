export default {
  nameLabel: 'Webhook-Name',
  namePlaceholder: 'z.B. Slack-Benachrichtigung',
  urlLabel: 'Webhook-URL',
  urlPlaceholder: 'https://beispiel.de/webhook',
  methodLabel: 'HTTP-Methode',
  headersLabel: 'Header (JSON-Objekt)',
  headersPlaceholder: '{"Content-Type": "application/json"}',
  headersHelp:
    'Header als JSON-Objekt angeben. Der Content-Type-Header wird automatisch auf application/json gesetzt, wenn nicht anders angegeben.',
  eventTriggersLabel: 'Ereignis-Auslöser',
  sendOnStartLabel: 'Senden bei Start der Ressourcennutzung',
  sendOnStopLabel: 'Senden bei Ende der Ressourcennutzung',
  sendOnTakeoverLabel: 'Senden bei Übernahme der Ressourcennutzung',
};
