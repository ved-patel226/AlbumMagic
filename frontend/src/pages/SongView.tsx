import { useState, useEffect } from "react";

export default function SongView() {
  type SongInfo = {
    track_name: string;
    album_cover_url: string;
    artists: string[];
    album_name: string;
    duration_ms: number;
    progress_ms?: number;
    is_playing: boolean;
  };

  const [songInfo, setSongInfo] = useState<SongInfo | null>(null);

  useEffect(() => {
    const fetchSong = () => {
      fetch("http://localhost:3000/current-song")
        .then((response) => response.json())
        .then((data) => {
          console.log("Current Song Data:", data);

          if (data.track_name) {
            setSongInfo(data as SongInfo);
          } else {
            setSongInfo(null);
          }
        })
        .catch((_) => {
          window.location.href = "/auth";
        });
    };

    fetchSong(); // Run immediately on mount

    const interval = setInterval(fetchSong, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      {songInfo ? (
        <div className="text-center">
          <img
            src={songInfo.album_cover_url}
            alt={`Album cover of ${songInfo.track_name}`}
            className="rounded-full h-50vh object-cover mx-auto"
          />
          <h1 className="text-4xl font-bold mb-4">{songInfo.track_name}</h1>
          <p className="text-xl">{songInfo.artists}</p>
        </div>
      ) : (
        <h1 className="text-4xl font-bold">No song playing</h1>
      )}
    </div>
  );
}
