import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { LoadoutPage } from './pages/LoadoutPage';
import { MissionsPage } from './pages/MissionsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { HideoutPage } from './pages/HideoutPage';
import { SkillsPage } from './pages/SkillsPage';
import { useStore } from './store/useStore';
import { storage } from './services/storage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hour
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: 2,
      retryDelay: 1000,
    },
  },
});

function App() {
  const initialize = useStore((state) => state.initialize);

  useEffect(() => {
    // Initialize storage and load data from localStorage
    storage.initialize();
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="loadout" element={<LoadoutPage />} />
            <Route path="missions" element={<MissionsPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="hideout" element={<HideoutPage />} />
            <Route path="skills" element={<SkillsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
