"use client";

import { useEffect } from "react";
import * as Tone from "tone";

const InstrumentPlayer: React.FC = () => {
  useEffect(() => {
    const startAudioContext = async () => {
      await Tone.start();
      console.log("Audio context started");
    };

    startAudioContext();

    const piano = new Tone.Sampler({
      urls: {
        C4: "C4.mp3",
      },
      baseUrl: "https://tonejs.github.io/audio/salamander/",
    }).toDestination();

    const playNote = (instrument: string) => {
      if (instrument === "piano") {
        piano.triggerAttackRelease("C4", "4n");
      }
    };

    const pianoButton = document.getElementById("playPianoC");

    if (pianoButton) {
      pianoButton.addEventListener("click", () => playNote("piano"));
    }

    return () => {
      if (pianoButton) {
        pianoButton.removeEventListener("click", () => playNote("piano"));
      }
    };
  }, []);

  return (
    <div>
      <button id="playPianoC">Play Piano Note C</button>
    </div>
  );
};

export default InstrumentPlayer;
