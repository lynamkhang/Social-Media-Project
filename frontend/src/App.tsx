import { BrowserRouter, Route, Routes } from "react-router";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";
import { Toaster } from "sonner";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/signin" element={<SigninPage />} />

          <Route path="/signup" element={<SignupPage />} />
          {/* protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
