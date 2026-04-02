import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { WebsiteDetails } from "./pages/WebsiteDetails";
import { Assistant } from "./components/ui/Assistant";
import { GuestOnlyRoute, ProtectedRoute } from "./components/AuthRoutes";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-900">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={
              <GuestOnlyRoute>
                <Login />
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestOnlyRoute>
                <Signup />
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/website/:id"
            element={
              <ProtectedRoute>
                <WebsiteDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Assistant />
      </div>
    </Router>
  );
}

export default App;
