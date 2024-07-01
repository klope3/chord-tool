"use client";

import { useApp } from "@/AppContext";
import ChordCard from "@/components/ChordCard";

export default function App() {
  const { chords, playChords, currentlyPlayingIndex, currentlyPlaying } =
    useApp();

  return (
    <>
      <div className="chords-container">
        {chords.map((chord, i) => (
          <ChordCard
            pitchIndices={chord}
            isCurrentlyPlaying={currentlyPlaying && currentlyPlayingIndex === i}
          />
        ))}
      </div>
      <button onClick={playChords} disabled={currentlyPlaying}>
        Play
      </button>
    </>
  );
}
