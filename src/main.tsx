import { createRoot } from 'react-dom/client'
import { RootProvider } from '@utils/rootProvider.tsx'

import App from './App.tsx'

import '@styles/index.css'

createRoot(document.getElementById('root')!).render(
  <RootProvider>
    <App />
  </RootProvider>
)
