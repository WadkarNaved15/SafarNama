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
const LoginPage = lazy(() => import('./Pages/LoginPage'));
const RegisterPage = lazy(() => import('./Pages/RegisterPage'));
const BookingsPage = lazy(() => import('./Pages/BookingsPage'));
const SafeRoute = lazy(() => import('./Pages/SafeRoute'));
const ChatPage = lazy(() => import('./Pages/ChatPage'));

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

          {/* Login page */}
          <Route path="/login" element={<LoginPage />} />
          {/* Registration page */}
          <Route path="/register" element={<RegisterPage />} />
          {/* Booking page */}
          <Route path="/my-bookings" element={<BookingsPage />} />

          {/* Other routes */}
          <Route path="/search" element={<SearchResults />} />
          <Route path="/destination/:id" element={<DestinationDetail />} />
          <Route path="/package/:id" element={<PackageDetail />} />
          <Route path="/agent" element={<AgentDashboard />} />
          <Route path="/translate" element={<Translator />} />
          <Route path="/safe-route" element={<SafeRoute />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
