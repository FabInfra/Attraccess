import { Api } from '@attraccess/api-client';

const api = new Api({
  baseUrl: import.meta.env.NX_API_URL,
});

export default api;
