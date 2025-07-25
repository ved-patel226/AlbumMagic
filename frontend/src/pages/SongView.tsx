import { useState, useEffect } from "react";
import { FaFastBackward, FaFastForward } from "react-icons/fa";

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
  const [simulatedProgress, setSimulatedProgress] = useState<number>(0);
  const [mouseX, setMouseX] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(false);

  useEffect(() => {
    const fetchSong = () => {
      fetch("http://localhost:3000/current-song")
        .then((response) => response.json())
        .then((data) => {
          console.log("Current Song Data:", data);

          if (data.track_name) {
            setSongInfo(data as SongInfo);
            // Reset simulated progress to actual progress when we get new data
            setSimulatedProgress(data.progress_ms || 0);
          } else {
            setSongInfo(null);
            setSimulatedProgress(0);
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

  // Simulate progress between API calls
  useEffect(() => {
    if (!songInfo || !songInfo.is_playing) return;

    const progressInterval = setInterval(() => {
      setSimulatedProgress((prev) => {
        const newProgress = prev + 100; // Add 100ms every 100ms
        return songInfo.duration_ms
          ? Math.min(newProgress, songInfo.duration_ms)
          : newProgress;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [songInfo?.is_playing, songInfo?.duration_ms]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setShowControls(true);
    };

    const handleMouseLeave = () => {
      setShowControls(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const screenWidth = window.innerWidth;
  const leftBoundary = screenWidth * 0.375; // 37.5% (50% - 12.5%)
  const rightBoundary = screenWidth * 0.625; // 62.5% (50% + 12.5%)
  const isLeftSide = mouseX < leftBoundary;
  const isRightSide = mouseX > rightBoundary;

  return (
    <div className="min-h-screen flex items-center justify-center">
      {songInfo ? (
        <div className="text-center flex flex-row items-center justify-between w-full h-[100vh]">
          {/* Left side control */}
          <div
            className={`pr-15 h-full w-full flex items-center justify-end transition-opacity duration-200 ${
              showControls && isLeftSide ? "opacity-100" : "opacity-0"
            }`}
          >
            <FaFastBackward className="text-4xl text-white opacity-70 hover:opacity-100 cursor-pointer" />
          </div>

          <div className="flex flex-col items-center justify-center perspective-dramatic">
            <div className="relative mb-5 w-[50vh]">
              <img
                src={songInfo.album_cover_url}
                alt={`${songInfo.track_name} cover`}
                className="z-10 w-full rounded-lg object-cover relative"
              />
              <img
                src={songInfo.album_cover_url}
                className="z-0 absolute top-0 left-0 w-full h-full rounded-lg object-cover blur-[100vh] brightness-200 saturate-200 pointer-events-none"
                aria-hidden="true"
              />
            </div>

            <h1 className="text-4xl font-bold mb-4">{songInfo.track_name}</h1>
            <p className="text-xl mb-4">{songInfo.artists.join(", ")}</p>

            {/* Progress Bar */}
            <div className="w-full max-w-md mb-2">
              <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-white h-full transition-all duration-100 ease-linear"
                  style={{
                    width: `${
                      simulatedProgress && songInfo.duration_ms
                        ? (simulatedProgress / songInfo.duration_ms) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Time Display */}
            <div className="flex justify-between w-full max-w-md text-sm text-gray-300">
              <span>
                {simulatedProgress
                  ? `${Math.floor(simulatedProgress / 60000)}:${String(
                      Math.floor((simulatedProgress % 60000) / 1000)
                    ).padStart(2, "0")}`
                  : "0:00"}
              </span>
              <span>
                {`${Math.floor(songInfo.duration_ms / 60000)}:${String(
                  Math.floor((songInfo.duration_ms % 60000) / 1000)
                ).padStart(2, "0")}`}
              </span>
            </div>
          </div>

          {/* Right side control */}
          <div
            className={`pl-15 h-full w-full flex items-center transition-opacity duration-200 ${
              showControls && isRightSide ? "opacity-100" : "opacity-0"
            }`}
          >
            <FaFastForward className="text-4xl text-white opacity-70 hover:opacity-100 cursor-pointer" />
          </div>
        </div>
      ) : (
        <h1 className="text-4xl font-bold">No song playing</h1>
      )}
    </div>
  );
}
