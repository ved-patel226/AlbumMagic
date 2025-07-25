import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthRouteWrapper from "./components/AuthRouteWrapper";

import Auth from "./pages/Auth";
import Callback from "./pages/Callback";
import SongView from "./pages/SongView";

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
        <Route path="/" element={<SongView />} />
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
