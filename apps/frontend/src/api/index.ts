import { Api, AuthControllerPostSessionData } from '@attraccess/api-client';

function getInferredApiUrl() {
  const frontendUrl = new URL(window.location.href);

  let port = '';
  if (frontendUrl.port) {
    port = `:${frontendUrl.port}`;
  }

  return `${frontendUrl.protocol}//${frontendUrl.hostname}${port}`;
}

function getBaseUrl() {
  return import.meta.env.VITE_API_URL || getInferredApiUrl();
}

const getApi = () => {
  const api = new Api<{ token?: string }>({
    baseUrl: getBaseUrl(),
    securityWorker: (config) => {
      return {
        headers: {
          Authorization: `Bearer ${config?.token}`,
        },
      };
    },
  });

  // Check both storage locations
  const authFromLocalStorage = localStorage.getItem('auth');
  const authFromSessionStorage = sessionStorage.getItem('auth');
  const authData = authFromLocalStorage || authFromSessionStorage;

  if (authData) {
    const auth = JSON.parse(authData) as AuthControllerPostSessionData;
    api.setSecurityData({
      token: auth.authToken,
    });
  }

  return api;
};

export function filenameToUrl(name: string) {
  console.log(getBaseUrl(), name);
  return `${getBaseUrl()}${name}`;
}

export default getApi;
