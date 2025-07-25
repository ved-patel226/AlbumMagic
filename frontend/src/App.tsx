import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Callback from "./pages/Callback";
import AuthRouteWrapper from "./components/AuthRouteWrapper";

function App() {
  return (
    <BrowserRouter>
      <AlbumMagicRoutes />
    </BrowserRouter>
  );
}

function AlbumMagicRoutes() {
  return (
    <>
      <h1 className="text-4xl font-bold text-center mt-8">albummagic</h1>
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex items-center justify-center h-screen">
              <h2 className="text-2xl">Welcome to AlbumMagic!</h2>
            </div>
          }
        />
        <Route
          path="/auth"
          element={
            <AuthRouteWrapper>
              <Auth />
            </AuthRouteWrapper>
          }
        />
        <Route
          path="/auth/callback"
          element={
            <AuthRouteWrapper>
              <Callback />
            </AuthRouteWrapper>
          }
        />
      </Routes>
    </>
  );
}

export default App;
