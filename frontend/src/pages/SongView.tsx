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
          <div className="flex flex-col items-center justify-center mb-6 perspective-dramatic">
            <img
              src={songInfo.album_cover_url}
              alt={`${songInfo.track_name} cover`}
              className="w-50vh  rounded-lg object-cover -rotate-y-[-5deg] mb-5"
            />

            <h1 className="text-4xl font-bold mb-4 -rotate-y-[-5deg]">
              {songInfo.track_name}
            </h1>
            <p className="text-xl -rotate-y-[-5deg]">
              {songInfo.artists.join(", ")}
            </p>
          </div>
        </div>
      ) : (
        <h1 className="text-4xl font-bold">No song playing</h1>
      )}
    </div>
  );
}
