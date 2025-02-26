import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Auth0Provider } from '@auth0/auth0-react';

createRoot(document.getElementById('root')!).render(
  <Auth0Provider
      domain="dev-pviw587rqg3dw6a0.us.auth0.com"
      clientId="bEED6qQfkZAhlGm5CAHyXBeiRVYLrwBY"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
    <App />
    </Auth0Provider>
)
