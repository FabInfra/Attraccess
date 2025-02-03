import { Api } from '@attraccess/api-client';

const api = new Api({
  baseUrl: process.env.NX_API_URL,
});

export default api;
