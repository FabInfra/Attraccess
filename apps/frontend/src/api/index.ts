import { OpenAPI, CreateSessionResponse } from '@attraccess/react-query-client';

function getInferredApiUrl() {
  const frontendUrl = new URL(window.location.href);

  let port = '';
  if (frontendUrl.port) {
    port = `:${frontendUrl.port}`;
  }

  return `${frontendUrl.protocol}//${frontendUrl.hostname}${port}`;
}

export function getBaseUrl() {
  return import.meta.env.VITE_ATTRACCESS_URL || getInferredApiUrl();
}

const setupApiParameters = () => {
  OpenAPI.BASE = getBaseUrl();

  // Check both storage locations
  const authFromLocalStorage = localStorage.getItem('auth');
  const authFromSessionStorage = sessionStorage.getItem('auth');
  const authData = authFromLocalStorage || authFromSessionStorage;

  if (authData) {
    const auth = JSON.parse(authData) as CreateSessionResponse;
    OpenAPI.TOKEN = auth.authToken;
  }
};

export function filenameToUrl(name?: string) {
  if (!name) {
    return undefined;
  }

  if (name.startsWith('http')) {
    return name;
  }

  if (name.startsWith('/')) {
    return `${getBaseUrl()}${name}`;
  }

  return `${getBaseUrl()}/${name}`;
}

export default setupApiParameters;
