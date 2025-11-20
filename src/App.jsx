import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet, useParams, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { InstanceProvider } from './context/InstanceContext';
import GlobalStyles from './styles/GlobalStyles';
import { lightTheme, darkTheme } from './styles/Theme';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import ClientScheduling from './features/salon/ClientScheduling';
import AdminDashboard from './features/dashboard/AdminDashboard';
import SuperAdminDashboard from './features/dashboard/SuperAdminDashboard';
import OrderSystem from './pages/OrderSystem';
import Chat from './components/Chat';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';
import LoginComponent from './components/LoginComponent';
import UserLogin from './features/auth/UserLogin';
import InstanceLogin from './features/auth/InstanceLogin';
import ProtectedRoute from './components/ProtectedRoute';
import AppointmentConfirmation from './pages/AppointmentConfirmation';
import TrendDetails from './pages/TrendDetails';
import CouponPage from './features/salon/CouponPage';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import LandingPage from './pages/LandingPage/LandingPage';
import UserSetup from './features/auth/UserSetup';

const MainContent = styled.main`
  padding-top: 60px;
  min-height: calc(100vh - 60px);
`;

function AppContent({ withHeader = true }) {
  const { theme, isDarkMode } = useTheme();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <StyledThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      {withHeader && <Header />}
      <MainContent>
        <Outlet />
      </MainContent>
      <Chat />
      <Footer />
    </StyledThemeProvider>
  );
}

const InstanceWrapper = ({ children }) => {
    return (
        <InstanceProvider>
            {children}
        </InstanceProvider>
    );
};

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Routes that DON'T need instance data */}
            <Route element={<AppContent />}>
                <Route path="/login" element={<UserLogin />} />
                <Route path="/admin-login" element={<LoginComponent />} />
                <Route path="/:username/login" element={<InstanceLogin />} />
                <Route path="/super-admin" element={
                    <ProtectedRoute superAdminOnly={true}>
                        <SuperAdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/" element={<LandingPage />} />
            </Route>

            {/* Routes that DO need instance data */}
            <Route element={<InstanceWrapper><AppContent /></InstanceWrapper>}>
                <Route path="/:username/setup" element={<UserSetup />} />
                <Route path="/:username">
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="schedule" element={<ClientScheduling />} />
                    <Route path="admin" element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="order" element={<OrderSystem />} />
                    <Route path="appointment-confirmation/:id" element={<AppointmentConfirmation />} />
                    <Route path="carousel/:id" element={<TrendDetails />} />
                    <Route path="coupon" element={<CouponPage />} />
                    <Route path="services" element={<Services />} />
                    <Route path="gallery" element={<Gallery />} />
                </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
