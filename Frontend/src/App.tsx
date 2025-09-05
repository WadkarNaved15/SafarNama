import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loader from './components/Loader';

// Lazy-loaded components
const Intro = lazy(() => import('./Pages/Intro'));
const HomePage = lazy(() => import('./Pages/Homepage'));
const SearchResults = lazy(() => import('./components/SearchResults'));
const DestinationDetail = lazy(() => import('./components/DestinationDetail'));
const PackageDetail = lazy(() => import('./components/PackageDetail'));
const AgentDashboard = lazy(() => import('./components/AgentDashboard'));
const Translator = lazy(() => import('./components/Translator'));

const App: React.FC = () => {
  return (
    <Router>
      {/* Suspense fallback can be a spinner, loader, or just text */}
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Splash Screen shown first */}
          <Route path="/" element={<Intro />} />

          {/* Home page after splash */}
          <Route path="/home" element={<HomePage />} />

          {/* Other routes */}
          <Route path="/search" element={<SearchResults />} />
          <Route path="/destination/:id" element={<DestinationDetail />} />
          <Route path="/package/:id" element={<PackageDetail />} />
          <Route path="/agent" element={<AgentDashboard />} />
          <Route path="/translate" element={<Translator />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
