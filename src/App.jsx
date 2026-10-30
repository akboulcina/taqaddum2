import { useState } from 'react';
import AppShell from './app/AppShell.jsx';
import LoginPage from './features/auth/LoginPage.jsx';
import { getRoute } from './app/routes.jsx';
import { useApp } from './context/AppContext.jsx';

// Everything that needs a signed-in persona lives below this component. Because it
// is unmounted on logout, route and module state are reset for the next session.
function AuthenticatedApp() {
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const route = getRoute(activeRoute);

  return <AppShell activeRoute={activeRoute} onNavigate={setActiveRoute} route={route} />;
}

export default function App() {
  const { isAuthenticated } = useApp();

  // Route guard (demo-only, see AppContext): protected routes never render while logged out.
  return isAuthenticated ? <AuthenticatedApp /> : <LoginPage />;
}
