import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { ThirdwebProvider } from '@thirdweb-dev/react'
import Home from './Home'
import App from './App'
import UserProfile from './pages/UserProfile'
import { ClerkProvider} from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}
createRoot(document.getElementById('root')).render(
  <ThirdwebProvider>
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
   <StrictMode>
    <App />
  </StrictMode>
  </ClerkProvider>
  </ThirdwebProvider>
)
