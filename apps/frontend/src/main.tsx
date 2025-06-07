import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './app/app';
import '@attraccess/plugins-frontend-ui';
import { queryClient } from './api/queryClient';
import setupApiParameters from './api';
import { PluginProvider } from './app/plugins/plugin-provider';
import { PWAInstall } from './components/pwaInstall';

setupApiParameters();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <PluginProvider>
        <StrictMode>
          <PWAInstall />
          <App />
        </StrictMode>
      </PluginProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
