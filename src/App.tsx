import { Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { FeedPage } from "./pages/FeedPage";
import { PropertyDetailsPage } from "./pages/PropertyDetailsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ChatPage } from "./pages/ChatPage";
import { CreateListingPage } from "./pages/CreateListingPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ComingSoon } from "./pages/ComingSoon";
import { ServicesPage } from "./pages/ServicesPage";
import { FaqPage } from "./pages/FaqPage";
import { useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import "./App.css";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/feed" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/feed" /> : <RegisterPage />} />

      <Route path="/feed" element={<FeedPage />} />

      <Route path="/property/:id" element={<PropertyDetailsPage />} />

      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />

      <Route path="/chat" element={
        <ProtectedRoute>
          <ChatPage />
        </ProtectedRoute>
      } />

      <Route path="/create-listing" element={
        <ProtectedRoute>
          <CreateListingPage />
        </ProtectedRoute>
      } />

      <Route path="/hotels" element={<ComingSoon title="Hotels" />} />
      <Route path="/guest-houses" element={<ComingSoon title="Guest Houses" />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/faq" element={<FaqPage />} />

      <Route path="/settings" element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
