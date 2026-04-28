import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { inject } from '@vercel/analytics';
import posthog from 'posthog-js';
import { PostHogProvider, PostHogErrorBoundary } from '@posthog/react';
import App from './App.tsx';
import './index.css';

inject();

posthog.init(import.meta.env.VITE_POSTHOG_KEY ?? '', {
  api_host: import.meta.env.VITE_POSTHOG_HOST ?? 'https://eu.i.posthog.com',
  person_profiles: 'always',          // rastreia utilizadores anónimos e identificados
  capture_pageview: true,             // pageviews automáticos
  capture_pageleave: true,            // saídas de página
  autocapture: true,                  // captura todos os cliques, inputs e submissões
  capture_heatmaps: true,             // heatmaps de cliques
  session_recording: {
    maskAllInputs: false,             // grava inputs (exceto passwords que são sempre mascaradas)
    maskInputOptions: { password: true },
  },
  enable_heatmaps: true,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <PostHogErrorBoundary>
        <App />
      </PostHogErrorBoundary>
    </PostHogProvider>
  </StrictMode>,
);
