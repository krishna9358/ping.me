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
import { Architecture } from "./pages/Architecture";
import { Landing } from "./pages/Landing";
import { GuestOnlyRoute, ProtectedRoute } from "./components/AuthRoutes";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background dark text-foreground">
        <Routes>
          <Route path="/" element={<Landing />} />
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
          <Route
            path="/architecture"
            element={<Architecture />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
