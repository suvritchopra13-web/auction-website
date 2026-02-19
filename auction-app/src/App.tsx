import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DemoModeEngine } from './components/DemoModeEngine';
import Footer from './components/Footer';
import { LiveTicker } from './components/LiveTicker';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import DashboardBids from './pages/dashboard/DashboardBids';
import DashboardExpired from './pages/dashboard/DashboardExpired';
import DashboardListings from './pages/dashboard/DashboardListings';
import DashboardSold from './pages/dashboard/DashboardSold';
import Home from './pages/Home';
import ListingDetail from './pages/listings/ListingDetail';
import Listings from './pages/listings/Listings';
import NotFound from './pages/NotFound';
import Sell from './pages/Sell';
import SettingsProfile from './pages/settings/SettingsProfile';
import SettingsSecurity from './pages/settings/SettingsSecurity';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <LiveTicker />
          <DemoModeEngine />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/listings/:slug" element={<ListingDetail />} />
              <Route path="/auth/signin" element={<SignIn />} />
              <Route path="/auth/signup" element={<SignUp />} />
              <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
              <Route path="/dashboard" element={<Navigate to="/dashboard/listings" replace />} />
              <Route path="/dashboard/listings" element={<ProtectedRoute><DashboardListings /></ProtectedRoute>} />
              <Route path="/dashboard/sold" element={<ProtectedRoute><DashboardSold /></ProtectedRoute>} />
              <Route path="/dashboard/expired" element={<ProtectedRoute><DashboardExpired /></ProtectedRoute>} />
              <Route path="/dashboard/bids" element={<ProtectedRoute><DashboardBids /></ProtectedRoute>} />
              <Route path="/settings" element={<Navigate to="/settings/profile" replace />} />
              <Route path="/settings/profile" element={<ProtectedRoute><SettingsProfile /></ProtectedRoute>} />
              <Route path="/settings/security" element={<ProtectedRoute><SettingsSecurity /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </AuthProvider>
    </Router>
  );
};

export default App;
