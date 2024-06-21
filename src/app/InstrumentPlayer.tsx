"use client";

import { useEffect, useState } from "react";
import * as Tone from "tone";

export function InstrumentPlayer() {
  const [piano, setPiano] = useState(null as Tone.Sampler | null);

  useEffect(() => {
    async function startAudioContext() {
      await Tone.start();
      console.log("Audio context started");
    }
    startAudioContext();

    setPiano(
      new Tone.Sampler({
        urls: {
          C4: "C4.mp3",
        },
        baseUrl: "https://tonejs.github.io/audio/salamander/",
      }).toDestination()
    );
  }, []);

  function clickPiano() {
    if (!piano) return;

    piano.triggerAttackRelease("C4", "4n");
  }

  return (
    <div>
      <button onClick={clickPiano} id="playPianoC">
        Play Piano Note C
      </button>
    </div>
  );
}

export default InstrumentPlayer;
