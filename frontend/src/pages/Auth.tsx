import { useState } from "react";

export default function Auth() {
  const [loading, setLoading] = useState(false);

  const handleSpotifyAuth = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/auth/url");
      const data = await response.json();

      if (data.auth_url) {
        window.location.href = data.auth_url;
      }
    } catch (error) {
      console.error("Failed to get auth URL:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-8">
      <h1 className="text-4xl font-bold">Authenticate with Spotify</h1>
      <p className="text-lg text-gray-300 text-center max-w-md">
        Connect your Spotify account to start discovering and managing your
        music
      </p>
      <button
        onClick={handleSpotifyAuth}
        disabled={loading}
        className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Connecting..." : "Connect to Spotify"}
      </button>
    </div>
  );
}
